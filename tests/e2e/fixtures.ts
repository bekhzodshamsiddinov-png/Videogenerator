import { test as base, expect, type Page } from '@playwright/test'

/** Har bir testda konsol xatolari va JS istisnolari bo'lmasligini tekshiradi */
export const test = base.extend<{ errors: string[] }>({
  errors: [async ({ page }, use) => {
    const errors: string[] = []
    // Tashqi Telegram havolalari sinov muhitida tarmoqqa chiqmaydi — soxta sahifa qaytaramiz
    await page.context().route('https://t.me/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>t.me</p>' }))
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => {
      // /api/telegram-auth demo serverda 404/401 qaytaradi — bu kutilgan holat (API unit testlarda tekshiriladi)
      if (m.type() === 'error' && !(m.text().includes('Failed to load resource') && m.location().url.includes('/api/')))
        errors.push(`console: ${m.text()}`)
    })
    await use(errors)
    expect(errors, 'konsolda xato bo\'lmasligi kerak').toEqual([])
  }, { auto: true }],
})

export { expect }

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1280) < 768

export async function seed(page: Page, state: Record<string, unknown>) {
  await page.addInitScript((s) => {
    if (!sessionStorage.getItem('__seeded')) {
      localStorage.setItem('sahna-ai:v1', JSON.stringify({ version: 1, name: '', credits: 40, plan: 'free', theme: 'system', projects: [], ...s }))
      sessionStorage.setItem('__seeded', '1')
    }
  }, state)
}

export async function next(page: Page) {
  await page.getByTestId('wizard-next').click()
}

/** G'oyadan boshlab storyboard qadamigacha o'tadi */
export async function toStoryboard(page: Page, idea = "Ali ismli bola haqida halol mehnat haqida ertak") {
  await page.goto('/create')
  await page.locator('#idea').fill(idea)
  await next(page)
  await expect(page.getByTestId('scene-card').first()).toBeVisible()
  await next(page)
  await expect(page.getByTestId('character-card').first()).toBeVisible()
  await next(page)
  await expect(page.getByTestId('storyboard-card').first()).toBeVisible()
}
