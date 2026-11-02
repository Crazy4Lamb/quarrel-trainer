const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { build } = require("../scripts/build-h5.cjs");

(async () => {
  const { directory, version } = build();
  let revision = 0,
    apiCalls = 0;
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (url.pathname === "/phone/api" && request.method === "POST") {
      apiCalls++;
      request.resume();
      response
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify({ count: apiCalls }));
      return;
    }
    if (!url.pathname.startsWith("/phone/")) {
      response.writeHead(404).end();
      return;
    }
    const relative =
      decodeURIComponent(url.pathname.slice("/phone/".length)) || "index.html";
    const file = path.resolve(directory, relative);
    if (!file.startsWith(path.resolve(directory) + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, bytes) => {
      if (error) {
        response.writeHead(404).end();
        return;
      }
      if (relative === "service-worker.js" && revision)
        bytes = Buffer.from(
          bytes.toString().replace(version, version + "-update"),
        );
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".webmanifest": "application/manifest+json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
      };
      response
        .writeHead(200, {
          "Content-Type": types[path.extname(file)] || "text/plain",
          "Cache-Control": "no-store",
        })
        .end(bytes);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = "http://127.0.0.1:" + server.address().port,
    url = origin + "/phone/";
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const context = await browser.newContext({
        locale: "zh-CN",
        viewport: { width: 390, height: 844 },
      }),
      page = await context.newPage(),
      errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.waitForFunction(() =>
      document.getElementById("pwa-status").textContent.includes("已缓存"),
    );
    const manifest = await page.evaluate(async () =>
      fetch(document.querySelector("link[rel=manifest]").href).then(
        (response) => response.json(),
      ),
    );
    assert.equal(manifest.lang, "zh-CN");
    assert.equal(manifest.display, "standalone");
    assert.equal(
      new URL(manifest.start_url, documentURL(url)).pathname,
      "/phone/",
    );
    assert.equal(
      manifest.icons.some(
        (icon) => icon.sizes === "512x512" && icon.purpose.includes("maskable"),
      ),
      true,
    );
    assert.match(
      await page.evaluate(
        async () => (await navigator.serviceWorker.ready).scope,
      ),
      /\/phone\/$/,
    );
    console.log(
      "PASS localized manifest, original icons, project-subdirectory scope and offline preparation",
    );

    await context.setOffline(true);
    await page.reload();
    await page.click("#btn-home-start");
    await page.click("#btn-start");
    await page.fill("#reply-input", "你具体指哪一点？");
    await page.click("#btn-send");
    await page.click("#btn-end");
    await page.click("nav [data-v=history]");
    assert.equal(await page.locator("#hist-list .hist-item").count(), 1);
    console.log(
      "PASS complete offline reload, conversation, review and retained records",
    );

    await context.setOffline(false);
    await page.evaluate(async () => {
      for (let i = 0; i < 2; i++)
        await fetch("./api", {
          method: "POST",
          headers: { Authorization: "Bearer fake-test-key" },
          body: "private-test-data",
        });
    });
    assert.equal(apiCalls, 2);
    assert.equal(
      await page.evaluate(async () => !!(await caches.match("./api"))),
      false,
    );
    await page.evaluate(async () => {
      await (
        await caches.open("unrelated-app-cache")
      ).put("./unrelated", new Response("keep"));
    });
    revision = 1;
    await page.evaluate(async () =>
      (await navigator.serviceWorker.ready).update(),
    );
    await page.waitForFunction(
      () => !document.getElementById("pwa-update").hidden,
    );
    await page.click("nav [data-v=setup]");
    await page.click("#btn-start");
    await page.fill("#reply-input", "请把具体的问题说清楚。");
    await page.click("#btn-send");
    await page.click("#btn-update-pwa");
    assert.match(await page.locator("#pwa-update-note").innerText(), /先结束/);
    await page.click("#btn-end");
    const load = page.waitForEvent("load");
    await page.click("#btn-update-pwa");
    await load;
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    assert.equal(
      await page.evaluate(async () =>
        (await caches.keys()).includes("unrelated-app-cache"),
      ),
      true,
    );
    const keys = await page.evaluate(() => caches.keys());
    assert.equal(
      keys.filter((key) => key.startsWith("boundary-lab:/phone/:")).length,
      1,
    );
    assert.equal(
      keys.some((key) => key.endsWith("-update")),
      true,
    );
    await page.click("nav [data-v=history]");
    assert.equal(await page.locator("#hist-list .hist-item").count(), 2);
    console.log(
      "PASS API requests never cached, explicit safe updates, data retained and other apps’ caches preserved",
    );

    await page.click("nav [data-v=home]");
    await page.evaluate(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      event.prompt = () => {
        window.installPromptInvoked = true;
        return Promise.resolve();
      };
      event.userChoice = Promise.resolve({ outcome: "accepted" });
      window.dispatchEvent(event);
    });
    await page.click("#btn-install-home");
    assert.equal(await page.evaluate(() => window.installPromptInvoked), true);
    await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
    assert.equal(await page.locator("#btn-install-home").isVisible(), false);
    console.log(
      "PASS browser install prompt is delegated only after the install button is clicked",
    );

    const ios = await browser.newPage({
      locale: "en-US",
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    });
    await ios.goto(url);
    await ios.click("#btn-install-home");
    assert.match(
      await ios.locator("#pwa-install-help").innerText(),
      /Share.*Add to Home Screen/,
    );
    await ios.click("#btn-close-install");
    await ios.click("#btn-home-start");
    await ios.click("#btn-start");
    await ios.locator("#reply-input").focus();
    await ios.setViewportSize({ width: 390, height: 500 });
    await ios.waitForFunction(
      () => document.documentElement.dataset.keyboardOpen === "true",
    );
    assert.equal(await ios.locator("nav").isVisible(), false);
    await ios.locator("#reply-input").evaluate((element) => element.blur());
    await ios.waitForFunction(
      () => document.documentElement.dataset.keyboardOpen === "false",
    );
    assert.equal(await ios.locator("nav").isVisible(), true);
    assert.deepEqual(errors, []);
    console.log(
      "PASS Safari installation guidance and mobile keyboard layout handling",
    );
    console.log("All installable H5 checks passed.");
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
function documentURL(url) {
  return new URL("manifest.zh.webmanifest", url).href;
}
