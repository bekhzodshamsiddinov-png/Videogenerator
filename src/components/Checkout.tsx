import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { Button, Modal } from './ui'
import { fmt } from '../lib/format'
import { useStore } from '../lib/store'
import { haptic } from '../lib/telegram'
import type { Plan } from '../lib/types'

export type CheckoutItem =
  | { kind: 'plan'; plan: Plan; name: string; price: number; credits: number; yearly: boolean }
  | { kind: 'pack'; name: string; price: number; credits: number }

const METHODS = ['Click', 'Payme', 'Uzum', 'Humo', 'Visa'] as const

export function Checkout({ item, onClose }: { item: CheckoutItem | null; onClose: () => void }) {
  const { addCredits, setPlan, toast } = useStore()
  const [method, setMethod] = useState<(typeof METHODS)[number]>('Click')
  const [stage, setStage] = useState<'form' | 'paying' | 'done'>('form')

  useEffect(() => {
    if (item) {
      setStage('form')
      setMethod('Click')
    }
  }, [item])

  useEffect(() => {
    if (stage !== 'paying' || !item) return
    const t = window.setTimeout(() => {
      if (item.kind === 'plan') setPlan(item.plan)
      addCredits(item.credits)
      haptic('success')
      toast(`To'lov qabul qilindi: +${item.credits} kredit`, 'success')
      setStage('done')
    }, 1200)
    return () => window.clearTimeout(t)
  }, [stage, item, addCredits, setPlan, toast])

  const total = item ? (item.kind === 'plan' && item.yearly ? item.price * 12 : item.price) : 0

  return (
    <Modal open={!!item} onClose={stage === 'paying' ? () => {} : onClose} title={stage === 'done' ? 'Tayyor!' : "To'lov"}>
      {item && stage !== 'done' && (
        <div>
          <div className="rounded-xl bg-sunken p-4">
            <p className="text-sm text-muted">{item.kind === 'plan' ? 'Tarif' : 'Kredit paketi'}</p>
            <p className="font-semibold text-lg">{item.name}</p>
            <p className="text-sm text-muted mt-1">
              +{item.credits} kredit{item.kind === 'plan' ? (item.yearly ? ' · yillik to\'lov' : ' · oylik to\'lov') : ''}
            </p>
            <p className="mt-3 text-2xl font-extrabold">
              {fmt(total)} <span className="text-base font-semibold text-muted">so'm</span>
            </p>
          </div>
          <p className="mt-5 text-sm font-semibold">To'lov usuli</p>
          <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="To'lov usuli">
            {METHODS.map((m) => (
              <button
                type="button"
                role="radio"
                aria-checked={method === m}
                key={m}
                onClick={() => {
                  haptic('select')
                  setMethod(m)
                }}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition ${
                  method === m ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line hover:bg-sunken'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted flex items-start gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-px" aria-hidden />
            Demo rejim: haqiqiy pul yechilmaydi. To'lov tizimlari (Click, Payme, Uzum) shartnoma tuzilgandan so'ng ulanadi.
          </p>
          <Button className="w-full mt-5" size="lg" disabled={stage === 'paying'} onClick={() => setStage('paying')}>
            {stage === 'paying' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> To'lanmoqda...
              </>
            ) : (
              `${method} orqali to'lash`
            )}
          </Button>
        </div>
      )}
      {item && stage === 'done' && (
        <div className="text-center py-4">
          <CheckCircle2 size={52} className="mx-auto text-emerald-500" aria-hidden />
          <p className="mt-3 font-semibold text-lg">To'lov muvaffaqiyatli</p>
          <p className="text-muted text-sm mt-1">Hisobingizga {item.credits} kredit qo'shildi.</p>
          <Button className="w-full mt-6" onClick={onClose}>
            Davom etish
          </Button>
        </div>
      )}
    </Modal>
  )
}
