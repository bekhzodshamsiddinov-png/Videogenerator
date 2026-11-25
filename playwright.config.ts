import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:4173', trace: 'off' },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 60_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 860 } } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    {
      name: 'iphone',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
    },
  ],
})
