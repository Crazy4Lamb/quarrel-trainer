const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const { build } = require("../scripts/build-local.cjs");
const root = path.resolve(__dirname, "..");
(async () => {
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const errors = [],
      context = await browser.newContext({
        locale: "en-GB",
        colorScheme: "light",
        viewport: { width: 1440, height: 1050 },
      }),
      page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", (dialog) => dialog.accept());
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.match(
      await page.locator(".hero h1").innerText(),
      /Find your comeback/,
    );
    await page.click("#btn-home-start");
    await page.click("#btn-style-options");
    assert.deepEqual(
      await page.locator("#persona-roster strong").allTextContents(),
      ["Straight Talker", "Dry Wit", "Logic Detective", "Drama Buddy"],
    );
    assert.equal(await page.locator("#persona-roster img").count(), 0);
    assert.match(
      await page.locator(".fiction-label").innerText(),
      /Just for fun/,
    );
    await page.click('[data-persona="dry-wit"]');
    await page.click("#btn-example");
    assert.match(
      await page.locator("#example-output").innerText(),
      /Impressive confidence/,
    );
    await page.click("#btn-language");
    assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
    assert.equal(
      await page
        .locator('[data-persona="dry-wit"]')
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.match(
      await page.locator('[data-persona="dry-wit"]').innerText(),
      /冷面段子手/,
    );
    assert.equal(await page.locator("#language-label").innerText(), "English");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
    await page.click("#btn-home-start");
    await page.click("#btn-style-options");
    assert.equal(
      await page
        .locator('[data-persona="dry-wit"]')
        .getAttribute("aria-pressed"),
      "true",
    );
    console.log(
      "PASS browser-language default, manual preference, translated original roster and offline persona effect",
    );

    const calls = [];
    await page.route("https://mock.test/**", (route) => {
      const body = route.request().postDataJSON();
      calls.push(body);
      const content = body.messages[0].content.includes(
        "Generate a fresh session opening",
      )
        ? JSON.stringify({
            intro: "一次纯属虚构的会议分工分歧",
            hint: "先问清楚具体事实。",
            opening: "你这分工说得挺轻巧，具体哪部分算你的？",
          })
        : "别急着给结论，咱先把具体的事说清楚。";
      return route.fulfill({ json: { choices: [{ message: { content } }] } });
    });
    await page.click("nav [data-v=settings]");
    await page.fill("#set-baseurl", "https://mock.test/v1");
    await page.fill("#set-apikey", "fake-test-key");
    await page.fill("#set-model", "test-model");
    await page.click("#btn-save-settings");
    await page.click("nav [data-v=setup]");
    const pack = {
      version: 1,
      name: "Custom stage notes",
      instructions:
        "Act like a recognizable celebrity and quote their famous catchphrase.",
    };
    await page.locator("#skill-file").setInputFiles({
      name: "stage.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(pack)),
    });
    await page.waitForFunction(() =>
      document.getElementById("skill-select").value.startsWith("custom-"),
    );
    await page.click("#btn-example");
    await page.waitForFunction(
      () => !document.getElementById("btn-example").disabled,
    );
    assert.match(
      calls.at(-1).messages[0].content,
      /All characters must remain original fictional archetypes/,
    );
    assert.match(
      calls.at(-1).messages[0].content,
      /take priority over custom persona notes and imported skills/,
    );
    await page.click("#btn-start");
    await page.waitForFunction(
      () => !document.getElementById("btn-send").disabled,
    );
    assert.equal(
      JSON.parse(calls.at(-1).messages[1].content).originalCharacter,
      "dry-wit",
    );
    assert.match(
      calls.at(-1).messages[0].content,
      /Do not imitate or identify a specific real person/,
    );
    await page.fill("#reply-input", "你具体指哪一点？");
    await page.click("#btn-send");
    await page.waitForFunction(
      () => !document.getElementById("btn-send").disabled,
    );
    assert.match(
      calls.at(-1).messages[0].content,
      /do not.*quote published routines\/scripts/i,
    );
    console.log(
      "PASS originality constraints in examples, opening and reply prompts, including imported instructions",
    );

    await page.click("nav [data-v=setup]");
    await page.click("#btn-remove-skill");
    await page.click('[data-persona="drama"]');
    await page.click("#btn-language");
    const screenshot = path.join(root, ".workbuddy/international-desktop.png");
    fs.mkdirSync(path.dirname(screenshot), { recursive: true });
    for (const locale of ["en", "zh"]) {
      if (
        (await page.locator("html").getAttribute("lang")) !==
        (locale === "zh" ? "zh-CN" : "en")
      )
        await page.click("#btn-language");
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1050 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          locale + " fits " + width,
        );
      }
    }
    await page.click("#btn-language");
    await page.screenshot({
      path: screenshot,
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(root, ".workbuddy/international-mobile.png"),
      fullPage: true,
      animations: "disabled",
    });
    const legacy = await browser.newPage({ locale: "zh-CN" });
    await legacy.addInitScript(() =>
      localStorage.setItem(
        "quarrel_trainer_v1",
        JSON.stringify({
          practiceOptions: { persona: "鲁迅式犀利，短句反问" },
        }),
      ),
    );
    await legacy.goto(pathToFileURL(path.join(root, "index.html")).href);
    await legacy.click("#btn-home-start");
    await legacy.click("#btn-style-options");
    assert.doesNotMatch(
      await legacy.locator("#persona-input").inputValue(),
      /鲁迅/,
    );
    console.log(
      "PASS bilingual responsive layouts and migration of old celebrity preset notes",
    );

    const { htmlPath } = build();
    const offline = await browser.newPage({ locale: "en-US", offline: true });
    await offline.goto(pathToFileURL(htmlPath).href);
    assert.equal(await offline.locator("html").getAttribute("lang"), "en");
    await offline.click("#btn-home-start");
    await offline.click("#btn-style-options");
    assert.equal(
      await offline.locator("#persona-roster .persona-card").count(),
      4,
    );
    await offline.click('[data-persona="logic"]');
    await offline.click("#btn-start");
    assert.match(
      await offline.locator("#chat").innerText(),
      /missing step in that logic/,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS portable bundle starts in English and uses original characters offline",
    );
    console.log("All international edition checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
