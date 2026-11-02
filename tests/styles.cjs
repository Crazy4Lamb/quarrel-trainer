const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "..");
const app = pathToFileURL(path.join(root, "index.html")).href;
(async () => {
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const page = await browser.newPage({
        locale: "zh-CN",
        viewport: { width: 1440, height: 1050 },
      }),
      errors = [],
      requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", (dialog) => dialog.accept());
    await page.route("https://mock.test/**", (route) => {
      requests.push(route.request().postDataJSON());
      return route.abort();
    });
    await page.goto(app);
    await page.click("#btn-home-start");
    await page.selectOption("#skill-select", "comic");
    await page.click('#spice-seg [data-spice="2"]');
    assert.equal(
      await page.locator('#diff-seg [data-d="1"]').getAttribute("aria-pressed"),
      "true",
    );
    assert.match(
      await page.locator('#spice-seg [data-spice="2"]').innerText(),
      /爷就喜欢俗的/,
    );
    await page.click("#btn-example");
    assert.match(
      await page.locator("#example-output").innerText(),
      /预置.*\n少他妈/,
    );
    await page.click("#btn-start");
    assert.match(
      await page.locator("#chat .op .bubble").innerText(),
      /妈的.*好家伙/,
    );
    await page.fill("#reply-input", "你具体指哪一点？");
    await page.click("#btn-send");
    assert.match(
      (await page.locator("#chat .op .bubble").allTextContents()).at(-1),
      /妈的.*导航/,
    );
    assert.equal(requests.length, 0);
    console.log(
      "PASS built-in skills, coarse offline wording, examples and independent difficulty",
    );

    await page.click("nav [data-v=setup]");
    await page
      .locator("#skill-file")
      .setInputFiles(path.join(root, "skills/reviewer.json"));
    await page.waitForFunction(() =>
      document.getElementById("skill-feedback").textContent.includes("已加载"),
    );
    const imported = await page.locator("#skill-select").inputValue();
    assert.match(imported, /^custom-/);
    await page.click('#spice-seg [data-spice="0"]');
    await page.click("#btn-example");
    assert.match(
      await page.locator("#example-output").innerText(),
      /证据还在起跑线/,
    );
    await page.click("#btn-start");
    assert.match(
      await page.locator("#chat .op .bubble").innerText(),
      /^先把依据摆出来/,
    );
    await page.click("nav [data-v=setup]");
    const download = page.waitForEvent("download");
    await page.click("#btn-export-skill");
    const exported = await download;
    const exportPath = path.join(root, ".workbuddy/exported-style.json");
    await exported.saveAs(exportPath);
    const pack = JSON.parse(fs.readFileSync(exportPath, "utf8"));
    assert.equal(pack.version, 1);
    assert.equal(pack.name.zh, "犀利审稿人");
    await page.locator("#skill-file").setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":1}'),
    });
    await page.waitForFunction(() =>
      document.getElementById("skill-feedback").textContent.includes("未加载"),
    );
    assert.equal(await page.locator("#skill-select").inputValue(), imported);
    console.log(
      "PASS JSON import, offline skill lines, export and invalid pack preservation",
    );

    await page.locator("#skill-file").setInputFiles({
      name: "SKILL.md",
      mimeType: "text/markdown",
      buffer: Buffer.from(
        "# 反问大师\n每次只用一个反问句，挑明对方的偷换前提。",
      ),
    });
    await page.waitForFunction(() =>
      document
        .getElementById("skill-feedback")
        .textContent.includes("反问大师"),
    );
    assert.match(
      await page.locator("#skill-description").innerText(),
      /没有当前语言的离线台词/,
    );
    await page.fill("#persona-input", "原创冷幽默，短句反问");
    await page.reload();
    await page.click("#btn-home-start");
    assert.match(
      await page.locator("#persona-input").inputValue(),
      /原创冷幽默/,
    );
    assert.match(
      await page.locator("#skill-select option:checked").innerText(),
      /反问大师/,
    );
    await page.click("#btn-remove-skill");
    assert.equal(await page.locator("#skill-select").inputValue(), "standard");
    console.log(
      "PASS Markdown skills, honest offline fallback, persistence and removal",
    );

    await page.click("nav [data-v=settings]");
    await page.fill("#set-baseurl", "https://mock.test/v1");
    await page.fill("#set-apikey", "fake-test-key");
    await page.fill("#set-model", "test-model");
    await page.click("#btn-save-settings");
    await page.click("nav [data-v=setup]");
    await page.click('#engine-seg [data-mode="local"]');
    await page.click("#btn-example");
    await page.click("#btn-start");
    await page.click("#btn-end");
    assert.equal(requests.length, 0);
    console.log(
      "PASS explicit offline mode makes no API requests even with a saved key, including review",
    );

    await page.unroute("https://mock.test/**");
    await page.route("https://mock.test/**", (route) => {
      const body = route.request().postDataJSON();
      requests.push(body);
      const system = body.messages[0].content;
      let content = system.includes("Generate a fresh session opening")
        ? JSON.stringify({
            intro: "临时改需求的同事",
            hint: "先核对需求记录",
            opening: "今晚临时改的需求你得接住，别跟我讲条件。",
          })
        : system.includes("comeback example")
          ? "你这临时需求可真会挑下班时间，凭什么只改我的计划？"
          : "别把流程当挡箭牌，你得把具体安排说清楚。";
      return route.fulfill({ json: { choices: [{ message: { content } }] } });
    });
    await page.click("nav [data-v=setup]");
    await page.click('#engine-seg [data-mode="ai"]');
    await page.selectOption("#skill-select", imported);
    await page.click('#spice-seg [data-spice="2"]');
    await page.click('#diff-seg [data-d="2"]');
    await page.fill("#example-input", "你今晚必须加班，我不管你有没有安排。");
    await page.click("#btn-example");
    await idleExample(page);
    assert.match(
      await page.locator("#example-output").innerText(),
      /AI 新创作/,
    );
    const exampleRequest = requests.at(-1);
    assert.match(exampleRequest.messages[0].content, /原创冷幽默|styleNotes/);
    assert.match(exampleRequest.messages[0].content, /meticulous reviewer/);
    assert.match(exampleRequest.messages[0].content, /Coarse:/);
    assert.match(exampleRequest.messages[1].content, /今晚必须加班/);
    await page.click("#btn-start");
    await idle(page);
    const generation = requests.at(-1);
    const params = JSON.parse(generation.messages[1].content);
    assert.equal(params.spiceLevel, 2);
    assert.equal(params.difficulty, "挑战");
    assert.match(params.styleNotes, /原创冷幽默/);
    await page.fill("#reply-input", "你为什么不先确认各自的安排？");
    await page.click("#btn-send");
    await idle(page);
    assert.match(requests.at(-1).messages[0].content, /meticulous reviewer/);
    assert.match(requests.at(-1).messages[0].content, /Coarse:/);
    assert.match(
      (await page.locator("#chat .op .bubble").allTextContents()).at(-1),
      /^别把流程/,
    );
    console.log(
      "PASS AI examples, dynamic openings and subsequent replies receive persona, skill, spice and difficulty",
    );

    await page.click("nav [data-v=setup]");
    await page.click("#btn-language");
    assert.match(
      await page.locator('#spice-seg [data-spice="2"]').innerText(),
      /Keep it crude/,
    );
    assert.match(
      await page.locator("#skill-select option:checked").innerText(),
      /pointed reviewer/,
    );
    await page.click("#btn-theme");
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        "No overflow at " + width,
      );
    }
    await page.screenshot({
      path: path.join(root, ".workbuddy/style-lab-desktop.png"),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(root, ".workbuddy/style-lab-mobile.png"),
      fullPage: true,
      animations: "disabled",
    });
    assert.deepEqual(errors, []);
    console.log("All style and skill checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
async function idle(page) {
  await page.waitForFunction(
    () => !document.getElementById("btn-send").disabled,
  );
}
async function idleExample(page) {
  await page.waitForFunction(
    () => !document.getElementById("btn-example").disabled,
  );
}
