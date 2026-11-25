import { readFileSync } from 'node:fs'
import { test, expect } from './fixtures'

const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const globalHeaders = vercel.headers.find((h) => h.source === '/(.*)')!.headers
const csp = globalHeaders.find((h) => h.key === 'Content-Security-Policy')!.value

test.describe('Xavfsizlik', () => {
  test('ishlab chiqarish CSP siyosati ostida ilova buzilmaydi', async ({ page }) => {
    // Vercel qo'yadigan headerlarni lokal serverda taqlid qilamiz
    await page.route('http://localhost:4173/**', async (route) => {
      const res = await route.fetch()
      const headers = { ...res.headers() }
      for (const h of globalHeaders) headers[h.key.toLowerCase()] = h.value
      await route.fulfill({ response: res, headers })
    })
    const violations: string[] = []
    page.on('console', (m) => m.text().includes('Content Security Policy') && violations.push(m.text()))
    for (const r of ['/', '/create', '/videos', '/pricing', '/profile']) {
      await page.goto(r)
      await expect(page.locator('#root > *').first()).toBeVisible()
    }
    await page.goto('/create')
    await page.locator('#idea').fill('Ali ismli bola haqida ertak')
    await page.getByTestId('wizard-next').click()
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    expect(violations).toEqual([])
  })

  test("CSP faqat kerakli manbalarga ruxsat beradi", () => {
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'self' https://web.telegram.org")
    expect(csp).not.toContain("'unsafe-eval'")
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/)
    const keys = globalHeaders.map((h) => h.key)
    for (const k of ['Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) expect(keys).toContain(k)
  })

  test("URL orqali kelgan HTML/skript bajarilmaydi (XSS)", async ({ page }) => {
    let dialog = false
    page.on('dialog', async (d) => {
      dialog = true
      await d.dismiss()
    })
    const payload = '<img src=x onerror=alert(1)><script>alert(2)</script>'
    await page.goto(`/create?idea=${encodeURIComponent(payload)}`)
    await expect(page.locator('#idea')).toHaveValue(payload)
    await page.getByTestId('wizard-next').click()
    await expect(page.getByTestId('scene-card').first()).toBeVisible()
    await page.locator('#title').fill(payload)
    await page.goto('/videos')
    await expect(page.getByTestId('project-card')).toContainText('<img')
    expect(await page.locator('img').count()).toBe(0)
    expect(dialog).toBe(false)
  })
})
