import { test, expect } from '@playwright/test';
import { loginOk, fillCheckout } from './helpers';

// These assert CORRECT behaviour for problem_user. test.fail() = bug is known/present.
// If a test starts "unexpectedly passing", the bug was fixed.
test.describe('problem_user known defects (BUG-1..BUG-4)', () => {
  test.beforeEach(async ({ page }) => loginOk(page, 'problem_user'));

  test('BUG-1 each product shows its own image', async ({ page }) => {
    test.fail();
    const srcs = await page.locator('img.inventory_item_img').evaluateAll((els) => els.map((e) => (e as HTMLImageElement).src));
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  test('BUG-2 sorting Z to A reorders products', async ({ page }) => {
    test.fail();
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const n = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    expect(n).toEqual([...n].sort().reverse());
  });

  test('BUG-3 every product can be added to the cart', async ({ page }) => {
    test.fail();
    const buttons = page.locator('button[data-test^="add-to-cart"]');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) await buttons.first().click().catch(() => {});
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(count));
  });

  test('BUG-4 last name field accepts last name on checkout', async ({ page }) => {
    test.fail();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckout(page, 'Ashwini', 'Kurubagond', '580001');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Kurubagond');
  });
});
