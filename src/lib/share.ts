import { downloadText, scriptToText } from './format'
import { isTelegram, openExternal } from './telegram'
import type { Project } from './types'

export const siteUrl = () => (typeof window !== 'undefined' ? window.location.origin : 'https://videogenerator.vercel.app')

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export function telegramShareUrl(p: Pick<Project, 'title'>) {
  const text = `«${p.title}» — Sahna AI'da yaratgan multfilmim 🎬`
  return `https://t.me/share/url?url=${encodeURIComponent(siteUrl())}&text=${encodeURIComponent(text)}`
}

export function shareToTelegram(p: Pick<Project, 'title'>) {
  openExternal(telegramShareUrl(p))
}

/** Tizim "ulashish" oynasi, bo'lmasa — havolani nusxalash */
export async function shareProject(p: Pick<Project, 'title'>): Promise<'shared' | 'copied' | 'failed'> {
  const data = { title: p.title, text: `«${p.title}» — Sahna AI'da yaratildi`, url: siteUrl() }
  if (typeof navigator.share === 'function' && !isTelegram()) {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'shared'
    }
  }
  return (await copyText(`${data.text}: ${data.url}`)) ? 'copied' : 'failed'
}

/** Ssenariyni yuklab olish. Telegram ichida fayl yuklab bo'lmagani uchun — nusxalanadi */
export async function exportScript(p: Project): Promise<'downloaded' | 'copied' | 'failed'> {
  const text = scriptToText(p)
  if (isTelegram()) return (await copyText(text)) ? 'copied' : 'failed'
  try {
    downloadText(p.title, text)
    return 'downloaded'
  } catch {
    return (await copyText(text)) ? 'copied' : 'failed'
  }
}

export function speakSample(voice: string, text: string): boolean {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return false
  try {
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const v = voices.find((x) => x.lang.startsWith('uz')) || voices.find((x) => x.lang.startsWith('tr')) || voices.find((x) => x.lang.startsWith('ru'))
    if (v) u.voice = v
    u.lang = v?.lang || 'uz-UZ'
    u.pitch = voice === 'Bola ovozi' ? 1.6 : voice === 'Ayol ovozi' ? 1.25 : voice === 'Qariya ovozi' ? 0.8 : 0.9
    u.rate = voice === 'Qariya ovozi' ? 0.85 : 1
    synth.speak(u)
    return true
  } catch {
    return false
  }
}
