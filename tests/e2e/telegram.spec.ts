import { test, expect } from './fixtures'

/** Telegram WebApp SDK'ning soxta nusxasi — Mini App rejimini sinash uchun */
async function mockTelegram(page: import('@playwright/test').Page, colorScheme: 'light' | 'dark' = 'light') {
  await page.addInitScript((scheme) => {
    type Cb = () => void
    const log: string[] = []
    const mkButton = (name: string) => {
      const cbs = new Set<Cb>()
      const b = {
        text: '',
        isVisible: false,
        isActive: true,
        setText(t: string) { b.text = t; return b },
        onClick(cb: Cb) { cbs.add(cb); return b },
        offClick(cb: Cb) { cbs.delete(cb); return b },
        show() { b.isVisible = true; log.push(`${name}.show`); return b },
        hide() { b.isVisible = false; return b },
        enable() { b.isActive = true; return b },
        disable() { b.isActive = false; return b },
        click() { cbs.forEach((c) => c()) },
      }
      return b
    }
    const events: Record<string, Set<Cb>> = {}
    ;(window as unknown as { __tg: unknown }).__tg = { log }
    ;(window as unknown as { Telegram: unknown }).Telegram = {
      WebApp: {
        initData: 'query_id=TEST&user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Bekzod%22%7D&auth_date=1&hash=' + '0'.repeat(64),
        initDataUnsafe: { user: { id: 1, first_name: 'Bekzod', username: 'bekzod' } },
        version: '8.0',
        platform: 'ios',
        colorScheme: scheme,
        ready: () => log.push('ready'),
        expand: () => log.push('expand'),
        isVersionAtLeast: () => true,
        disableVerticalSwipes: () => log.push('disableVerticalSwipes'),
        setHeaderColor: (c: string) => log.push(`header:${c}`),
        setBackgroundColor: () => {},
        setBottomBarColor: () => {},
        onEvent: (e: string, cb: Cb) => (events[e] ??= new Set()).add(cb),
        offEvent: (e: string, cb: Cb) => events[e]?.delete(cb),
        openLink: (u: string) => log.push(`openLink:${u}`),
        openTelegramLink: (u: string) => log.push(`openTelegramLink:${u}`),
        addToHomeScreen: () => log.push('addToHomeScreen'),
        BackButton: mkButton('BackButton'),
        MainButton: mkButton('MainButton'),
        HapticFeedback: { impactOccurred: () => {}, notificationOccurred: () => {}, selectionChanged: () => {} },
      },
    }
  }, colorScheme)
}

const tg = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const w = window as unknown as { Telegram: { WebApp: { MainButton: { text: string; isVisible: boolean }; BackButton: { isVisible: boolean } } }; __tg: { log: string[] } }
    return { main: { text: w.Telegram.WebApp.MainButton.text, visible: w.Telegram.WebApp.MainButton.isVisible }, back: w.Telegram.WebApp.BackButton.isVisible, log: w.__tg.log }
  })
const clickMain = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { Telegram: { WebApp: { MainButton: { click(): void } } } }).Telegram.WebApp.MainButton.click())
const clickBack = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { Telegram: { WebApp: { BackButton: { click(): void } } } }).Telegram.WebApp.BackButton.click())

test.describe('Telegram Mini App', () => {
  test('ishga tushadi, foydalanuvchi ismi va BackButton', async ({ page }) => {
    await mockTelegram(page)
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/tg/)
    let s = await tg(page)
    expect(s.log).toEqual(expect.arrayContaining(['ready', 'expand', 'disableVerticalSwipes']))
    expect(s.back).toBe(false)
    await page.goto('/videos')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Bekzod')
    s = await tg(page)
    expect(s.back).toBe(true)
  })

  test('MainButton va BackButton wizardni boshqaradi', async ({ page }) => {
    await mockTelegram(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Bepul boshlash' }).first().click()
    await expect(page.getByTestId('wizard-next')).toHaveCount(0) // sahifadagi tugma o'rniga MainButton
    let s = await tg(page)
    expect(s.main).toEqual({ text: 'Davom etish', visible: true })

    await page.locator('#idea').fill('Ali ismli bola haqida ertak')
    await clickMain(page)
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    await clickMain(page)
    await expect(page.getByTestId('character-card').first()).toBeVisible()

    // BackButton avval qadamni orqaga qaytaradi
    await clickBack(page)
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    await clickMain(page)
    await clickMain(page)
    await expect(page.getByTestId('storyboard-card').first()).toBeVisible()
    s = await tg(page)
    expect(s.main.text).toMatch(/Videoni yaratish · \d+ kredit/)
    await clickMain(page)
    await expect(page.getByTestId('render-progress')).toBeVisible()
    s = await tg(page)
    expect(s.main.visible).toBe(false)

    // Telegram'ga ulashish SDK orqali
    await expect(page.getByTestId('render-done')).toBeVisible({ timeout: 20_000 })
    await page.getByTestId('render-done').getByRole('button', { name: 'Telegram' }).click()
    s = await tg(page)
    expect(s.log.some((l) => l.startsWith('openTelegramLink:https://t.me/share/url'))).toBe(true)
    // Ssenariy Telegram ichida nusxalanadi
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.getByTestId('render-done').getByRole('button', { name: 'Ssenariy' }).click()
    await expect(page.getByText('Ssenariy nusxalandi')).toBeVisible()
  })

  test('qorong\'i mavzu va bosh ekranga qo\'shish', async ({ page }) => {
    await mockTelegram(page, 'dark')
    await page.goto('/profile')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.getByRole('button', { name: /Telefonga o'rnatish/ }).click()
    const s = await tg(page)
    expect(s.log).toContain('addToHomeScreen')
    expect(s.log).toContain('header:#0C0A09')
    await page.getByRole('button', { name: /Telegram bot/ }).click()
    expect((await tg(page)).log.some((l) => l.startsWith('openTelegramLink:https://t.me/'))).toBe(true)
  })

  test('Telegram tashqarisida SDK yuklanmaydi', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(requests.some((u) => u.includes('telegram.org'))).toBe(false)
    expect(requests.every((u) => u.startsWith('http://localhost:4173'))).toBe(true)
  })
})
