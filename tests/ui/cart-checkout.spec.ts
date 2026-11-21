import { test, expect } from '@playwright/test';
import { loginOk, fillCheckout } from './helpers';

test.describe('Cart & checkout (TC-14..TC-22)', () => {
  test.beforeEach(async ({ page }) => loginOk(page));

  test('TC-14 add item updates badge and cart contents', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-15 remove item from cart clears badge', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });

  test('TC-16 cart persists after page reload', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.reload();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('TC-17 checkout happy path completes order', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckout(page, 'Ashwini', 'Kurubagond', '580001');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('[data-test="total-label"]')).toContainText('$32.39');
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  for (const [field, first, last, zip, msg] of [
    ['first name', '', 'K', '1', 'First Name is required'],
    ['last name', 'A', '', '1', 'Last Name is required'],
    ['postal code', 'A', 'K', '', 'Postal Code is required'],
  ]) {
    test(`TC-18 checkout validation: missing ${field}`, async ({ page }) => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="shopping-cart-link"]').click();
      await page.locator('[data-test="checkout"]').click();
      await fillCheckout(page, first, last, zip);
      await page.locator('[data-test="continue"]').click();
      await expect(page.locator('[data-test="error"]')).toContainText(msg);
    });
  }

  test('TC-19 special characters / script tags in form are handled safely', async ({ page }) => {
    let dialogSeen = false;
    page.on('dialog', async (d) => { dialogSeen = true; await d.dismiss(); });
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckout(page, '<script>alert(1)</script>', "O'Brien-Ünï", '!@#$%');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two/);
    expect(dialogSeen).toBe(false);
  });

  // Known defect: app lets you check out with an empty cart. Desired behaviour asserted;
  // test.fail() marks it as an expected failure so the suite stays green and flags a fix.
  test('TC-20 empty cart should not allow checkout (KNOWN BUG-6)', async ({ page }) => {
    test.fail();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).not.toHaveURL(/checkout-step-one/);
  });

  test('TC-21 cancel on checkout step one returns to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
