import React, { useEffect, useRef } from 'react'
import { X, CheckCircle2, AlertCircle, Info, Clapperboard } from 'lucide-react'
import { useStore } from '../lib/store'
import { haptic } from '../lib/telegram'

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`${small ? 'w-8 h-8' : 'w-9 h-9'} rounded-xl bg-brand-600 text-white grid place-items-center shrink-0`}>
        <Clapperboard size={small ? 16 : 18} aria-hidden />
      </span>
      <span className="font-bold text-lg tracking-tight">
        Sahna<span className="text-brand-600"> AI</span>
      </span>
    </span>
  )
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className = '', onClick, ...rest }: BtnProps) {
  const v = {
    primary: 'bg-brand-600 hover:opacity-90 text-white shadow-sm',
    secondary: 'bg-surface border border-line hover:bg-sunken text-ink',
    ghost: 'text-muted hover:text-ink hover:bg-sunken',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
  }[variant]
  const s = { sm: 'text-sm px-3 py-2 rounded-lg', md: 'text-sm px-4 py-2.5 rounded-xl', lg: 'text-base px-6 py-3.5 rounded-xl' }[size]
  return (
    <button
      type="button"
      {...rest}
      onClick={(e) => {
        haptic('tap')
        onClick?.(e)
      }}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none ${v} ${s} ${className}`}
    />
  )
}

export function Chip({ active, children, onClick, disabled, title }: { active: boolean; children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => {
        haptic('select')
        onClick()
      }}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition inline-flex items-center gap-1.5 ${
        active ? 'bg-brand-600 text-white border-transparent' : 'bg-surface border-line text-ink hover:border-faint'
      } disabled:opacity-50`}
    >
      {children}
    </button>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
  labelledBy,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  wide?: boolean
  labelledBy?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      prev?.focus?.()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        className={`relative w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'} max-h-[92vh] overflow-y-auto bg-surface text-ink rounded-t-3xl sm:rounded-2xl shadow-2xl animate-slide-up outline-none pb-safe`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 pt-4 pb-3 bg-surface">
          <span className="sm:hidden absolute left-1/2 -translate-x-1/2 top-1.5 w-10 h-1 rounded-full bg-line" aria-hidden />
          <h2 className="font-bold text-lg leading-tight">{title}</h2>
          <button type="button" onClick={onClose} className="w-9 h-9 shrink-0 rounded-full grid place-items-center hover:bg-sunken text-muted" aria-label="Yopish">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmText,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  text: string
  confirmText: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-muted text-sm leading-relaxed">{text}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={onClose}>
          Bekor qilish
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div className="fixed z-[60] left-0 right-0 bottom-[calc(84px+var(--safe-bottom))] md:bottom-6 flex flex-col items-center gap-2 px-4 pointer-events-none" aria-live="polite" role="status">
      {toasts.map((t) => {
        const Icon = t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertCircle : Info
        const color = t.tone === 'success' ? 'text-emerald-400' : t.tone === 'error' ? 'text-rose-400' : 'text-sky-300'
        return (
          <button
            type="button"
            key={t.id}
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto max-w-md w-full sm:w-auto flex items-center gap-2.5 bg-stone-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl animate-slide-up text-left"
          >
            <Icon size={18} className={`${color} shrink-0`} aria-hidden />
            <span>{t.text}</span>
          </button>
        )
      })}
    </div>
  )
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {sub && <p className="text-muted mt-2">{sub}</p>}
    </div>
  )
}
