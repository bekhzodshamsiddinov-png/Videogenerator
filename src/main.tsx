import '@fontsource-variable/inter'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { initTelegram } from './lib/telegram'
import { registerSW } from './lib/pwa'
import { verifyTelegramSession } from './lib/session'
import { loadState, safeStorage } from './lib/storage'

/** Birinchi chizishdan oldin mavzuni qo'llash — yorug'dan qorong'iga "miltillash" bo'lmasin */
function applyInitialTheme(tgScheme?: 'light' | 'dark') {
  const { theme } = loadState(safeStorage())
  const auto = tgScheme ? tgScheme === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && !!auto))
}

async function boot() {
  applyInitialTheme()
  const tg = await initTelegram()
  if (tg) applyInitialTheme(tg.colorScheme)
  if (tg) void verifyTelegramSession(tg.initData)
  const root = document.getElementById('root')
  if (!root) return
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  registerSW()
}

void boot()
