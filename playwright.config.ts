import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: false,
    ...devices['Desktop Chrome'],
  },

  projects: [
    {
      name: 'chromium',
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});