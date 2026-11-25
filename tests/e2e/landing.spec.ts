import { test, expect, isMobile } from './fixtures'

test.describe('Bosh sahifa', () => {
  test('hero formasi g\'oya bilan yaratish sahifasini ochadi', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('multfilmga')
    await page.locator('#hero-idea').fill('Mushukcha haqida ertak')
    await page.getByRole('button', { name: 'Bepul boshlash' }).first().click()
    await expect(page).toHaveURL(/\/create\?idea=/)
    await expect(page.locator('#idea')).toHaveValue('Mushukcha haqida ertak')
  })

  test('bo\'sh hero formasi ham ishlaydi', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Bepul boshlash' }).first().click()
    await expect(page).toHaveURL(/\/create$/)
  })

  test('namuna videoni ko\'rish va shunga o\'xshashini yaratish', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: "Namuna videoni ko'rish" }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByTestId('video-preview')).toBeVisible()
    await dialog.getByRole('button', { name: 'Pauza' }).click()
    await dialog.getByRole('button', { name: 'Keyingi sahna' }).click()
    await expect(dialog).toContainText('Sahna 2/')
    await dialog.getByRole('button', { name: 'Oldingi sahna' }).click()
    await expect(dialog).toContainText('Sahna 1/')
    await dialog.getByRole('button', { name: 'Yopish' }).first().click()
    await expect(dialog).toBeHidden()

    const cards = page.getByTestId('example-card')
    await expect(cards).toHaveCount(6)
    for (let i = 0; i < 6; i++) {
      await cards.nth(i).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).toBeHidden()
    }
    await cards.nth(1).click()
    await page.getByRole('button', { name: "Shunga o'xshash yaratish" }).click()
    await expect(page).toHaveURL(/\/create\?idea=/)
    await expect(page.locator('#idea')).toHaveValue(/quyosh tizimi/)
  })

  test('"Kimlar uchun" kartalari g\'oyani to\'ldiradi', async ({ page }) => {
    for (const name of ["O'qituvchilar", 'Ota-onalar', 'Biznes', 'Blogerlar']) {
      await page.goto('/')
      await page.getByRole('button', { name: new RegExp(name) }).click()
      await expect(page).toHaveURL(/\/create\?idea=/)
      await expect(page.locator('#idea')).not.toHaveValue('')
    }
  })

  test('FAQ, maxfiylik, aloqa va CTA tugmalari', async ({ page }) => {
    await page.goto('/')
    const q = page.getByRole('button', { name: "O'zbek tilida ovoz bormi?" })
    await expect(q).toHaveAttribute('aria-expanded', 'false')
    await q.click()
    await expect(q).toHaveAttribute('aria-expanded', 'true')
    await q.click()
    await expect(q).toHaveAttribute('aria-expanded', 'false')

    await page.getByRole('button', { name: 'Maxfiylik' }).click()
    await expect(page.getByRole('dialog', { name: 'Maxfiylik siyosati' })).toBeVisible()
    await page.getByRole('button', { name: 'Yopish' }).click()
    await page.getByRole('button', { name: 'Aloqa' }).click()
    const contact = page.getByRole('dialog', { name: 'Aloqa' })
    const [popup] = await Promise.all([page.waitForEvent('popup'), contact.getByRole('button', { name: /Telegram'da yozish/ }).click()])
    expect(popup.url()).toMatch(/^https:\/\/t\.me\//)
    await popup.close()
    await page.getByRole('button', { name: 'Yopish' }).click()

    await page.getByRole('button', { name: 'Boshlash', exact: true }).click()
    await expect(page).toHaveURL(/\/create/)
  })

  test('kredit belgisi narxlar sahifasini ochadi', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('credit-badge').click()
    await expect(page).toHaveURL(/\/pricing$/)
  })

  test('menyu orqali barcha sahifalarga o\'tish va orqaga qaytish', async ({ page }) => {
    await page.goto('/')
    const nav = isMobile(page) ? page.getByRole('navigation', { name: 'Pastki menyu' }) : page.getByRole('navigation', { name: 'Asosiy menyu' })
    await expect(nav).toBeVisible()
    const items = isMobile(page)
      ? [['Videolar', '/videos'], ['Yaratish', '/create'], ['Narxlar', '/pricing'], ['Profil', '/profile'], ['Bosh', '/']]
      : [['Mening videolarim', '/videos'], ['Yangi loyiha', '/create'], ['Narxlar', '/pricing'], ['Bosh sahifa', '/']]
    for (const [label, path] of items) {
      await nav.getByRole('button', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/$' : path}`))
    }
    if (!isMobile(page)) {
      await page.getByRole('button', { name: 'Profil' }).click()
      await expect(page).toHaveURL(/\/profile$/)
      await page.getByRole('button', { name: 'Video yaratish' }).click()
      await expect(page).toHaveURL(/\/create$/)
    }
    await page.goBack()
    await expect(page).not.toHaveURL(/\/create$/)
    await page.getByRole('button', { name: 'Bosh sahifa' }).first().click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('noma\'lum sahifa bosh sahifani ko\'rsatadi', async ({ page }) => {
    await page.goto('/mavjud-emas')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('multfilmga')
  })

  test('gorizontal skroll yo\'q', async ({ page }) => {
    for (const r of ['/', '/create', '/videos', '/pricing', '/profile']) {
      await page.goto(r)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, r).toBeLessThanOrEqual(1)
    }
  })
})
