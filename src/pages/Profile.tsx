import { useState } from 'react'
import { Coins, Download, Monitor, Moon, Send, Smartphone, Sun, Trash2, User, ChevronRight, Share, PlusSquare } from 'lucide-react'
import { useStore } from '../lib/store'
import { navigate } from '../lib/router'
import { PLAN_LIMITS, type Theme } from '../lib/types'
import { BOT_URL, getTg, haptic, isTelegram, openExternal } from '../lib/telegram'
import { isIOS, useInstall } from '../lib/pwa'
import { Button, ConfirmDialog, Modal } from '../components/ui'

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'system', label: 'Avto', icon: Monitor },
  { id: 'light', label: "Yorug'", icon: Sun },
  { id: 'dark', label: "Qorong'i", icon: Moon },
]

export function Profile() {
  const { state, setName, setTheme, reset, toast } = useStore()
  const install = useInstall()
  const [name, setLocalName] = useState(state.name)
  const [confirmReset, setConfirmReset] = useState(false)
  const [iosHelp, setIosHelp] = useState(false)
  const tg = getTg()
  const tgUser = tg?.initDataUnsafe?.user
  const inTg = isTelegram()
  const canTgHome = inTg && !!tg?.addToHomeScreen && !!tg?.isVersionAtLeast?.('8.0')

  async function onInstall() {
    haptic('tap')
    if (canTgHome) {
      tg?.addToHomeScreen?.()
      return
    }
    if (install.installed) {
      toast("Ilova allaqachon o'rnatilgan", 'info')
      return
    }
    if (install.canPrompt) {
      const ok = await install.prompt()
      toast(ok ? "Ilova o'rnatildi" : "O'rnatish bekor qilindi", ok ? 'success' : 'info')
      return
    }
    if (isIOS()) {
      setIosHelp(true)
      return
    }
    setIosHelp(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profil</h1>

      <section className="rounded-2xl bg-surface border border-line p-5">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-xl font-bold shrink-0">
            {(state.name || tgUser?.first_name || '?').charAt(0).toUpperCase() || <User aria-hidden />}
          </span>
          <div className="min-w-0">
            <p className="font-semibold truncate">{state.name || tgUser?.first_name || 'Mehmon'}</p>
            <p className="text-sm text-muted">
              {inTg ? `Telegram${tgUser?.username ? ` · @${tgUser.username}` : ''}` : 'Demo hisob · shu qurilmada saqlanadi'}
            </p>
          </div>
        </div>
        <form
          className="mt-5 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setName(name.trim())
            toast('Ism saqlandi', 'success')
          }}
        >
          <label htmlFor="name" className="sr-only">
            Ismingiz
          </label>
          <input
            id="name"
            value={name}
            maxLength={40}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Ismingiz"
            className="flex-1 min-w-0 rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus:border-brand-600"
          />
          <Button type="submit" disabled={name.trim() === state.name}>
            Saqlash
          </Button>
        </form>
      </section>

      <section className="rounded-2xl bg-surface border border-line divide-y divide-line">
        <button type="button" className="w-full flex items-center gap-3 p-4 text-left hover:bg-sunken rounded-t-2xl" onClick={() => navigate('/pricing')}>
          <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center">
            <Coins size={19} aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block font-medium">Tarif: {PLAN_LIMITS[state.plan].name}</span>
            <span className="block text-sm text-muted">Balans: {state.credits} kredit</span>
          </span>
          <ChevronRight size={18} className="text-faint" aria-hidden />
        </button>
        <button type="button" className="w-full flex items-center gap-3 p-4 text-left hover:bg-sunken" onClick={() => void onInstall()}>
          <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center">
            <Smartphone size={19} aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block font-medium">{install.installed ? "Ilova o'rnatilgan" : "Telefonga o'rnatish"}</span>
            <span className="block text-sm text-muted">iPhone va Android — bosh ekranda ilova sifatida</span>
          </span>
          <Download size={18} className="text-faint" aria-hidden />
        </button>
        <button type="button" className="w-full flex items-center gap-3 p-4 text-left hover:bg-sunken rounded-b-2xl" onClick={() => openExternal(BOT_URL)}>
          <span className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 grid place-items-center">
            <Send size={19} aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block font-medium">Telegram bot</span>
            <span className="block text-sm text-muted">Tayyor videolar haqida xabarnomalar</span>
          </span>
          <ChevronRight size={18} className="text-faint" aria-hidden />
        </button>
      </section>

      <section className="rounded-2xl bg-surface border border-line p-5">
        <p className="font-medium">Ko'rinish</p>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Mavzu">
          {THEMES.map((t) => (
            <button
              type="button"
              role="radio"
              aria-checked={state.theme === t.id}
              key={t.id}
              onClick={() => {
                haptic('select')
                setTheme(t.id)
              }}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium ${
                state.theme === t.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-line hover:bg-sunken'
              }`}
            >
              <t.icon size={18} aria-hidden /> {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface border border-line p-5">
        <p className="font-medium">Ma'lumotlar</p>
        <p className="text-sm text-muted mt-1">Demo rejimida loyihalar faqat shu qurilmada saqlanadi.</p>
        <Button variant="secondary" className="mt-4 text-rose-600" onClick={() => setConfirmReset(true)}>
          <Trash2 size={16} aria-hidden /> Barcha ma'lumotlarni tozalash
        </Button>
      </section>

      <p className="text-center text-xs text-faint pb-4">Sahna AI · v1.0 · United IT Clubs</p>

      <ConfirmDialog
        open={confirmReset}
        title="Ma'lumotlarni tozalash"
        text="Barcha loyihalar, kreditlar va sozlamalar o'chiriladi va boshlang'ich holatga qaytadi."
        confirmText="Tozalash"
        danger
        onConfirm={() => {
          reset()
          setLocalName('')
          toast("Ma'lumotlar tozalandi", 'success')
        }}
        onClose={() => setConfirmReset(false)}
      />

      <Modal open={iosHelp} onClose={() => setIosHelp(false)} title="Bosh ekranga qo'shish">
        {isIOS() ? (
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center shrink-0">1</span>
              <span>
                Safari'da pastdagi <Share size={14} className="inline -mt-0.5" aria-label="Ulashish" /> «Ulashish» tugmasini bosing
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center shrink-0">2</span>
              <span>
                <PlusSquare size={14} className="inline -mt-0.5" aria-hidden /> «Bosh ekranga qo'shish» (Add to Home Screen) ni tanlang
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center shrink-0">3</span>
              <span>«Qo'shish» ni bosing — Sahna AI ilova kabi ochiladi</span>
            </li>
          </ol>
        ) : (
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center shrink-0">1</span>
              <span>Chrome'da yuqori o'ng burchakdagi ⋮ menyuni oching</span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-bold grid place-items-center shrink-0">2</span>
              <span>«Ilovani o'rnatish» yoki «Bosh ekranga qo'shish» ni tanlang</span>
            </li>
          </ol>
        )}
        <Button className="w-full mt-5" onClick={() => setIosHelp(false)}>
          Tushunarli
        </Button>
      </Modal>
    </div>
  )
}
