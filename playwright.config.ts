import { defineConfig, devices } from '@playwright/test';

// Check if we need to run the mock server based on environment variable or test patterns
const shouldRunMockServer =
  process.env.PLAYWRIGHT_WITH_MOCK === 'true' ||
  process.argv.some((arg) => arg.includes('mock-api.spec.ts'));

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // Conditionally start mock server based on test needs
  webServer: shouldRunMockServer
    ? [
        {
          command: 'node mock-server/server.js',
          url: 'http://localhost:2020/health',
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000,
        },
        {
          command: process.env.CI ? 'npm run preview' : 'npm run start',
          url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 120 * 1000,
        },
      ]
    : {
        command: process.env.CI ? 'npm run preview' : 'npm run start',
        url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
