import { createHmac, timingSafeEqual } from 'node:crypto'

export type TelegramUser = { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string }

export type VerifyResult = { ok: true; user: TelegramUser; authDate: number } | { ok: false; reason: string }

/**
 * Telegram Mini App initData imzosini tekshiradi.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyInitData(initData: string, botToken: string, opts: { maxAgeSec?: number; now?: number } = {}): VerifyResult {
  const maxAge = opts.maxAgeSec ?? 24 * 60 * 60
  const now = opts.now ?? Math.floor(Date.now() / 1000)
  if (typeof initData !== 'string' || !initData || initData.length > 4096) return { ok: false, reason: 'bad_input' }
  if (!botToken) return { ok: false, reason: 'not_configured' }

  let params: URLSearchParams
  try {
    params = new URLSearchParams(initData)
  } catch {
    return { ok: false, reason: 'bad_input' }
  }
  const hash = params.get('hash')
  if (!hash || !/^[a-f0-9]{64}$/.test(hash)) return { ok: false, reason: 'no_hash' }
  params.delete('hash')

  const keys = [...new Set([...params.keys()])]
  if (keys.length !== [...params.keys()].length) return { ok: false, reason: 'duplicate_keys' }
  const dataCheckString = keys
    .sort()
    .map((k) => `${k}=${params.get(k)}`)
    .join('\n')

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const expected = createHmac('sha256', secret).update(dataCheckString).digest()
  const given = Buffer.from(hash, 'hex')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return { ok: false, reason: 'bad_signature' }

  const authDate = Number(params.get('auth_date'))
  if (!Number.isFinite(authDate) || authDate <= 0) return { ok: false, reason: 'no_auth_date' }
  if (now - authDate > maxAge) return { ok: false, reason: 'expired' }
  if (authDate - now > 60) return { ok: false, reason: 'future_auth_date' }

  let user: TelegramUser
  try {
    const raw = JSON.parse(params.get('user') || 'null') as Partial<TelegramUser> | null
    if (!raw || typeof raw.id !== 'number') return { ok: false, reason: 'no_user' }
    user = {
      id: raw.id,
      first_name: typeof raw.first_name === 'string' ? raw.first_name.slice(0, 64) : undefined,
      last_name: typeof raw.last_name === 'string' ? raw.last_name.slice(0, 64) : undefined,
      username: typeof raw.username === 'string' ? raw.username.slice(0, 32) : undefined,
      language_code: typeof raw.language_code === 'string' ? raw.language_code.slice(0, 8) : undefined,
    }
  } catch {
    return { ok: false, reason: 'bad_user' }
  }
  return { ok: true, user, authDate }
}
