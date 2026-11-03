/* Run with Playwright installed: node tests/local.cjs */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");
const { build } = require("../scripts/build-local.cjs");

(async () => {
  const { htmlPath, zipPath } = build();
  // Extract with an independent, OS-provided implementation to verify the ZIP,
  // including UTF-8 filenames. The browser then runs the extracted copy.
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), "boundary-local-"));
  let appPath = htmlPath;
  if (process.platform === "win32") {
    const quote = (value) => "'" + value.replace(/'/g, "''") + "'";
    execFileSync("powershell.exe", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Expand-Archive -LiteralPath ${quote(zipPath)} -DestinationPath ${quote(destination)}`,
    ]);
    appPath = path.join(destination, "quarrel-trainer-local", "Start.html");
    assert.equal(
      fs.readFileSync(appPath, "utf8"),
      fs.readFileSync(htmlPath, "utf8"),
    );
    assert.match(
      fs.readFileSync(
        path.join(destination, "quarrel-trainer-local", "Readme.txt"),
        "utf8",
      ),
      /无需安装/,
    );
    console.log(
      "PASS ZIP extraction, portable filenames and standalone content",
    );
  }
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const context = await browser.newContext({
      offline: true,
      locale: "zh-CN",
    });
    const page = await context.newPage();
    const errors = [],
      remoteRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/^https?:/i.test(request.url())) remoteRequests.push(request.url());
    });
    await page.goto(pathToFileURL(appPath).href);
    assert.equal(await page.locator("#methods .method").count(), 5);
    assert.equal(
      await page.locator('script[src], link[rel="stylesheet"]').count(),
      0,
    );
    assert.notEqual(
      await page
        .locator(".hero")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
      "rgba(0, 0, 0, 0)",
    );
    await page.click("#btn-home-start");
    await page.click("#btn-start");
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    await page.fill("#reply-input", "你具体指哪一点？");
    await page.click("#btn-send");
    assert.equal(await page.locator("#chat .msg.op").count(), 2);
    await page.click("#btn-end");
    assert.equal(
      await page.locator(".view.active").getAttribute("id"),
      "view-report",
    );
    await page.click("nav button[data-v=history]");
    assert.equal(await page.locator("#hist-list .hist-item").count(), 1);
    console.log(
      "PASS offline start, dialogue, review and history without a server",
    );

    await page.click("#btn-language");
    const themeBefore = await page.locator("html").getAttribute("data-theme");
    await page.click("#btn-theme");
    const savedTheme = await page.locator("html").getAttribute("data-theme");
    assert.notEqual(savedTheme, themeBefore);
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      savedTheme,
    );
    await page.click("nav button[data-v=history]");
    assert.equal(await page.locator("#hist-list .hist-item").count(), 1);
    await page.click("nav button[data-v=setup]");
    await page.click("#btn-start");
    assert.match(
      await page.locator("#chat").innerText(),
      /The project went wrong/,
    );
    assert.deepEqual(remoteRequests, []);
    assert.deepEqual(errors, []);
    console.log(
      "PASS language, theme and records persist; English works offline; zero network requests",
    );
    await page.click("nav button[data-v=setup]");
    const skillPath =
      process.platform === "win32"
        ? path.join(path.dirname(appPath), "Example-skill.json")
        : path.resolve(__dirname, "../skills/reviewer.json");
    await page.click("#btn-style-options");
    await page.locator("#skill-file").setInputFiles(skillPath);
    await page.waitForFunction(() =>
      document.getElementById("skill-select").value.startsWith("custom-"),
    );
    await page.click('#spice-seg [data-spice="2"]');
    await page.click("#btn-example");
    assert.match(
      await page.locator("#example-output").innerText(),
      /Cut the bullshit/,
    );
    assert.deepEqual(remoteRequests, []);
    await context.setOffline(false);
    await page.route("https://mock.test/**", (route) => {
      const body = route.request().postDataJSON();
      const content = body.messages[0].content.includes(
        "你是虚构场景的编剧",
      )
        ? JSON.stringify({
            intro: "A changed deadline in the portable app",
            hint: "Check the original deadline.",
            opening: "That last-minute deadline change needs a clear answer.",
          })
        : "Let’s get a specific answer on that deadline.";
      return route.fulfill({ json: { choices: [{ message: { content } }] } });
    });
    await page.click("nav button[data-v=settings]");
    await page.fill("#set-baseurl", "https://mock.test/v1");
    await page.fill("#set-apikey", "fake-test-key");
    await page.fill("#set-model", "test-model");
    await page.click("#btn-save-settings");
    await page.click("nav button[data-v=setup]");
    await page.click('#engine-seg [data-mode="ai"]');
    await page.click("#btn-start");
    await page.waitForFunction(
      () => !document.getElementById("btn-send").disabled,
    );
    assert.match(
      await page.locator("#chat .op .bubble").innerText(),
      /last-minute deadline/,
    );
    assert.equal(remoteRequests.length, 1);
    assert.deepEqual(errors, []);
    console.log(
      "PASS portable skill import, coarse offline examples and API-key dynamic mode (mocked API)",
    );
    console.log("All portable build checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
