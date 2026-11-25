import { verifyInitData } from './_lib/verifyInitData.js'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS })

/** POST /api/telegram-auth  { initData } → { ok, user } */
export async function POST(request: Request): Promise<Response> {
  const ct = request.headers.get('content-type') || ''
  if (!ct.includes('application/json')) return json(415, { ok: false, error: 'unsupported_media_type' })

  // Faqat o'z domenimizdan (yoki Telegram ichidan, u ham bizning domen) kelgan so'rovlar
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) return json(403, { ok: false, error: 'forbidden_origin' })
    } catch {
      return json(403, { ok: false, error: 'forbidden_origin' })
    }
  }

  const raw = await request.text()
  if (raw.length > 8192) return json(413, { ok: false, error: 'payload_too_large' })
  let initData: unknown
  try {
    initData = (JSON.parse(raw) as { initData?: unknown })?.initData
  } catch {
    return json(400, { ok: false, error: 'bad_json' })
  }
  if (typeof initData !== 'string') return json(400, { ok: false, error: 'bad_input' })

  const token = process.env.TELEGRAM_BOT_TOKEN || ''
  if (!token) return json(503, { ok: false, error: 'not_configured' })

  const result = verifyInitData(initData, token)
  if (!result.ok) return json(401, { ok: false, error: result.reason })
  return json(200, { ok: true, user: { id: result.user.id, first_name: result.user.first_name, username: result.user.username } })
}

export function GET(): Response {
  return json(405, { ok: false, error: 'method_not_allowed' })
}
