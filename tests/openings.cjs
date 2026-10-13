const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const url = pathToFileURL(path.resolve(__dirname, "../index.html")).href;
const fixtures = [
  {
    intro: "客户临时改了周五演示的需求，同事把返工全推给你。",
    hint: "先核对需求变更记录和双方分工。",
    opening: "客户昨晚改的演示稿怎么还没更新？这次返工你来负责吧。",
  },
  {
    intro: "周一会议缺了一份数据，同事把漏发的责任推给你。",
    hint: "先问清数据发送时间和收件人。",
    opening: "今天会上的数据没到，你得解释为什么没有提前发给大家。",
  },
  {
    intro: "供应商延迟交付，同事要求你独自承担项目延期。",
    hint: "澄清哪些事情在你的职责和控制范围内。",
    opening: "供应商今天没交货，这个延期你得负责处理好。",
  },
];

(async () => {
  const browser = await chromium.launch({
    channel:
      process.env.BROWSER_CHANNEL ||
      (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", (dialog) => dialog.accept());
    await page.goto(url);
    let calls = 0;
    await page.route("https://mock.test/**", (route) => {
      calls++;
      return route.abort();
    });
    await start(page);
    assert.equal(calls, 0);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    console.log("PASS no configuration uses the preset without a request");
    await page.click("nav button[data-v=settings]");
    await page.fill("#set-baseurl", "https://mock.test/v1");
    await page.fill("#set-apikey", "fake-test-key");
    await page.fill("#set-model", "test-model");
    await page.click("#btn-save-settings");
    await page.unroute("https://mock.test/**");
    const generationRequests = [];
    let nextFixture = 0;
    await page.route("https://mock.test/**", (route) => {
      const body = route.request().postDataJSON();
      if (
        body.messages[0].content.includes("Generate a fresh session opening")
      ) {
        generationRequests.push(body);
        return reply(route, JSON.stringify(fixtures[nextFixture++]));
      }
      return reply(route, "那你先把具体的分工记录拿来看看。");
    });
    await start(page);
    assert.equal(
      await page.locator("#chat .msg.op .bubble").innerText(),
      fixtures[0].opening,
    );
    assert.match(await page.locator("#b-tp").innerText(), /周五演示/);
    assert.match(
      await page.locator("#chat .sysline").first().innerText(),
      /需求变更记录/,
    );
    await page.fill("#reply-input", "这部分需要先核对分工记录。");
    await page.click("#btn-send");
    await idle(page);
    await start(page);
    assert.equal(
      await page.locator("#chat .msg.op .bubble").innerText(),
      fixtures[1].opening,
    );
    const prompt = JSON.parse(generationRequests[1].messages[1].content);
    assert.equal(prompt.avoidRepeating[0].opening, fixtures[0].opening);
    assert.notEqual(
      prompt.sessionId,
      JSON.parse(generationRequests[0].messages[1].content).sessionId,
    );
    await page.click("#btn-language");
    assert.match(await page.locator("#b-tp").innerText(), /周一会议/);
    console.log(
      "PASS every new game generates a new situation/opening, remembers recent games and preserves its context",
    );

    // Returning the previous opening triggers one retry instead of displaying it again.
    await page.click("#btn-language");
    await page.unroute("https://mock.test/**");
    let attempts = 0;
    await page.route("https://mock.test/**", (route) =>
      reply(
        route,
        JSON.stringify(attempts++ === 0 ? fixtures[1] : fixtures[2]),
      ),
    );
    await start(page);
    assert.equal(attempts, 2);
    assert.equal(
      await page.locator("#chat .msg.op .bubble").innerText(),
      fixtures[2].opening,
    );
    console.log("PASS repeated opening is retried with a fresh situation");

    await page.unroute("https://mock.test/**");
    await page.route("https://mock.test/**", (route) =>
      reply(route, "not a JSON object"),
    );
    await start(page);
    assert.match(await page.locator("#chat").innerText(), /使用预置场景继续/);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    assert.equal(await page.locator("#reply-input").isEnabled(), true);
    console.log("PASS invalid generation falls back to a playable preset");

    await page.unroute("https://mock.test/**");
    await page.route("https://mock.test/**", (route) =>
      route.fulfill({ status: 401, body: "invalid fake key" }),
    );
    await start(page);
    assert.match(await page.locator("#chat").innerText(), /HTTP 401/);
    assert.equal(await page.locator("#btn-send").isEnabled(), true);
    console.log("PASS authentication failure still starts local practice");

    await page.unroute("https://mock.test/**");
    let pending;
    await page.route("https://mock.test/**", (route) => {
      pending = route;
    });
    await start(page, false);
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    assert.equal(
      await page.locator("#chat .msg.op:not(#typing-row)").count(),
      0,
      "No preset opening is shown before AI responds",
    );
    assert.equal(await page.locator("#reply-input").isDisabled(), true);
    await page.click("#btn-local-opponent");
    await idle(page);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    assert.match(await page.locator("#chat").innerText(), /已切换本地对手/);
    console.log("PASS manual local fallback during opening generation");

    await start(page, false);
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    await page.clock.install();
    await page.clock.fastForward(16000);
    await idle(page);
    await page.clock.resume();
    assert.match(await page.locator("#chat").innerText(), /超时/);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    console.log(
      "PASS generation timeout falls back within the 15-second limit",
    );

    await start(page, false);
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    const obsolete = pending;
    await page.click("#btn-end");
    await start(page, false);
    await page.waitForFunction(
      () => document.getElementById("btn-send").disabled,
    );
    const current = pending;
    await reply(obsolete, JSON.stringify(fixtures[0])).catch(() => {});
    const fresh = {
      intro: "新的场景",
      hint: "核对新的事实",
      opening: "请解释这次新的沟通问题。",
    };
    await reply(current, JSON.stringify(fresh));
    await idle(page);
    assert.equal(await page.locator("#chat .msg.op").count(), 1);
    assert.equal(
      await page.locator("#chat .msg.op .bubble").innerText(),
      fresh.opening,
    );
    console.log("PASS old generation cannot overwrite a newer game");
    assert.deepEqual(errors, []);
    console.log("All opening checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
async function reply(route, content) {
  return route.fulfill({ json: { choices: [{ message: { content } }] } });
}
async function idle(page) {
  await page.waitForFunction(
    () => !document.getElementById("btn-send").disabled,
  );
}
async function start(page, wait = true) {
  await page.click("nav button[data-v=setup]");
  await page.fill("#boundary-input", "");
  await page.click("#btn-start");
  assert.equal(
    await page.locator(".view.active").getAttribute("id"),
    "view-battle",
  );
  if (wait) await idle(page);
}
