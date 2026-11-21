// Run: npm run screenshots  -> saves evidence images into bugs/screenshots/
const { chromium } = require('@playwright/test');
const out = 'bugs/screenshots';
const login = async (page, u) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test=username]', u);
  await page.fill('[data-test=password]', 'secret_sauce');
  await page.click('[data-test=login-button]');
};
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

  await login(page, 'problem_user');
  await page.waitForSelector('.inventory_list');
  await page.screenshot({ path: `${out}/bug1-same-images.png`, fullPage: true });

  await page.selectOption('[data-test=product-sort-container]', 'za');
  await page.screenshot({ path: `${out}/bug2-sort-broken.png`, fullPage: true });

  const btns = page.locator('button[data-test^="add-to-cart"]');
  const n = await btns.count();
  for (let i = 0; i < n; i++) await btns.first().click().catch(() => {});
  await page.screenshot({ path: `${out}/bug3-add-to-cart.png`, fullPage: true });

  await page.goto('https://www.saucedemo.com/checkout-step-one.html');
  await page.fill('[data-test=firstName]', 'Ashwini');
  await page.fill('[data-test=lastName]', 'Kurubagond');
  await page.fill('[data-test=postalCode]', '580001');
  await page.click('[data-test=continue]');
  await page.screenshot({ path: `${out}/bug4-lastname.png` });

  const p2 = await browser.newPage();
  const t = Date.now();
  await login(p2, 'performance_glitch_user');
  await p2.waitForURL(/inventory/, { timeout: 30000 });
  console.log('performance_glitch_user login ms:', Date.now() - t);
  await p2.screenshot({ path: `${out}/bug5-slow-login.png` });

  const p3 = await browser.newPage();
  await login(p3, 'standard_user');
  await p3.goto('https://www.saucedemo.com/cart.html');
  await p3.click('[data-test=checkout]');
  await p3.screenshot({ path: `${out}/bug6-empty-cart-checkout.png` });
  await browser.close();
})();
