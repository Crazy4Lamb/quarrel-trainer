/* 真实浏览器验证：配置保存 + 持久化 + 存储降级 */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGE_ERROR:', e.message));

  await page.goto('http://127.0.0.1:18923/index.html');
  await page.waitForTimeout(400);

  // ---- 1. 填配置 + 保存 ----
  await page.click('nav button[data-v=settings]');
  await page.fill('#set-baseurl', 'https://api.deepseek.com');
  await page.fill('#set-apikey', 'sk-test-12345');
  await page.fill('#set-model', 'deepseek-chat');
  await page.click('#fmt-seg button[data-f=anthropic]');   // 切格式
  await page.click('#fmt-seg button[data-f=openai]');      // 再切回
  await page.click('#btn-save-settings');
  await page.waitForTimeout(300);
  console.log('SAVE_MSG:', (await page.textContent('#test-result')).trim());
  console.log('LS_RAW:', await page.evaluate(() => localStorage.getItem('quarrel_trainer_v1')));
  console.log('STATUS:', (await page.textContent('#llm-status')).trim());

  // ---- 2. 刷新后回填 ----
  await page.reload();
  await page.waitForTimeout(400);
  await page.click('nav button[data-v=settings]');
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => ({
    baseUrl: document.getElementById('set-baseurl').value,
    apiKey: document.getElementById('set-apikey').value,
    model: document.getElementById('set-model').value,
  }));
  console.log('AFTER_RELOAD:', JSON.stringify(after));
  console.log('STATUS_AFTER_RELOAD:', (await page.textContent('#llm-status')).trim());

  // ---- 3. 开吵时 LLM 是否被启用 ----
  await page.click('nav button[data-v=setup]');
  await page.click('#btn-start');
  await page.waitForTimeout(300);
  const sysMsgs = await page.$$eval('#chat .sysline', els => els.map(e => e.textContent));
  console.log('BATTLE_SYS:', sysMsgs.join(' | '));

  // ---- 4. 模拟 localStorage 被禁（沙箱场景）：新上下文里先挂掉 localStorage ----
  const ctx2 = await browser.newContext();
  const page2 = await ctx2.newPage();
  await page2.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get(){ throw new Error('SecurityError: localStorage blocked'); }
    });
  });
  page2.on('pageerror', e => console.log('PAGE2_ERROR:', e.message));
  await page2.goto('http://127.0.0.1:18923/index.html');
  await page2.waitForTimeout(400);
  await page2.click('nav button[data-v=settings]');
  const warnVisible = await page2.evaluate(() => document.getElementById('storage-warn').style.display);
  console.log('NO_STORAGE_WARN:', warnVisible);
  await page2.fill('#set-baseurl', 'https://api.deepseek.com');
  await page2.fill('#set-apikey', 'sk-x');
  await page2.fill('#set-model', 'deepseek-chat');
  await page2.click('#btn-save-settings');
  await page2.waitForTimeout(300);
  console.log('NO_STORAGE_SAVE_MSG:', (await page2.textContent('#test-result')).trim());
  const memWorks = await page2.evaluate(() => {
    // 保存后状态栏应立即反映已启用（内存存储生效）
    return document.getElementById('llm-status').textContent.includes('已启用');
  });
  console.log('NO_STORAGE_STATUS_OK:', memWorks);

  await browser.close();
  console.log('=== 浏览器验证完成 ===');
})().catch(e => { console.log('FATAL:', e.message); process.exit(1); });
