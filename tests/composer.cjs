const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const url =
  process.env.COMPOSER_URL ||
  pathToFileURL(path.resolve(__dirname, "../index.html")).href;

(async () => {
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      locale: "zh-CN",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openKeyboard(page);
    await pressSend(page);
    assert.equal(
      await page.locator("#chat .msg.me").count(),
      1,
      "The first press must send even while the keyboard is open",
    );
    assert.equal(await page.locator("#reply-input").inputValue(), "");
    assert.equal(
      await page
        .locator("#reply-input")
        .evaluate((element) => element === document.activeElement),
      true,
    );
    assert.equal(await page.locator("nav").isVisible(), false);
    await page.keyboard.insertText("明天再看。");
    await pressSend(page);
    assert.equal(
      await page.locator("#chat .msg.me").count(),
      2,
      "Typing can continue without tapping the input again",
    );
    console.log(
      "PASS one press sends while the keyboard stays open, including the next reply",
    );

    await page.keyboard.insertText("还有一点。");
    const box = await page.locator("#btn-send").boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(5, 5);
    await page.mouse.up();
    assert.equal(await page.locator("#chat .msg.me").count(), 2);
    assert.equal(await page.locator("#reply-input").inputValue(), "还有一点。");
    await page
      .locator("#reply-input")
      .dispatchEvent("keydown", { key: "Enter", isComposing: true });
    await page
      .locator("#reply-input")
      .dispatchEvent("keydown", { key: "Enter", keyCode: 229 });
    assert.equal(
      await page.locator("#chat .msg.me").count(),
      2,
      "Confirming an IME candidate must not submit",
    );
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.insertText("补充内容。");
    assert.equal(await page.locator("#chat .msg.me").count(), 2);
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#chat .msg.me").count(), 3);
    assert.equal(
      await page.locator("#chat .msg.me .bubble").last().innerText(),
      "还有一点。\n补充内容。",
    );
    await page.fill("#reply-input", "晚点继续。");
    await page.locator("#btn-send").focus();
    await page.keyboard.press("Space");
    assert.equal(
      await page.locator("#chat .msg.me").count(),
      4,
      "Keyboard users can still activate the send button",
    );
    console.log(
      "PASS cancelled presses retain the draft, Chinese IME confirmation, newline and keyboard submission",
    );

    const touch = await browser.newPage({
      viewport: { width: 390, height: 844 },
      locale: "zh-CN",
      isMobile: true,
      hasTouch: true,
    });
    touch.on("pageerror", (error) => errors.push(error.message));
    await openKeyboard(touch);
    await touch.locator("#btn-send").tap();
    assert.equal(await touch.locator("#chat .msg.me").count(), 1);
    assert.equal(
      await touch
        .locator("#reply-input")
        .evaluate((element) => element === document.activeElement),
      true,
    );
    await touch.keyboard.insertText("先保留这句话。");
    const target = await touch.locator("#btn-send").boundingBox();
    const cdp = await touch.context().newCDPSession(touch);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: target.x + target.width / 2, y: target.y + target.height / 2 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchCancel",
      touchPoints: [],
    });
    assert.equal(
      await touch.locator("#chat .msg.me").count(),
      1,
      "A cancelled touch must never send",
    );
    assert.equal(
      await touch.locator("#reply-input").inputValue(),
      "先保留这句话。",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS native touch tap sends once, cancelled touch never submits",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function openKeyboard(page) {
  await page.goto(url);
  await page.click("#btn-home-start");
  await page.click("#btn-start");
  await page.fill("#reply-input", "请具体说明问题。");
  // Model a keyboard shrinking the viewport while the reply keeps focus.
  await page.setViewportSize({ width: 390, height: 500 });
  await page.waitForFunction(
    () => document.documentElement.dataset.keyboardOpen === "true",
  );
  await page.locator("#btn-send").scrollIntoViewIfNeeded();
}

async function pressSend(page) {
  const box = await page.locator("#btn-send").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  // A real tap spans frames; blur handlers must not move the button before release.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await page.mouse.up();
}
