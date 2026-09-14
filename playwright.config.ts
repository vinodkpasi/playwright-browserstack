import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.spec.ts',
  
  timeout: 90 * 1000,
  webServer: {
    command: "node ./dummy-website/server.js", 
    reuseExistingServer: true
  },

  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
  },

  reporter: [['html', { open: 'never' }]],

  retries:1
});