/* 直接测用户实际使用的预览面板 URL，确认 storage 可用性 */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGE_ERROR:', e.message));

  await page.goto('http://127.0.0.1:15832/static-html/b7aedf17711aed8d/index.html', { timeout: 8000 }).catch(e => console.log('GOTO_FAIL:', e.message.slice(0, 60)));
  await page.waitForTimeout(600);

  const storageTest = await page.evaluate(() => {
    try {
      localStorage.setItem('__t__', '1');
      localStorage.removeItem('__t__');
      return 'WORKS';
    } catch (e) {
      return 'BLOCKED: ' + e.name;
    }
  });
  console.log('PREVIEW_PANEL_STORAGE:', storageTest);
  console.log('IS_IFRAMED:', await page.evaluate(() => window.self !== window.top));
  console.log('LOCATION:', await page.evaluate(() => location.href));

  await browser.close();
})().catch(e => { console.log('FATAL:', e.message); process.exit(1); });
