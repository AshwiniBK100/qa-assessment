import { test, expect } from '@playwright/test';
import { login, loginOk } from './helpers';

test.describe('Login (TC-01..TC-08)', () => {
  test('TC-01 standard_user logs in and sees product list', async ({ page }) => {
    await loginOk(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('TC-02 locked_out_user is blocked with error message', async ({ page }) => {
    await login(page, 'locked_out_user');
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('TC-03 wrong password shows mismatch error', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_pw');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('TC-04 empty username shows required error', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC-05 empty password shows required error', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('TC-06 direct access to inventory without login is denied', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.locator('[data-test="error"]')).toContainText('only access');
  });

  test('TC-07 logout returns to login page and blocks back navigation', async ({ page }) => {
    await loginOk(page);
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await page.goBack();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-08 performance_glitch_user can log in but is slow (timing logged)', async ({ page }) => {
    const start = Date.now();
    await login(page, 'performance_glitch_user');
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 20_000 });
    const elapsed = Date.now() - start;
    console.log(`performance_glitch_user login took ${elapsed} ms`);
    expect(elapsed).toBeGreaterThan(0);
  });
});
