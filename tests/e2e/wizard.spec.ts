import { test, expect, next, seed, toStoryboard } from './fixtures'

test.describe('Video yaratish (wizard)', () => {
  test('qisqa g\'oya xato beradi, boyitish ishlaydi', async ({ page }) => {
    await page.goto('/create')
    await next(page)
    await expect(page.getByRole('alert')).toContainText("batafsilroq")
    await page.locator('#idea').fill('Ertak')
    await page.getByRole('button', { name: /G'oyani AI bilan boyitish/ }).click()
    await expect(page.locator('#idea')).toHaveValue(/sarguzasht/)
    await page.getByRole('button', { name: /G'oyani AI bilan boyitish/ }).click()
    await expect(page.getByText("G'oya allaqachon boyitilgan")).toBeVisible()
  })

  test('barcha sozlamalar tanlanadi, yopiq davomiylik modali ishlaydi', async ({ page }) => {
    await page.goto('/create')
    for (const t of ['Kino uslubi', "Ta'limiy", 'Reklama', 'Multfilm']) {
      const chip = page.getByRole('button', { name: t, exact: true })
      await chip.click()
      await expect(chip).toHaveAttribute('aria-pressed', 'true')
    }
    for (const s of ['2D rasm', 'Anime', 'Realistik', '3D multfilm']) {
      const r = page.getByRole('radio', { name: s })
      await r.click()
      await expect(r).toHaveAttribute('aria-checked', 'true')
    }
    for (const a of ['Kattalar', 'Bolalar', 'Rus', 'Ingliz', "O'zbek"]) {
      const chip = page.getByRole('button', { name: a, exact: true })
      await chip.click()
      await expect(chip).toHaveAttribute('aria-pressed', 'true')
    }
    // Bepul tarifda 3 daqiqa yopiq
    await page.getByRole('button', { name: /3 daq/ }).click()
    const dlg = page.getByRole('dialog')
    await expect(dlg).toContainText('Ijodkor')
    await dlg.getByRole('button', { name: /daqiqa qoldirish/ }).click()
    await expect(page.getByRole('button', { name: /1 daq/ })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: /10 daq/ }).click()
    await page.getByRole('dialog').getByRole('button', { name: "Tariflarni ko'rish" }).click()
    await expect(page).toHaveURL(/\/pricing$/)
  })

  test('to\'liq oqim: ssenariy → personaj → storyboard → tayyor video', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/create')
    await page.locator('#idea').fill("Ali ismli bola va mushukcha haqida halol mehnat haqida ertak")
    await next(page)

    // Ssenariy
    const scenes = page.getByTestId('scene-card')
    await expect(scenes).toHaveCount(4)
    await expect(page.locator('#title')).toHaveValue(/Ali/)
    await page.locator('#title').fill('Mening ertagim')
    await page.getByRole('button', { name: 'Sahna 1ni tahrirlash' }).click()
    await page.getByLabel('Sahna tavsifi').fill('')
    await page.getByRole('button', { name: 'Saqlash' }).click()
    await expect(page.getByRole('alert')).toContainText("bo'sh")
    await page.getByLabel('Sahna tavsifi').fill('Yangi tavsif: Ali tongda uyg\'onadi.')
    await page.getByRole('button', { name: 'Saqlash' }).click()
    await expect(scenes.first()).toContainText("Ali tongda uyg'onadi")
    await page.getByRole('button', { name: 'Sahna 2ni tahrirlash' }).click()
    await page.getByRole('button', { name: 'Bekor' }).click()
    await page.getByRole('button', { name: 'Qayta yozish' }).click()
    await expect(page.getByRole('button', { name: 'Qayta yozish' })).toBeEnabled()
    await expect(page.locator('#title')).toHaveValue('Mening ertagim')
    await next(page)

    // Personajlar
    const chars = page.getByTestId('character-card')
    await expect(chars).toHaveCount(3)
    await chars.first().getByLabel('Personaj ismi').fill('Sardor')
    await chars.first().locator('select').selectOption('Erkak ovozi')
    await expect(chars.first().locator('select')).toHaveValue('Erkak ovozi')
    await chars.first().getByRole('button', { name: /ovozini eshitish/ }).click()
    await chars.nth(1).getByRole('button', { name: "Ko'rinishini o'zgartirish" }).click()
    await page.getByRole('button', { name: 'Hammasini qayta yaratish' }).click()
    await expect(page.getByRole('button', { name: 'Hammasini qayta yaratish' })).toBeEnabled()
    await expect(chars.first().getByLabel('Personaj ismi')).toHaveValue('Sardor')
    await next(page)

    // Storyboard
    const cost = page.getByTestId('total-cost')
    await page.getByRole('button', { name: 'Hammasi video' }).click()
    const high = Number((await cost.textContent())!.match(/Jami: (\d+)/)![1])
    await page.getByRole('button', { name: 'Hammasi arzon' }).click()
    const low = Number((await cost.textContent())!.match(/Jami: (\d+)/)![1])
    expect(low).toBeLessThan(high)
    const firstText = await page.getByTestId('storyboard-card').first().locator('p').first().textContent()
    await page.getByRole('button', { name: 'Sahna 1ni pastga' }).click()
    await expect(page.getByTestId('storyboard-card').nth(1).locator('p').first()).toHaveText(firstText!)
    await page.getByRole('button', { name: 'Sahna 2ni yuqoriga' }).click()
    await expect(page.getByTestId('storyboard-card').first().locator('p').first()).toHaveText(firstText!)
    await page.getByRole('radiogroup', { name: 'Sahna 1 turi' }).getByRole('radio', { name: /Video/ }).click()

    // Orqaga va oldinga qadamlar
    await page.getByRole('button', { name: 'Orqaga' }).click()
    await expect(page.getByTestId('character-card').first()).toBeVisible()
    await next(page)

    const total = Number((await cost.textContent())!.match(/Jami: (\d+)/)![1])
    await next(page)
    await expect(page.getByTestId('render-progress')).toBeVisible()
    await expect(page.getByTestId('credit-badge')).toContainText(String(40 - total))
    await expect(page.getByTestId('render-done')).toBeVisible({ timeout: 20_000 })

    // Tayyor video amallari
    const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('render-done').getByRole('button', { name: 'Ssenariy' }).click()])
    expect(download.suggestedFilename()).toBe('Mening ertagim.txt')
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByTestId('render-done').getByRole('button', { name: 'Telegram' }).click()])
    expect(popup.url()).toContain('t.me/share/url')
    await popup.close()
    await page.getByTestId('render-done').getByRole('button', { name: 'Ulashish' }).click()
    await page.getByTestId('render-done').getByRole('button', { name: 'Ijro etish' }).first().click()

    await page.getByRole('button', { name: 'Mening videolarim' }).last().click()
    await expect(page).toHaveURL(/\/videos$/)
    await expect(page.getByTestId('project-card')).toHaveCount(1)
    await expect(page.getByTestId('project-card')).toContainText('Tayyor')
  })

  test('kredit yetmasa — ogohlantirish va arzon rejim', async ({ page }) => {
    await seed(page, { credits: 5 })
    await toStoryboard(page)
    await page.getByRole('button', { name: 'Hammasi video' }).click()
    await next(page)
    const dlg = page.getByRole('dialog', { name: 'Kredit yetarli emas' })
    await expect(dlg).toBeVisible()
    await dlg.getByRole('button', { name: 'Arzon rejim' }).click()
    await expect(page.getByRole('radio', { name: /Rasm\+harakat/ }).first()).toHaveAttribute('aria-checked', 'true')
    await next(page)
    await page.getByRole('dialog').getByRole('button', { name: 'Kredit olish' }).click()
    await expect(page).toHaveURL(/\/pricing$/)
    await page.goto('/videos')
    await expect(page.getByTestId('project-card')).toContainText('Qoralama')
  })

  test('qoralama saqlanadi va davom ettiriladi', async ({ page }) => {
    await page.goto('/create')
    await page.locator('#idea').fill('Zarina nomli qiz haqida ertak')
    await next(page)
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    await page.goto('/videos')
    const card = page.getByTestId('project-card')
    await expect(card).toContainText('Qoralama')
    await card.locator('button').first().click()
    await expect(page).toHaveURL(/\/create\?id=/)
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    // qadamlar paneli orqali qaytish
    await page.getByRole('button', { name: /G'oya/ }).click()
    await expect(page.locator('#idea')).toHaveValue('Zarina nomli qiz haqida ertak')
  })

  test('mavjud bo\'lmagan loyiha id — yangi loyiha ochiladi', async ({ page }) => {
    await page.goto('/create?id=yoq')
    await expect(page.getByText('Loyiha topilmadi')).toBeVisible()
    await expect(page.locator('#idea')).toHaveValue('')
  })
})
