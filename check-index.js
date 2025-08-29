const puppeteer = require('puppeteer');
(async () => {
  const url = 'http://localhost:8089/index.html';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', (msg) => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  } catch (e) {
    logs.push({ type: 'navigation', text: String(e) });
  }
  await browser.close();
  console.log(JSON.stringify(logs, null, 2));
})();
