const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { build } = require("../scripts/build-local.cjs");
const root = path.resolve(__dirname, "..");
async function visibleStart(page) {
  const box = await page.locator("#btn-start").boundingBox();
  assert(
    box && box.y >= 0 && box.y + box.height <= page.viewportSize().height,
    "Start button is in the viewport",
  );
}
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
        offline: true,
        viewport: { width: 1440, height: 960 },
      }),
      errors = [],
      remote = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/^https?:/.test(request.url())) remote.push(request.url());
    });
    await page.goto(pathToFileURL(path.join(root, "index.html")).href);
    assert.deepEqual(
      await page.locator("#home-stats strong").allTextContents(),
      ["0 局", "5 个场景", "5 个心法"],
    );
    await page.screenshot({
      path: path.join(root, ".workbuddy/home-clear-counts.png"),
      animations: "disabled",
    });
    await page.click("#btn-home-start");
    assert.equal(
      await page.locator("#setup-customize").getAttribute("open"),
      null,
    );
    assert.equal(await page.locator("#skill-select").isVisible(), false);
    assert.equal(await page.locator("#persona-input").isVisible(), false);
    assert.equal(await page.locator("#engine-seg").isVisible(), false);
    assert.equal(
      await page.locator("#scene-grid .scene[aria-pressed=true]").count(),
      1,
    );
    assert.match(
      await page.locator("#setup-summary").innerText(),
      /职场甩锅侠.*常规.*文明过招/,
    );
    await visibleStart(page);
    await page.screenshot({
      path: path.join(root, "docs/images/setup.png"),
      animations: "disabled",
      fullPage: true,
    });
    await page.click("#btn-start");
    assert.equal(
      await page.locator(".view.active").getAttribute("id"),
      "view-battle",
    );
    assert.equal(await page.locator("#chat .op").count(), 1);
    await page.fill("#reply-input", "你具体指哪一点？");
    await page.click("#btn-send");
    await page.click("#btn-end");
    await page.click("nav [data-v=home]");
    assert.equal(
      await page.locator("#home-stats strong").first().innerText(),
      "1 局",
    );
    console.log(
      "PASS readable counts and starting a full round without opening customization",
    );

    await page.click("nav [data-v=setup]");
    await page.click("#scene-grid [data-id=friend]");
    await page.click('#diff-seg [data-d="0"]');
    await page.click('#spice-seg [data-spice="1"]');
    assert.match(
      await page.locator("#setup-summary").innerText(),
      /越界损友.*轻松.*阴阳吐槽/,
    );
    assert.match(
      await page.locator("#setup-scene-description").innerText(),
      /借的钱/,
    );
    await page.click("#btn-start");
    assert.match(await page.locator("#b-round").innerText(), /1 \/ 4/);
    await page.click("#btn-end");
    await page.click("nav [data-v=setup]");
    await page.click("#btn-language");
    assert.match(
      await page.locator("#setup-summary").innerText(),
      /boundary-crossing friend.*Easy.*Cheeky/,
    );
    assert.equal(
      await page.locator("#setup-customize").getAttribute("open"),
      null,
    );
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await visibleStart(page);
      await page.evaluate(() =>
        scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
      );
      await visibleStart(page);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        "No horizontal overflow at " + width,
      );
    }
    console.log(
      "PASS selection summary, independent settings, bilingual copy and visible start at every width",
    );

    await page.click("#btn-style-options");
    assert.equal(
      await page.locator("#setup-customize").getAttribute("open"),
      "",
    );
    await page.fill("#persona-input", "Short, playful questions.");
    await page.selectOption("#skill-select", "comic");
    await page.locator("#setup-customize > summary").click();
    assert.equal(await page.locator("#skill-select").isVisible(), false);
    await page.click("#btn-style-options");
    assert.equal(await page.locator("#skill-select").inputValue(), "comic");
    assert.equal(
      await page.locator("#persona-input").inputValue(),
      "Short, playful questions.",
    );
    await page.selectOption("#skill-select", "standard");
    await page.fill("#persona-input", "");
    await page.locator("#setup-customize > summary").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: path.join(root, ".workbuddy/setup-clear-mobile-en.png"),
      animations: "disabled",
    });
    assert.deepEqual(remote, []);
    assert.deepEqual(errors, []);
    console.log(
      "PASS optional customization expands on request and preserves selections when collapsed",
    );

    const { htmlPath } = build();
    const portable = await browser.newPage({
      locale: "en-US",
      offline: true,
      viewport: { width: 390, height: 844 },
    });
    await portable.goto(pathToFileURL(htmlPath).href);
    assert.deepEqual(
      await portable.locator("#home-stats strong").allTextContents(),
      ["0 sessions", "5 scenarios", "5 techniques"],
    );
    await portable.click("#btn-home-start");
    await visibleStart(portable);
    assert.equal(
      await portable.locator("#setup-customize").getAttribute("open"),
      null,
    );
    await portable.click("#btn-start");
    assert.equal(await portable.locator("#chat .op").count(), 1);
    console.log(
      "PASS portable bundle uses the same simple first-run flow offline",
    );
    console.log("All setup usability checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
