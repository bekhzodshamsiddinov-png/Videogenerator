/**
 * Telegram foydalanuvchisini serverda tekshirish.
 * initData imzosi faqat serverda (bot token bilan) tekshiriladi — brauzerdagi
 * initDataUnsafe ma'lumotlariga ishonib bo'lmaydi.
 */
export type VerifiedUser = { id: number; first_name?: string; username?: string }

let verified: VerifiedUser | null = null
export const getVerifiedUser = () => verified

export async function verifyTelegramSession(initData: string): Promise<VerifiedUser | null> {
  if (!initData || initData.length > 4096) return null
  try {
    const res = await fetch('/api/telegram-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
      credentials: 'same-origin',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { ok?: boolean; user?: VerifiedUser }
    verified = data.ok && data.user ? data.user : null
    return verified
  } catch {
    return null
  }
}
