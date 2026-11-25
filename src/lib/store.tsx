import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { initialState, loadState, safeStorage, saveState, STORAGE_KEY } from './storage'
import type { AppState, Plan, Project, Theme } from './types'

export type Toast = { id: number; text: string; tone: 'info' | 'success' | 'error' }

type Ctx = {
  state: AppState
  now: number
  progressOf: (p: Project) => number
  statusOf: (p: Project) => Project['status']
  upsertProject: (p: Project) => void
  removeProject: (id: string) => void
  startRender: (id: string, cost: number) => boolean
  addCredits: (n: number) => void
  setPlan: (p: Plan) => void
  setTheme: (t: Theme) => void
  setName: (n: string) => void
  reset: () => void
  toasts: Toast[]
  toast: (text: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const StoreCtx = createContext<Ctx | null>(null)

export const DEMO_RENDER_MS = 12000

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState(safeStorage()))
  const [now, setNow] = useState(() => Date.now())
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => saveState(safeStorage(), state), [state])

  // boshqa oynada o'zgarsa — sinxronlash
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(loadState(safeStorage()))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const anyProcessing = state.projects.some((p) => p.status === 'processing')
  useEffect(() => {
    if (!anyProcessing) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [anyProcessing])

  const progressOf = useCallback(
    (p: Project) => {
      if (p.status === 'ready') return 100
      if (p.status !== 'processing' || !p.startedAt) return 0
      return Math.min(100, Math.max(0, Math.floor(((now - p.startedAt) / (p.renderMs || DEMO_RENDER_MS)) * 100)))
    },
    [now],
  )
  const statusOf = useCallback((p: Project) => (p.status === 'processing' && progressOf(p) >= 100 ? 'ready' : p.status), [progressOf])

  // tayyor bo'lganlarni "ready" holatiga o'tkazish
  useEffect(() => {
    const done = state.projects.filter((p) => p.status === 'processing' && progressOf(p) >= 100)
    if (!done.length) return
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (done.some((d) => d.id === p.id) ? { ...p, status: 'ready', step: 4 } : p)),
    }))
  }, [state.projects, progressOf])

  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = ++toastId.current
    setToasts((t) => [...t.slice(-2), { id, text, tone }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const value = useMemo<Ctx>(
    () => ({
      state,
      now,
      progressOf,
      statusOf,
      toasts,
      toast,
      dismissToast,
      upsertProject: (p) =>
        setState((s) => {
          const exists = s.projects.some((x) => x.id === p.id)
          return { ...s, projects: exists ? s.projects.map((x) => (x.id === p.id ? p : x)) : [p, ...s.projects] }
        }),
      removeProject: (id) => setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) })),
      startRender: (id, cost) => {
        if (cost < 0 || state.credits < cost) return false
        setState((s) => {
          if (s.credits < cost) return s
          return {
            ...s,
            credits: s.credits - cost,
            projects: s.projects.map((p) =>
              p.id === id ? { ...p, status: 'processing', step: 4, cost, startedAt: Date.now(), renderMs: DEMO_RENDER_MS } : p,
            ),
          }
        })
        return true
      },
      addCredits: (n) => setState((s) => ({ ...s, credits: Math.min(1_000_000, s.credits + Math.max(0, Math.round(n))) })),
      setPlan: (plan) => setState((s) => ({ ...s, plan })),
      setTheme: (theme) => setState((s) => ({ ...s, theme })),
      setName: (name) => setState((s) => ({ ...s, name: name.slice(0, 40) })),
      reset: () => setState(initialState()),
    }),
    [state, now, progressOf, statusOf, toasts, toast, dismissToast],
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore StoreProvider ichida ishlatilishi kerak')
  return ctx
}
