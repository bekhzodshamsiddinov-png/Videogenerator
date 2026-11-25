import { Coins, Home, Film, Plus, Tag, User } from 'lucide-react'
import { navigate, type Route } from '../lib/router'
import { useStore } from '../lib/store'
import { haptic, isTelegram } from '../lib/telegram'
import { Logo } from './ui'

const links: { to: Route; label: string }[] = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/create', label: 'Yangi loyiha' },
  { to: '/videos', label: 'Mening videolarim' },
  { to: '/pricing', label: 'Narxlar' },
]

export function Header({ route }: { route: Route }) {
  const { state } = useStore()
  const go = (to: Route) => {
    haptic('select')
    navigate(to)
  }
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-line pt-safe">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
        <button type="button" onClick={() => go('/')} aria-label="Bosh sahifa">
          <Logo small />
        </button>
        <nav className="hidden md:flex items-center gap-1" aria-label="Asosiy menyu">
          {links.map((l) => (
            <button
              type="button"
              key={l.to}
              onClick={() => go(l.to)}
              aria-current={route === l.to ? 'page' : undefined}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                route === l.to ? 'bg-brand-50 text-brand-700' : 'text-muted hover:text-ink hover:bg-sunken'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('/pricing')}
            className="flex items-center gap-1.5 text-sm font-medium text-ink bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-amber-500/20"
            aria-label={`Kredit balansi: ${state.credits}. Kredit sotib olish`}
            data-testid="credit-badge"
          >
            <Coins size={15} className="text-amber-500" aria-hidden /> {state.credits}
          </button>
          <button
            type="button"
            onClick={() => go('/profile')}
            className={`hidden md:grid w-9 h-9 rounded-full place-items-center border ${route === '/profile' ? 'border-brand-600 text-brand-700 bg-brand-50' : 'border-line text-muted hover:bg-sunken'}`}
            aria-label="Profil"
          >
            <User size={17} />
          </button>
          <button
            type="button"
            onClick={() => go('/create')}
            className="hidden md:inline-flex bg-brand-600 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Video yaratish
          </button>
        </div>
      </div>
    </header>
  )
}

const tabs: { to: Route; label: string; icon: typeof Home }[] = [
  { to: '/', label: 'Bosh', icon: Home },
  { to: '/videos', label: 'Videolar', icon: Film },
  { to: '/create', label: 'Yaratish', icon: Plus },
  { to: '/pricing', label: 'Narxlar', icon: Tag },
  { to: '/profile', label: 'Profil', icon: User },
]

export function BottomNav({ route }: { route: Route }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-line pb-safe"
      aria-label="Pastki menyu"
      data-tg={isTelegram() ? '1' : '0'}
    >
      <div className="grid grid-cols-5 h-16">
        {tabs.map((t) => {
          const active = route === t.to
          const center = t.to === '/create'
          return (
            <button
              type="button"
              key={t.to}
              onClick={() => {
                haptic('select')
                navigate(t.to)
              }}
              aria-current={active ? 'page' : undefined}
              aria-label={t.label}
              className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            >
              {center ? (
                <span className="w-11 h-11 -mt-1 rounded-2xl bg-brand-600 text-white grid place-items-center shadow-lg shadow-brand-600/30">
                  <t.icon size={22} />
                </span>
              ) : (
                <t.icon size={21} className={active ? 'text-brand-600' : 'text-faint'} />
              )}
              <span className={active ? 'text-brand-600' : 'text-muted'}>{center ? '' : t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
