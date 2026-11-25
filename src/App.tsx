import { useEffect, useState } from 'react'
import { StoreProvider, useStore } from './lib/store'
import { goBack, useLocation } from './lib/router'
import { applyTgColors, getTg } from './lib/telegram'
import { getBackOverride, subscribeBack } from './lib/useTelegramUi'
import { BottomNav, Header } from './components/Shell'
import { Toasts } from './components/ui'
import { Landing } from './pages/Landing'
import { Wizard } from './pages/Wizard'
import { Dashboard } from './pages/Dashboard'
import { Pricing } from './pages/Pricing'
import { Profile } from './pages/Profile'

const TITLES = {
  '/': "Sahna AI — g'oyangizni multfilmga aylantiring",
  '/create': 'Yangi video · Sahna AI',
  '/videos': 'Mening videolarim · Sahna AI',
  '/pricing': 'Narxlar · Sahna AI',
  '/profile': 'Profil · Sahna AI',
} as const

function useDarkMode() {
  const { state } = useStore()
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false)
  const [tgDark, setTgDark] = useState(() => getTg()?.colorScheme === 'dark')

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const on = () => setSystemDark(mq.matches)
    mq?.addEventListener?.('change', on)
    const tg = getTg()
    const onTheme = () => setTgDark(tg?.colorScheme === 'dark')
    tg?.onEvent?.('themeChanged', onTheme)
    return () => {
      mq?.removeEventListener?.('change', on)
      tg?.offEvent?.('themeChanged', onTheme)
    }
  }, [])

  const auto = getTg() ? tgDark : systemDark
  const dark = state.theme === 'dark' || (state.theme === 'system' && auto)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    applyTgColors(dark)
  }, [dark])
}

function useTelegramBackButton(route: string) {
  const [, force] = useState(0)
  useEffect(() => subscribeBack(() => force((n) => n + 1)), [])
  const override = getBackOverride()
  useEffect(() => {
    const bb = getTg()?.BackButton
    if (!bb) return
    const handler = () => {
      const o = getBackOverride()
      if (o && o()) return
      goBack('/')
    }
    bb.onClick(handler)
    return () => bb.offClick(handler)
  }, [])
  useEffect(() => {
    const bb = getTg()?.BackButton
    if (!bb) return
    if (route !== '/' || override) bb.show()
    else bb.hide()
  }, [route, override])
}

function Shell() {
  const { route, search } = useLocation()
  useDarkMode()
  useTelegramBackButton(route)

  useEffect(() => {
    document.title = TITLES[route]
  }, [route])

  return (
    <div className="min-h-screen flex flex-col">
      <Header route={route} />
      <main className="flex-1 pb-[calc(5rem+var(--safe-bottom))] md:pb-0">
        {route === '/' && <Landing />}
        {route === '/create' && <Wizard key={search} search={search} />}
        {route === '/videos' && <Dashboard />}
        {route === '/pricing' && <Pricing />}
        {route === '/profile' && <Profile />}
      </main>
      <BottomNav route={route} />
      <Toasts />
    </div>
  )
}

export function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
