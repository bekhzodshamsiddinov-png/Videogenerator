import { test, expect, seed } from './fixtures'

const project = (id: string, title: string, status: 'ready' | 'draft' | 'processing', extra: Record<string, unknown> = {}) => ({
  id,
  title,
  idea: 'Test g\'oya haqida ertak',
  type: 'Multfilm',
  style: '3D multfilm',
  duration: 1,
  audience: 'Bolalar',
  language: "O'zbek",
  scenes: [
    { id: `${id}s1`, place: 'Bog\'', action: 'Birinchi sahna', line: 'Ali: Salom!' },
    { id: `${id}s2`, place: 'Uy', action: 'Ikkinchi sahna', line: 'Buvijon: Barakalla!' },
  ],
  characters: [{ id: `${id}c1`, name: 'Ali', desc: 'Bola', voice: 'Bola ovozi', look: 0 }],
  anim: [true, false],
  step: status === 'draft' ? 1 : 4,
  status,
  cost: 10,
  createdAt: Date.now() - 1000,
  startedAt: status === 'draft' ? undefined : Date.now() - 100_000,
  renderMs: 12000,
  ...extra,
})

test.describe('Mening videolarim', () => {
  test('bo\'sh holat va yangi video tugmasi', async ({ page }) => {
    await page.goto('/videos')
    await expect(page.getByText("Hali videolar yo'q")).toBeVisible()
    await page.getByRole('button', { name: 'Birinchi videoni yaratish' }).click()
    await expect(page).toHaveURL(/\/create\?new=/)
  })

  test('filtrlar, qidiruv, ko\'rish, nom, nusxa, o\'chirish', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await seed(page, { projects: [project('a1', 'Momiq sarguzashti', 'ready'), project('b2', 'Kasrlar darsi', 'draft')] })
    await page.goto('/videos')
    const cards = page.getByTestId('project-card')
    await expect(cards).toHaveCount(2)

    await page.getByRole('tab', { name: 'Tayyor' }).click()
    await expect(cards).toHaveCount(1)
    await page.getByRole('tab', { name: 'Qoralama' }).click()
    await expect(cards).toHaveCount(1)
    await page.getByRole('tab', { name: 'Jarayonda' }).click()
    await expect(cards).toHaveCount(0)
    await expect(page.getByText('Hech narsa topilmadi.')).toBeVisible()
    await page.getByRole('tab', { name: 'Hammasi' }).click()
    await page.getByLabel('Loyihalarni qidirish').fill('kasr')
    await expect(cards).toHaveCount(1)
    await page.getByLabel('Loyihalarni qidirish').fill('')

    // Ko'rish modali
    await cards.filter({ hasText: 'Momiq' }).locator('button').first().click()
    const dlg = page.getByRole('dialog', { name: 'Momiq sarguzashti' })
    await expect(dlg.getByTestId('video-preview')).toBeVisible()
    const [download] = await Promise.all([page.waitForEvent('download'), dlg.getByRole('button', { name: 'Ssenariy' }).click()])
    expect(download.suggestedFilename()).toContain('Momiq')
    const [popup] = await Promise.all([page.waitForEvent('popup'), dlg.getByRole('button', { name: 'Telegram' }).click()])
    expect(popup.url()).toContain('t.me/share')
    await popup.close()
    await page.keyboard.press('Escape')
    await expect(dlg).toBeHidden()

    // Nomini o'zgartirish
    await page.getByRole('button', { name: 'Momiq sarguzashti — amallar' }).click()
    await page.getByRole('menuitem', { name: "Nomini o'zgartirish" }).click()
    await page.getByLabel('Yangi nom').fill('Yangi nom')
    await page.getByRole('dialog').getByRole('button', { name: 'Saqlash' }).click()
    await expect(cards.filter({ hasText: 'Yangi nom' })).toHaveCount(1)

    // Nusxa
    await page.getByRole('button', { name: 'Yangi nom — amallar' }).click()
    await page.getByRole('menuitem', { name: 'Nusxa olish' }).click()
    await expect(cards).toHaveCount(3)
    await expect(cards.filter({ hasText: 'Yangi nom (nusxa)' })).toContainText('Qoralama')

    // Menyu tashqariga bosilganda yopiladi
    await page.getByRole('button', { name: 'Kasrlar darsi — amallar' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
    await page.getByRole('heading', { level: 1 }).click()
    await expect(page.getByRole('menu')).toBeHidden()

    // O'chirish (bekor qilish, keyin tasdiqlash)
    await page.getByRole('button', { name: 'Kasrlar darsi — amallar' }).click()
    await page.getByRole('menuitem', { name: "O'chirish" }).click()
    await page.getByRole('button', { name: 'Bekor qilish' }).click()
    await expect(cards).toHaveCount(3)
    await page.getByRole('button', { name: 'Kasrlar darsi — amallar' }).click()
    await page.getByRole('menuitem', { name: "O'chirish" }).click()
    await page.getByRole('dialog').getByRole('button', { name: "O'chirish" }).click()
    await expect(cards).toHaveCount(2)

    // Qayta yuklanganda saqlanib qoladi
    await page.reload()
    await expect(cards).toHaveCount(2)

    // Kredit kartasi
    await page.getByRole('button', { name: /Kredit.*Sotib olish/ }).click()
    await expect(page).toHaveURL(/\/pricing$/)
  })

  test('jarayondagi loyiha progressni ko\'rsatadi', async ({ page }) => {
    await seed(page, { projects: [project('p1', 'Render', 'processing', { startedAt: Date.now(), renderMs: 600000 })] })
    await page.goto('/videos')
    await expect(page.getByTestId('project-card')).toContainText('% tayyor')
    await page.getByTestId('project-card').locator('button').first().click()
    await expect(page.getByTestId('render-progress')).toBeVisible()
  })
})

test.describe('Narxlar va to\'lov', () => {
  test('kredit paketi sotib olish', async ({ page }) => {
    await page.goto('/pricing')
    const packs = page.getByTestId('credit-pack')
    await expect(packs).toHaveCount(3)
    await packs.first().getByRole('button', { name: 'Sotib olish' }).click()
    const dlg = page.getByRole('dialog', { name: "To'lov" })
    await dlg.getByRole('radio', { name: 'Payme' }).click()
    await expect(dlg.getByRole('radio', { name: 'Payme' })).toHaveAttribute('aria-checked', 'true')
    await dlg.getByRole('button', { name: "Payme orqali to'lash" }).click()
    await expect(page.getByRole('dialog', { name: 'Tayyor!' })).toBeVisible()
    await page.getByRole('button', { name: 'Davom etish' }).click()
    await expect(page.getByTestId('credit-badge')).toContainText('90')
  })

  test('yillik/oylik va tarif tanlash davomiylikni ochadi', async ({ page }) => {
    await page.goto('/pricing')
    await page.getByRole('radio', { name: /Yillik/ }).click()
    await expect(page.getByTestId('plan-creator')).toContainText('79 000')
    await page.getByRole('radio', { name: 'Oylik' }).click()
    await expect(page.getByTestId('plan-creator')).toContainText('99 000')
    await page.getByTestId('plan-creator').getByRole('button', { name: 'Tanlash' }).click()
    await page.getByRole('dialog').getByRole('button', { name: /orqali to'lash/ }).click()
    await page.getByRole('button', { name: 'Davom etish' }).click()
    await expect(page.getByTestId('plan-creator')).toContainText('Joriy tarif')
    await expect(page.getByTestId('plan-creator').getByRole('button', { name: 'Faol' })).toBeDisabled()
    await expect(page.getByTestId('credit-badge')).toContainText('640')

    await page.goto('/create')
    await page.getByRole('button', { name: /10 daq/ }).click()
    await expect(page.getByRole('button', { name: /10 daq/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('dialog')).toBeHidden()

    await page.goto('/pricing')
    await page.getByTestId('plan-free').getByRole('button').click()
    await expect(page).toHaveURL(/\/create/)
  })

  test('to\'lovni yopish', async ({ page }) => {
    await page.goto('/pricing')
    await page.getByTestId('plan-studio').getByRole('button', { name: 'Tanlash' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Yopish' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.getByTestId('credit-badge')).toContainText('40')
  })
})

test.describe('Profil', () => {
  test('ism, mavzu, o\'rnatish, bot, tozalash', async ({ page }) => {
    await page.goto('/profile')
    await page.locator('#name').fill('Bekzod')
    await page.getByRole('button', { name: 'Saqlash' }).click()
    await expect(page.getByText('Ism saqlandi')).toBeVisible()
    await page.goto('/videos')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Bekzod')
    await page.goto('/profile')

    await page.getByRole('radio', { name: "Qorong'i" }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.getByRole('radio', { name: "Yorug'" }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await page.getByRole('radio', { name: 'Avto' }).click()

    await page.getByRole('button', { name: /Telefonga o'rnatish/ }).click()
    const help = page.getByRole('dialog', { name: "Bosh ekranga qo'shish" })
    await expect(help).toBeVisible()
    await help.getByRole('button', { name: 'Tushunarli' }).click()

    const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: /Telegram bot/ }).click()])
    expect(popup.url()).toMatch(/^https:\/\/t\.me\//)
    await popup.close()

    await page.getByRole('button', { name: /Tarif:/ }).click()
    await expect(page).toHaveURL(/\/pricing$/)
    await page.goto('/profile')

    await page.getByRole('button', { name: /Barcha ma'lumotlarni tozalash/ }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Tozalash' }).click()
    await expect(page.locator('#name')).toHaveValue('')
  })

  test('buzilgan localStorage ilovani buzmaydi', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('sahna-ai:v1', '{buzilgan json'))
    await page.goto('/videos')
    await expect(page.getByTestId('dash-credits')).toHaveText('40')
    await page.addInitScript(() =>
      localStorage.setItem('sahna-ai:v1', JSON.stringify({ credits: 'ko\'p', plan: 'hacker', projects: [{ id: 1 }, null, { id: 'x', title: '<img src=x onerror=alert(1)>', status: 'ready', scenes: 'yo\'q' }] })),
    )
    await page.reload()
    await expect(page.getByTestId('dash-credits')).toHaveText('40')
    await expect(page.getByTestId('project-card')).toHaveCount(1)
    await expect(page.getByTestId('project-card')).toContainText('<img src=x onerror=alert(1)>')
    expect(await page.locator('img').count()).toBe(0)
  })
})
