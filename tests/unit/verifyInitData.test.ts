import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyInitData } from '../../api/_lib/verifyInitData'
import { POST, GET } from '../../api/telegram-auth'

const TOKEN = '123456:TEST-token'
const NOW = 1_800_000_000

function sign(fields: Record<string, string>, token = TOKEN) {
  const dcs = Object.keys(fields).sort().map((k) => `${k}=${fields[k]}`).join('\n')
  const secret = createHmac('sha256', 'WebAppData').update(token).digest()
  const hash = createHmac('sha256', secret).update(dcs).digest('hex')
  return new URLSearchParams({ ...fields, hash }).toString()
}
const user = JSON.stringify({ id: 42, first_name: 'Bekzod', username: 'bekzod' })

describe('verifyInitData', () => {
  it("to'g'ri imzoni qabul qiladi", () => {
    const r = verifyInitData(sign({ user, auth_date: String(NOW - 10), query_id: 'Q' }), TOKEN, { now: NOW })
    expect(r).toEqual({ ok: true, user: { id: 42, first_name: 'Bekzod', username: 'bekzod', last_name: undefined, language_code: undefined }, authDate: NOW - 10 })
  })
  it("o'zgartirilgan ma'lumotni rad etadi", () => {
    const good = sign({ user, auth_date: String(NOW) })
    const forged = good.replace('Bekzod', 'Hacker')
    expect(verifyInitData(forged, TOKEN, { now: NOW })).toMatchObject({ ok: false, reason: 'bad_signature' })
  })
  it('boshqa token bilan imzolanganni rad etadi', () => {
    expect(verifyInitData(sign({ user, auth_date: String(NOW) }, '999:other'), TOKEN, { now: NOW })).toMatchObject({ ok: false, reason: 'bad_signature' })
  })
  it("eskirgan va kelajakdagi auth_date'ni rad etadi", () => {
    expect(verifyInitData(sign({ user, auth_date: String(NOW - 90000) }), TOKEN, { now: NOW })).toMatchObject({ reason: 'expired' })
    expect(verifyInitData(sign({ user, auth_date: String(NOW + 3600) }), TOKEN, { now: NOW })).toMatchObject({ reason: 'future_auth_date' })
  })
  it("hash yo'q, noto'g'ri format, takroriy kalit, katta hajm", () => {
    expect(verifyInitData('user=1&auth_date=1', TOKEN)).toMatchObject({ reason: 'no_hash' })
    expect(verifyInitData('hash=zz', TOKEN)).toMatchObject({ reason: 'no_hash' })
    expect(verifyInitData('', TOKEN)).toMatchObject({ reason: 'bad_input' })
    expect(verifyInitData('a'.repeat(5000), TOKEN)).toMatchObject({ reason: 'bad_input' })
    const dup = sign({ user, auth_date: String(NOW) }) + '&auth_date=1'
    expect(verifyInitData(dup, TOKEN, { now: NOW })).toMatchObject({ ok: false })
  })
  it("token sozlanmagan bo'lsa", () => {
    expect(verifyInitData(sign({ user, auth_date: String(NOW) }), '')).toMatchObject({ reason: 'not_configured' })
  })
  it("user'siz imzoni rad etadi", () => {
    expect(verifyInitData(sign({ auth_date: String(NOW) }), TOKEN, { now: NOW })).toMatchObject({ reason: 'no_user' })
  })
})

describe('/api/telegram-auth', () => {
  const req = (body: string, headers: Record<string, string> = { 'content-type': 'application/json' }) =>
    new Request('https://app.example/api/telegram-auth', { method: 'POST', body, headers })

  it('token yo\'q — 503', async () => {
    delete process.env.TELEGRAM_BOT_TOKEN
    expect((await POST(req(JSON.stringify({ initData: 'x' })))).status).toBe(503)
  })
  it("noto'g'ri so'rovlar", async () => {
    process.env.TELEGRAM_BOT_TOKEN = TOKEN
    expect((await POST(req('x', { 'content-type': 'text/plain' }))).status).toBe(415)
    expect((await POST(req('{bad'))).status).toBe(400)
    expect((await POST(req(JSON.stringify({ initData: 5 })))).status).toBe(400)
    expect((await POST(req('x'.repeat(9000)))).status).toBe(413)
    expect((await POST(req(JSON.stringify({ initData: 'a=1' }), { 'content-type': 'application/json', origin: 'https://evil.example' }))).status).toBe(403)
    expect((await POST(req(JSON.stringify({ initData: 'a=1' })))).status).toBe(401)
    expect(GET().status).toBe(405)
  })
  it("to'g'ri initData — 200 va foydalanuvchi", async () => {
    process.env.TELEGRAM_BOT_TOKEN = TOKEN
    const initData = sign({ user, auth_date: String(Math.floor(Date.now() / 1000)) })
    const res = await POST(req(JSON.stringify({ initData }), { 'content-type': 'application/json', origin: 'https://app.example' }))
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(await res.json()).toEqual({ ok: true, user: { id: 42, first_name: 'Bekzod', username: 'bekzod' } })
  })
})
