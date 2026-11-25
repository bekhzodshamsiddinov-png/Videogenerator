import { useEffect, useState } from 'react'

export type Route = '/' | '/create' | '/videos' | '/pricing' | '/profile'
export const ROUTES: Route[] = ['/', '/create', '/videos', '/pricing', '/profile']

export function parse(pathname: string): Route {
  const p = (pathname.replace(/\/+$/, '') || '/') as Route
  return ROUTES.includes(p) ? p : '/'
}

const listeners = new Set<() => void>()

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.origin)
  if (url.origin !== window.location.origin) return
  const next = url.pathname + url.search
  const current = window.location.pathname + window.location.search
  if (next !== current) {
    if (opts.replace) window.history.replaceState({ depth: depth() }, '', next)
    else window.history.pushState({ depth: depth() + 1 }, '', next)
  }
  listeners.forEach((l) => l())
  window.scrollTo({ top: 0 })
}

export function depth(): number {
  const d = (window.history.state as { depth?: number } | null)?.depth
  return typeof d === 'number' ? d : 0
}

export function goBack(fallback: Route = '/') {
  if (depth() > 0) window.history.back()
  else navigate(fallback, { replace: true })
}

export function useLocation() {
  const read = () => ({ route: parse(window.location.pathname), search: window.location.search })
  const [loc, setLoc] = useState(read)
  useEffect(() => {
    const update = () => setLoc(read())
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return loc
}
