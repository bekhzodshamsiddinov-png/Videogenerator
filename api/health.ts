/** GET /api/health — xizmat holati (maxfiy ma'lumotlarsiz) */
export function GET(): Response {
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'sahna-ai',
      telegramAuth: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      mode: 'demo',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } },
  )
}
