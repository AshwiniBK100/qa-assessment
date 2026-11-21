import { Page, expect } from '@playwright/test';

export const PASSWORD = 'secret_sauce';

export async function login(page: Page, user = 'standard_user', password = PASSWORD) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(user);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

export async function loginOk(page: Page, user = 'standard_user') {
  await login(page, user);
  await expect(page).toHaveURL(/inventory\.html/);
}

export async function fillCheckout(page: Page, first: string, last: string, zip: string) {
  await page.locator('[data-test="firstName"]').fill(first);
  await page.locator('[data-test="lastName"]').fill(last);
  await page.locator('[data-test="postalCode"]').fill(zip);
}
