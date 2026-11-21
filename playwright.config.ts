import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { baseURL: 'https://www.saucedemo.com', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://reqres.in' },
    },
  ],
});
