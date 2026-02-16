import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('screenuser', 'visual_audit');
fs.mkdirSync(outDir, { recursive: true });

const pagesToCapture = [
  { name: 'home', url: 'https://pizzatiq.fr/' },
  { name: 'menu', url: 'https://pizzatiq.fr/menu' },
  { name: 'contact', url: 'https://pizzatiq.fr/contact' },
  { name: 'mentions', url: 'https://pizzatiq.fr/mentions-legales' },
];

async function captureDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  for (const target of pagesToCapture) {
    await page.goto(target.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `desktop_${target.name}.png`), fullPage: true });
  }

  await page.goto('https://pizzatiq.fr/menu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const tabs = page.locator('nav[aria-label="Categories du menu"] button');
  const tabCount = await tabs.count();
  if (tabCount > 1) {
    await tabs.nth(1).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, 'desktop_menu_tab_2.png'), fullPage: true });
  }
  if (tabCount > 2) {
    await tabs.nth(2).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, 'desktop_menu_tab_3.png'), fullPage: true });
  }

  await context.close();
}

async function captureMobile(browser) {
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();

  for (const target of pagesToCapture) {
    await page.goto(target.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `mobile_${target.name}.png`), fullPage: true });
  }

  await page.goto('https://pizzatiq.fr/menu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const tabs = page.locator('nav[aria-label="Categories du menu"] button');
  const tabCount = await tabs.count();
  if (tabCount > 1) {
    await tabs.nth(1).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outDir, 'mobile_menu_tab_2.png'), fullPage: true });
  }

  await context.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await captureDesktop(browser);
  await captureMobile(browser);
} finally {
  await browser.close();
}

console.log(`Screenshots saved in: ${outDir}`);
