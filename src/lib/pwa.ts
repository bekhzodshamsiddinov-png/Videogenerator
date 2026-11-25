import { useEffect, useState } from 'react'

type BIPEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

let deferred: BIPEvent | null = null
const subs = new Set<() => void>()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BIPEvent
    subs.forEach((s) => s())
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    subs.forEach((s) => s())
  })
}

export const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)

export const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

export function useInstall() {
  const [, force] = useState(0)
  useEffect(() => {
    const s = () => force((n) => n + 1)
    subs.add(s)
    return () => {
      subs.delete(s)
    }
  }, [])
  return {
    canPrompt: !!deferred,
    installed: isStandalone(),
    async prompt() {
      if (!deferred) return false
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      deferred = null
      subs.forEach((x) => x())
      return outcome === 'accepted'
    },
  }
}

export function registerSW() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
  })
}
