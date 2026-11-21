import { test, expect } from '@playwright/test';
import { loginOk } from './helpers';

const names = (page) => page.locator('[data-test="inventory-item-name"]').allTextContents();
const prices = async (page) =>
  (await page.locator('[data-test="inventory-item-price"]').allTextContents()).map((p) => parseFloat(p.replace('$', '')));

test.describe('Product listing & sorting (TC-09..TC-13)', () => {
  test.beforeEach(async ({ page }) => loginOk(page));

  test('TC-09 default sort is A to Z', async ({ page }) => {
    const n = await names(page);
    expect(n).toEqual([...n].sort());
  });

  test('TC-10 sort Name Z to A', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const n = await names(page);
    expect(n).toEqual([...n].sort().reverse());
  });

  test('TC-11 sort Price low to high', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const p = await prices(page);
    expect(p).toEqual([...p].sort((a, b) => a - b));
  });

  test('TC-12 sort Price high to low', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    const p = await prices(page);
    expect(p).toEqual([...p].sort((a, b) => b - a));
  });

  test('TC-13 product detail page shows matching name and price', async ({ page }) => {
    await page.locator('[data-test="inventory-item-name"]').first().click();
    await expect(page).toHaveURL(/inventory-item\.html\?id=/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  });
});
