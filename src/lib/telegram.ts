/** Telegram Mini App integratsiyasi (faqat kerakli qismi uchun tiplar) */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'

export type TgButton = {
  setText(text: string): TgButton
  onClick(cb: () => void): TgButton
  offClick(cb: () => void): TgButton
  show(): TgButton
  hide(): TgButton
  enable(): TgButton
  disable(): TgButton
  isVisible?: boolean
}

export type TgWebApp = {
  initData: string
  initDataUnsafe?: { user?: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string } }
  version?: string
  platform?: string
  colorScheme?: 'light' | 'dark'
  themeParams?: Record<string, string | undefined>
  ready(): void
  expand(): void
  close?(): void
  isVersionAtLeast?(v: string): boolean
  setHeaderColor?(c: string): void
  setBackgroundColor?(c: string): void
  setBottomBarColor?(c: string): void
  disableVerticalSwipes?(): void
  onEvent?(event: string, cb: () => void): void
  offEvent?(event: string, cb: () => void): void
  openLink?(url: string, opts?: { try_instant_view?: boolean }): void
  openTelegramLink?(url: string): void
  addToHomeScreen?(): void
  BackButton?: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void }
  MainButton?: TgButton
  HapticFeedback?: {
    impactOccurred(s: HapticStyle): void
    notificationOccurred(t: 'error' | 'success' | 'warning'): void
    selectionChanged(): void
  }
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
  }
}

const SDK_URL = 'https://telegram.org/js/telegram-web-app.js?59'

let tg: TgWebApp | null = null

/** Ilova Telegram ichida ochilganmi? (initData bo'lsa — ha) */
export function getTg(): TgWebApp | null {
  return tg
}

export const isTelegram = () => !!tg && !!tg.initData

function launchedFromTelegram() {
  if (typeof window === 'undefined') return false
  const h = window.location.hash + window.location.search
  if (/tgWebApp(Data|Version|Platform)=/.test(h)) return true
  try {
    return !!sessionStorage.getItem('__telegram__initParams')
  } catch {
    return false
  }
}

function loadSdk(): Promise<void> {
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = SDK_URL
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => resolve()
    document.head.appendChild(s)
    setTimeout(resolve, 4000)
  })
}

/**
 * SDK faqat Telegram ichida ochilganda yuklanadi — oddiy brauzer foydalanuvchilariga
 * uchinchi tomon skripti yuklanmaydi.
 */
export async function initTelegram(): Promise<TgWebApp | null> {
  if (typeof window === 'undefined') return null
  if (!window.Telegram?.WebApp && launchedFromTelegram()) await loadSdk()
  const app = window.Telegram?.WebApp
  if (!app || !app.initData) return null
  tg = app
  try {
    app.ready()
    app.expand()
    if (app.isVersionAtLeast?.('7.7')) app.disableVerticalSwipes?.()
  } catch {
    /* eski versiyalar */
  }
  document.documentElement.classList.add('tg')
  return app
}

export function haptic(kind: 'tap' | 'select' | 'success' | 'error' | 'warning' = 'tap') {
  const h = tg?.HapticFeedback
  if (!h) return
  try {
    if (kind === 'tap') h.impactOccurred('light')
    else if (kind === 'select') h.selectionChanged()
    else h.notificationOccurred(kind)
  } catch {
    /* ignore */
  }
}

export function applyTgColors(dark: boolean) {
  if (!tg) return
  const bg = dark ? '#0C0A09' : '#FAFAF9'
  try {
    tg.setHeaderColor?.(bg)
    tg.setBackgroundColor?.(bg)
    if (tg.isVersionAtLeast?.('7.10')) tg.setBottomBarColor?.(dark ? '#1C1917' : '#FFFFFF')
  } catch {
    /* ignore */
  }
}

/** Tashqi havolani xavfsiz ochish (Telegram ichida — Telegram orqali) */
export function openExternal(url: string) {
  if (!/^https:\/\//.test(url)) return
  if (tg) {
    if (/^https:\/\/t\.me\//.test(url) && tg.openTelegramLink) return tg.openTelegramLink(url)
    if (tg.openLink) return tg.openLink(url)
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const BOT_USERNAME = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined)?.replace(/[^A-Za-z0-9_]/g, '') || 'sahna_ai_bot'
export const BOT_URL = `https://t.me/${BOT_USERNAME}`
