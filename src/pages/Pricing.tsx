import { useState } from 'react'
import { Check, Coins } from 'lucide-react'
import { useStore } from '../lib/store'
import { fmt } from '../lib/format'
import { navigate } from '../lib/router'
import { haptic } from '../lib/telegram'
import type { Plan } from '../lib/types'
import { Checkout, type CheckoutItem } from '../components/Checkout'

const PLANS: { id: Plan; n: string; m: number; credits: number; d: string; f: string[]; pop?: boolean }[] = [
  { id: 'free', n: "Boshlang'ich", m: 0, credits: 0, d: "Sinab ko'rish uchun", f: ['40 ta bepul kredit', '1 daqiqagacha video', '720p sifat', "O'zbekcha ovoz", 'Suv belgisi bilan'] },
  { id: 'creator', n: 'Ijodkor', m: 99000, credits: 600, d: "O'qituvchi va blogerlar uchun", f: ['Oyiga 600 kredit (~30 daqiqa)', '10 daqiqagacha video', '1080p sifat', 'Suv belgisisiz', 'Barcha uslub va ovozlar'], pop: true },
  { id: 'studio', n: 'Studiya', m: 299000, credits: 2400, d: 'Biznes va agentliklar uchun', f: ['Oyiga 2400 kredit (~120 daqiqa)', '10 daqiqagacha video', '1080p sifat', 'Tijorat huquqi', 'Ustuvor navbat'] },
]
const PACKS = [
  { c: 50, p: 39000 },
  { c: 150, p: 99000, tag: 'Tejamkor' },
  { c: 500, p: 290000 },
]

export function Pricing() {
  const { state } = useStore()
  const [yearly, setYearly] = useState(false)
  const [item, setItem] = useState<CheckoutItem | null>(null)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Oddiy va arzon narxlar</h1>
        <p className="mt-2 text-muted">Istalgan vaqtda bekor qilish mumkin. Yashirin to'lovlar yo'q.</p>
        <div className="mt-6 inline-flex bg-surface border border-line rounded-full p-1 text-sm font-medium" role="radiogroup" aria-label="To'lov davri">
          <button
            type="button"
            role="radio"
            aria-checked={!yearly}
            onClick={() => {
              haptic('select')
              setYearly(false)
            }}
            className={`px-4 py-1.5 rounded-full ${!yearly ? 'bg-ink text-bg' : 'text-muted'}`}
          >
            Oylik
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={yearly}
            onClick={() => {
              haptic('select')
              setYearly(true)
            }}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 ${yearly ? 'bg-ink text-bg' : 'text-muted'}`}
          >
            Yillik <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-4 items-start">
        {PLANS.map((p) => {
          const price = yearly ? Math.round((p.m * 0.8) / 1000) * 1000 : p.m
          const current = state.plan === p.id
          return (
            <div
              key={p.id}
              className={`rounded-2xl bg-surface p-6 sm:p-7 ${p.pop ? 'border-2 border-brand-600 shadow-lg shadow-brand-600/10 md:-mt-3' : 'border border-line'}`}
              data-testid={`plan-${p.id}`}
            >
              <div className="flex items-center gap-2 h-6">
                {p.pop && <span className="text-xs font-semibold bg-brand-600 text-white px-2.5 py-1 rounded-full">Eng ommabop</span>}
                {current && <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Joriy tarif</span>}
              </div>
              <p className="mt-3 font-semibold text-lg">{p.n}</p>
              <p className="text-sm text-muted">{p.d}</p>
              <p className="mt-5">
                <span className="text-4xl font-extrabold">{price === 0 ? 'Bepul' : fmt(price)}</span>
                {price > 0 && <span className="text-muted text-sm"> so'm/oy</span>}
              </p>
              {yearly && price > 0 && <p className="text-xs text-muted mt-1">Yiliga {fmt(price * 12)} so'm</p>}
              <button
                type="button"
                disabled={current}
                onClick={() => {
                  haptic('tap')
                  if (p.id === 'free') {
                    navigate(`/create?new=${Date.now()}`)
                    return
                  }
                  setItem({ kind: 'plan', plan: p.id, name: `${p.n} tarifi`, price, credits: yearly ? p.credits * 12 : p.credits, yearly })
                }}
                className={`mt-6 w-full py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-60 disabled:cursor-default ${
                  p.pop ? 'bg-brand-600 hover:opacity-90 text-white' : 'border border-line hover:bg-sunken'
                }`}
              >
                {current ? 'Faol' : p.id === 'free' ? 'Bepul boshlash' : 'Tanlash'}
              </button>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.f.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-center">Bir martalik kredit paketlari</h2>
        <p className="text-center text-sm text-muted mt-1">Obunasiz, kerak bo'lganda sotib oling. Kreditlar 12 oy amal qiladi.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {PACKS.map((k) => (
            <div key={k.c} className="relative rounded-2xl bg-surface border border-line p-5 text-center" data-testid="credit-pack">
              {k.tag && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">{k.tag}</span>}
              <p className="flex items-center justify-center gap-1.5 text-2xl font-extrabold">
                <Coins size={20} className="text-amber-500" aria-hidden /> {k.c}
              </p>
              <p className="text-sm text-muted">kredit</p>
              <p className="mt-3 font-semibold">{fmt(k.p)} so'm</p>
              <button
                type="button"
                onClick={() => {
                  haptic('tap')
                  setItem({ kind: 'pack', name: `${k.c} kredit`, price: k.p, credits: k.c })
                }}
                className="mt-4 w-full py-2 rounded-xl border border-line text-sm font-medium hover:bg-sunken"
              >
                Sotib olish
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-muted mr-1">To'lov:</span>
          {['Click', 'Payme', 'Uzum', 'Humo', 'Visa'].map((x) => (
            <span key={x} className="px-3 py-1.5 rounded-lg bg-surface border border-line font-semibold">
              {x}
            </span>
          ))}
        </div>
      </div>

      <Checkout item={item} onClose={() => setItem(null)} />
    </div>
  )
}
