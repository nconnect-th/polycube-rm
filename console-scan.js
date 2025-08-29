const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const base = process.cwd();
  const baseUrl = 'http://localhost:8089/';

  // Collect up to 200 HTML files (top-level and nested index.html)
  const walk = (dir, acc = []) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, acc);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) acc.push(full);
    }
    return acc;
  };
  let files = walk(base);
  files = Array.from(new Set(files.map(f => path.relative(base, f))));
  // Prefer index.html and top-level .html first
  files.sort((a, b) => a.length - b.length);
  files = files.slice(0, 200);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const report = [];
  for (const rel of files) {
    const url = baseUrl + rel.replace(/\\\\/g, '/');
    const errors = [];
    const warnings = [];
    const handler = (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') errors.push({ type, text });
      if (type === 'warning' || type === 'warn') warnings.push({ type, text });
    };
    page.on('console', handler);
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    } catch (e) {
      errors.push({ type: 'navigation', text: String(e) });
    }
    page.off('console', handler);
    report.push({ page: rel, errors, warnings });
  }

  await browser.close();

  fs.writeFileSync(path.join(base, 'console-report.json'), JSON.stringify(report, null, 2));
  console.log('WROTE_REPORT', path.join(base, 'console-report.json'));
})();
