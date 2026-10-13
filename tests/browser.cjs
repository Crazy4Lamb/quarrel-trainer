/* Install Playwright or provide its module path via NODE_PATH, then run node tests/browser.cjs. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const url = pathToFileURL(path.resolve(__dirname, "../index.html")).href;
const root = path.resolve(__dirname, "..");

(async () => {
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const errors = [];
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      colorScheme: "light",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    let acceptDialog = true;
    page.on("dialog", (dialog) =>
      acceptDialog ? dialog.accept() : dialog.dismiss(),
    );
    await page.goto(url);
    assert.equal(await page.locator("#methods .method").count(), 5);
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.locator("#methods summary").first().click();
    assert.equal(
      await page.locator("#methods details").first().getAttribute("open"),
      "",
    );
    await page.locator("#methods summary").first().click();
    const mainStart = await page.locator("#btn-home-start").boundingBox();
    assert(mainStart.y + mainStart.height < 1000);
    fs.mkdirSync(path.join(root, "docs/images"), { recursive: true });
    await page.screenshot({
      path: path.join(root, "docs/images/home.png"),
      animations: "disabled",
    });
    console.log("PASS home: visible start, toolkit, desktop layout");

    await page.click("#btn-language");
    await page.click("#btn-theme");
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.click("#btn-home-start");
    assert.equal(await page.locator(".scene").count(), 5);
    await page.click("#btn-start");
    assert.match(
      await page.locator("#chat").innerText(),
      /The project went wrong/,
    );
    await page.fill("#reply-input", "What do you mean specifically?");
    await page.click("#btn-send");
    assert.match(await page.locator("#chat .tags").innerText(), /Clarify/);
    const dialogText = await page.locator("#chat .bubble").allTextContents();
    await page.fill("#reply-input", "Unsent response <test>");
    await page.click("#btn-language");
    assert.equal(
      await page.locator("#reply-input").inputValue(),
      "Unsent response <test>",
    );
    assert.deepEqual(
      await page.locator("#chat .bubble").allTextContents(),
      dialogText,
    );
    await page.click("#btn-end");
    assert.equal(
      await page.locator(".view.active").getAttribute("id"),
      "view-report",
    );
    await page.click("#btn-language");
    assert.match(
      await page.locator("#view-report").innerText(),
      /Practice notes/,
    );
    await page.click("nav button[data-v=history]");
    assert.match(
      await page.locator("#hist-list").innerText(),
      /The blame-shifter/,
    );
    assert.match(
      await page.locator("#hist-list").innerText(),
      /What do you mean specifically/,
    );
    console.log(
      "PASS localization: English dialogue, scoring, review, history and retained drafts",
    );

    await page.click("nav button[data-v=me]");
    await page.check("#weak-list input[value=avoid]");
    await page.fill("#profile-role", '<img src=x onerror="window.xss=1">');
    await page.click("#btn-language");
    assert.equal(
      await page.locator("#weak-list input[value=avoid]").isChecked(),
      true,
    );
    assert.equal(
      await page.locator("#profile-role").inputValue(),
      '<img src=x onerror="window.xss=1">',
    );
    await page.click("#btn-save-profile");
    assert.match(
      await page.locator("#strategy-box h4").innerText(),
      /提前设防/,
    );
    assert.equal(await page.locator("#strategy-box img").count(), 0);
    assert.equal(await page.evaluate(() => window.xss), undefined);
    await page.click("nav button[data-v=settings]");
    await page.fill("#set-baseurl", "https://mock.test/v1/chat/completions/");
    await page.fill("#set-apikey", "fake-test-key");
    await page.fill("#set-model", "test-model");
    await page.click("#btn-language");
    assert.equal(
      await page.locator("#set-apikey").inputValue(),
      "fake-test-key",
    );
    await page.click("#btn-show-key");
    assert.equal(
      await page.locator("#set-apikey").getAttribute("type"),
      "text",
    );
    await page.click("#btn-show-key");
    await page.click("#btn-save-settings");
    assert.match(
      await page.locator("#test-result").innerText(),
      /Configuration saved/,
    );
    await page.click("#btn-language");
    assert.match(await page.locator("#test-result").innerText(), /配置已保存/);
    await page.click("#btn-language");
    await page.reload();
    await page.click("nav button[data-v=settings]");
    assert.equal(await page.locator("#set-model").inputValue(), "test-model");
    await page.selectOption("#pref-theme", "system");
    await page.emulateMedia({ colorScheme: "light" });
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "light",
    );
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light",
    );
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    console.log(
      "PASS profile strategy, safe text rendering, settings drafts, preferences and system theme",
    );

    const requests = [];
    await page.route("https://mock.test/**", (route) => {
      requests.push({
        url: route.request().url(),
        body: route.request().postDataJSON(),
      });
      if (fulfillGeneratedOpening(route)) return;
      return route.fulfill({
        json: {
          choices: [
            { message: { content: "Please tell me which part you mean." } },
          ],
        },
      });
    });
    await page.click("#btn-test-settings");
    await page.waitForFunction(
      () => !document.getElementById("btn-test-settings").disabled,
    );
    assert.match(
      await page.locator("#test-result").innerText(),
      /Connection successful/,
    );
    assert.equal(requests[0].url, "https://mock.test/v1/chat/completions");
    await page.click("nav button[data-v=setup]");
    await page.fill("#boundary-input", "Personal attacks are not acceptable.");
    await page.click("#btn-start");
    await idle(page);
    assert.match(requests.at(-1).body.messages[0].content, /使用英文输出/);
    assert.equal(await page.locator("#chat .msg.op").count(), 2);
    console.log(
      "PASS saved AI configuration, full endpoint, boundary opening and English prompt",
    );

    await page.unroute("https://mock.test/**");
    let failedRequests = 0;
    await page.route("https://mock.test/**", (route) => {
      failedRequests++;
      return route.fulfill({ status: 401, body: "invalid fake key" });
    });
    await freshBattle(page);
    await send(page, "Which part specifically?");
    await idle(page);
    assert.match(await page.locator("#chat").innerText(), /HTTP 401/);
    await send(page, "Please stop the personal attacks.");
    await idle(page);
    assert.equal(
      failedRequests,
      1,
      "Failed AI should not be retried each turn",
    );
    console.log("PASS failed AI fallback and subsequent local turns");

    await page.unroute("https://mock.test/**");
    await page.route("https://mock.test/**", (route) =>
      fulfillGeneratedOpening(route),
    );
    await freshBattle(page);
    await send(page, "Could you explain the issue?");
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    await page.click("nav button[data-v=setup]");
    acceptDialog = false;
    await page.click("#btn-start");
    acceptDialog = true;
    await page.click("#btn-resume");
    assert.equal(
      await page.locator("#btn-send").isDisabled(),
      true,
      "Cancel restart preserves pending session",
    );
    await page.click("#btn-local-opponent");
    await idle(page);
    assert.match(
      await page.locator("#chat").innerText(),
      /Switched to a local opponent/,
    );
    await freshBattle(page);
    await send(page, "Could you explain the issue?");
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    await page.clock.install();
    await page.clock.fastForward(16000);
    await idle(page);
    assert.match(await page.locator("#chat").innerText(), /timed out/);
    await freshBattle(page);
    await send(page, "Could you explain the issue?");
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    await page.click("#btn-end");
    await freshBattle(page);
    await page.clock.fastForward(16000);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    assert.equal(await page.locator("#btn-send").isEnabled(), true);
    await page.clock.resume();
    console.log(
      "PASS restart cancellation, resume, manual fallback, timeout and request isolation",
    );

    await page.click("nav button[data-v=settings]");
    await page.fill("#set-baseurl", "javascript:alert(1)");
    await page.click("#btn-save-settings");
    assert.match(await page.locator("#test-result").innerText(), /valid http/);
    await page.fill("#set-baseurl", "https://mock.test/v1/messages");
    await page.click("#fmt-seg button[data-f=anthropic]");
    await page.click("#btn-save-settings");
    await page.unroute("https://mock.test/**");
    await page.route("https://mock.test/**", (route) => {
      requests.push({
        url: route.request().url(),
        body: route.request().postDataJSON(),
      });
      if (fulfillGeneratedOpening(route)) return;
      return route.fulfill({
        json: { content: [{ type: "text", text: "Let’s look at the facts." }] },
      });
    });
    await freshBattle(page);
    await send(page, "Could you explain the issue?");
    await idle(page);
    assert.equal(requests.at(-1).url, "https://mock.test/v1/messages");
    assert.equal(
      await page.evaluate(
        () => analyze("I am not lending more money.").selfVerify,
      ),
      false,
    );
    // An AI reply may finish a session while another page is open; preserve that page.
    await page.unroute("https://mock.test/**");
    let finalReply;
    await page.route("https://mock.test/**", (route) => {
      if (fulfillGeneratedOpening(route)) return;
      finalReply = route;
    });
    await freshBattle(page);
    await page.evaluate(() => (battle.turn = battle.maxRounds - 1));
    await send(page, "Let’s discuss the facts calmly.");
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    await page.click("nav button[data-v=settings]");
    await finalReply.fulfill({
      json: {
        content: [
          { type: "text", text: "All right, let’s check the records." },
        ],
      },
    });
    await idle(page);
    assert.equal(
      await page.locator(".view.active").getAttribute("id"),
      "view-settings",
    );
    await page.click("nav button[data-v=setup]");
    assert.match(
      await page.locator("#btn-resume").innerText(),
      /latest review/,
    );
    await page.click("#btn-resume");
    assert.equal(
      await page.locator(".view.active").getAttribute("id"),
      "view-report",
    );
    console.log("PASS URL validation and Anthropic endpoint");

    // Separate context: storage unavailable, Chinese IME, responsive layout and documentation images.
    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      colorScheme: "light",
    });
    mobile.on("pageerror", (error) => errors.push(error.message));
    await mobile.addInitScript(() =>
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("Storage unavailable");
        },
      }),
    );
    await mobile.goto(url);
    for (const width of [320, 390, 768, 1440]) {
      await mobile.setViewportSize({ width, height: 844 });
      assert.equal(
        await mobile.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        "No horizontal overflow at " + width,
      );
    }
    await mobile.setViewportSize({ width: 390, height: 844 });
    const mobileStart = await mobile.locator("#btn-home-start").boundingBox();
    assert(mobileStart.y + mobileStart.height < 768);
    await mobile.click("#btn-home-start");
    await mobile.screenshot({
      path: path.join(root, "docs/images/setup.png"),
      animations: "disabled",
    });
    await mobile.click("#btn-start");
    await mobile.fill("#reply-input", "你具体指哪一点？");
    await mobile
      .locator("#reply-input")
      .dispatchEvent("keydown", { key: "Enter", isComposing: true });
    assert.equal(
      await mobile.locator("#chat .msg.me").count(),
      0,
      "IME confirmation should not send",
    );
    await mobile.click("#btn-send");
    await mobile.screenshot({
      path: path.join(root, "docs/images/battle.png"),
      animations: "disabled",
    });
    await mobile.click("nav button[data-v=settings]");
    assert.equal(await mobile.locator("#storage-warn").isVisible(), true);
    await mobile.fill("#set-baseurl", "https://mock.test/v1");
    await mobile.fill("#set-apikey", "fake-test-key");
    await mobile.fill("#set-model", "test-model");
    await mobile.click("#btn-save-settings");
    assert.match(
      await mobile.locator("#test-result").innerText(),
      /配置已保存/,
    );
    await mobile.click("#btn-language");
    assert.equal(await mobile.locator("html").getAttribute("lang"), "en");
    console.log(
      "PASS mobile/tablet/desktop sizing, IME, blocked storage and in-memory preferences",
    );
    assert.deepEqual(errors, []);
    console.log("All browser checks passed.");
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
async function send(page, text) {
  await page.fill("#reply-input", text);
  await page.click("#btn-send");
}
async function freshBattle(page) {
  await page.click("nav button[data-v=setup]");
  await page.fill("#boundary-input", "");
  await page.click("#btn-start");
  assert.equal(
    await page.locator(".view.active").getAttribute("id"),
    "view-battle",
  );
  await idle(page);
}

let generatedSession = 0;
function fulfillGeneratedOpening(route) {
  const body = route.request().postDataJSON();
  const system =
    body.system ||
    body.messages?.find((message) => message.role === "system")?.content ||
    "";
  if (!system.includes("Generate a fresh session opening")) return;
  const content = JSON.stringify({
    intro: "A new delivery issue, session " + ++generatedSession,
    hint: "Ask for the specific record.",
    opening:
      "The delivery report for session " +
      generatedSession +
      " needs an explanation. What happened?",
  });
  return route.fulfill({
    json: {
      choices: [{ message: { content } }],
      content: [{ type: "text", text: content }],
    },
  });
}
