import { useEffect, useMemo, useRef, useState } from 'react'
import { Coins, Plus, Search, Play, MoreHorizontal, Film, Clock, PenLine, Copy, Trash2, FolderOpen, Download, Send, Sparkles } from 'lucide-react'
import { useStore } from '../lib/store'
import { navigate } from '../lib/router'
import { fmtDate } from '../lib/format'
import { PLAN_LIMITS, gradient, type Project } from '../lib/types'
import { uid } from '../lib/scriptGen'
import { getTg, haptic } from '../lib/telegram'
import { exportScript, shareToTelegram } from '../lib/share'
import { Button, ConfirmDialog, Modal } from '../components/ui'
import { VideoPreview } from '../components/VideoPreview'

const LABEL = { ready: 'Tayyor', processing: 'Jarayonda', draft: 'Qoralama' } as const
const BADGE = {
  ready: 'bg-emerald-100 text-emerald-700',
  processing: 'bg-amber-100 text-amber-700',
  draft: 'bg-white/85 text-stone-700',
} as const
const FILTERS = [
  { id: 'all', label: 'Hammasi' },
  { id: 'ready', label: 'Tayyor' },
  { id: 'processing', label: 'Jarayonda' },
  { id: 'draft', label: 'Qoralama' },
] as const

export function Dashboard() {
  const { state, statusOf, progressOf, upsertProject, removeProject, toast } = useStore()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all')
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState<string | null>(null)
  const [viewing, setViewing] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<Project | null>(null)
  const [newName, setNewName] = useState('')
  const [deleting, setDeleting] = useState<Project | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const tgName = getTg()?.initDataUnsafe?.user?.first_name
  const name = (state.name || tgName || '').trim()

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(null)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [menu])

  const list = useMemo(
    () =>
      [...state.projects]
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((p) => (filter === 'all' || statusOf(p) === filter) && p.title.toLowerCase().includes(q.trim().toLowerCase())),
    [state.projects, filter, q, statusOf],
  )
  const readyCount = state.projects.filter((p) => statusOf(p) === 'ready').length
  const totalMin = state.projects.filter((p) => statusOf(p) === 'ready').reduce((s, p) => s + p.duration, 0)
  const viewed = state.projects.find((p) => p.id === viewing) || null

  function open(p: Project) {
    haptic('tap')
    const st = statusOf(p)
    if (st === 'ready') setViewing(p.id)
    else navigate(`/create?id=${encodeURIComponent(p.id)}`)
  }

  function duplicate(p: Project) {
    const copy: Project = {
      ...p,
      id: uid(),
      title: `${p.title} (nusxa)`.slice(0, 80),
      status: 'draft',
      step: Math.min(p.step, 3),
      cost: 0,
      startedAt: undefined,
      renderMs: undefined,
      createdAt: Date.now(),
      scenes: p.scenes.map((s) => ({ ...s, id: uid() })),
      characters: p.characters.map((c) => ({ ...c, id: uid() })),
    }
    if (copy.step === 4) copy.step = 3
    upsertProject(copy)
    toast('Nusxa yaratildi — qoralamalarda', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Assalomu alaykum{name ? `, ${name}` : ''}!</h1>
          <p className="text-muted text-sm mt-1">Bugun qanday video yaratamiz?</p>
        </div>
        <Button onClick={() => navigate(`/create?new=${Date.now()}`)}>
          <Plus size={17} aria-hidden /> Yangi video
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        <button type="button" onClick={() => navigate('/pricing')} className="text-left rounded-2xl bg-surface border border-line p-4 sm:p-5 hover:border-brand-200 transition">
          <p className="text-xs sm:text-sm text-muted flex items-center gap-1.5">
            <Coins size={15} className="text-amber-500" aria-hidden /> Kredit
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold" data-testid="dash-credits">
            {state.credits}
          </p>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-brand-600">Sotib olish →</p>
        </button>
        <div className="rounded-2xl bg-surface border border-line p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-muted flex items-center gap-1.5">
            <Film size={15} aria-hidden /> Videolar
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold">{readyCount}</p>
          <p className="mt-2 text-xs sm:text-sm text-muted">jami: {state.projects.length}</p>
        </div>
        <div className="rounded-2xl bg-surface border border-line p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-muted flex items-center gap-1.5">
            <Clock size={15} aria-hidden /> Daqiqa
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold">{totalMin}</p>
          <p className="mt-2 text-xs sm:text-sm text-muted truncate">Tarif: {PLAN_LIMITS[state.plan].name}</p>
        </div>
      </div>

      {state.projects.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-line p-8 sm:p-14 text-center">
          <span className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center">
            <Sparkles aria-hidden />
          </span>
          <h2 className="mt-4 text-xl font-bold">Hali videolar yo'q</h2>
          <p className="text-muted mt-1 text-sm max-w-sm mx-auto">Birinchi multfilmingizni yarating — bir necha daqiqa kifoya. Balansingizda {state.credits} ta bepul kredit bor.</p>
          <Button className="mt-5" onClick={() => navigate(`/create?new=${Date.now()}`)}>
            <Plus size={17} aria-hidden /> Birinchi videoni yaratish
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Holat bo'yicha saralash">
              {FILTERS.map((f) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  key={f.id}
                  onClick={() => {
                    haptic('select')
                    setFilter(f.id)
                  }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border ${filter === f.id ? 'bg-ink text-bg border-ink' : 'bg-surface border-line text-muted'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 bg-surface border border-line rounded-xl px-3 py-2 sm:w-64">
              <Search size={16} className="text-faint" aria-hidden />
              <input value={q} maxLength={80} onChange={(e) => setQ(e.target.value)} placeholder="Qidirish..." className="outline-none text-sm flex-1 bg-transparent min-w-0" aria-label="Loyihalarni qidirish" />
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.length === 0 && <p className="text-muted text-sm col-span-full py-8 text-center">Hech narsa topilmadi.</p>}
            {list.map((p, i) => {
              const st = statusOf(p)
              const pr = progressOf(p)
              return (
                <div key={p.id} className="relative rounded-2xl bg-surface border border-line hover:shadow-md transition" data-testid="project-card">
                  <button type="button" onClick={() => open(p)} className="block w-full text-left" aria-label={`${p.title} — ${LABEL[st]}`}>
                    <div className={`relative aspect-video rounded-t-2xl bg-gradient-to-br ${gradient(i)} grid place-items-center`}>
                      {st === 'ready' && (
                        <span className="w-11 h-11 rounded-full bg-white/85 grid place-items-center">
                          <Play size={18} className="ml-0.5 text-stone-800" fill="currentColor" aria-hidden />
                        </span>
                      )}
                      {st === 'processing' && <span className="text-xs font-semibold bg-white/85 text-stone-800 px-2.5 py-1 rounded-full">{pr}% tayyor</span>}
                      {st === 'draft' && <span className="text-xs font-semibold bg-white/85 text-stone-800 px-2.5 py-1 rounded-full">{p.step + 1}/5 qadam</span>}
                      <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE[st]}`}>{LABEL[st]}</span>
                      <span className="absolute bottom-2.5 right-2.5 text-xs font-semibold bg-black/55 text-white px-2 py-0.5 rounded-md">{p.duration}:00</span>
                    </div>
                    <div className="p-4 pr-12">
                      <p className="font-semibold truncate">{p.title}</p>
                      <p className="text-sm text-muted">{fmtDate(p.createdAt)}</p>
                    </div>
                  </button>
                  <div className="absolute right-2 bottom-3" ref={menu === p.id ? menuRef : undefined}>
                    <button
                      type="button"
                      className="w-9 h-9 grid place-items-center rounded-lg text-faint hover:text-ink hover:bg-sunken"
                      aria-label={`${p.title} — amallar`}
                      aria-haspopup="menu"
                      aria-expanded={menu === p.id}
                      onClick={() => {
                        haptic('tap')
                        setMenu(menu === p.id ? null : p.id)
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {menu === p.id && (
                      <div role="menu" className="absolute right-0 bottom-11 z-20 w-52 bg-surface border border-line rounded-xl shadow-xl p-1 animate-fade-in">
                        {[
                          { icon: st === 'ready' ? Play : FolderOpen, label: st === 'ready' ? "Ko'rish" : 'Davom ettirish', run: () => open(p) },
                          {
                            icon: PenLine,
                            label: "Nomini o'zgartirish",
                            run: () => {
                              setRenaming(p)
                              setNewName(p.title)
                            },
                          },
                          { icon: Copy, label: 'Nusxa olish', run: () => duplicate(p) },
                          { icon: Trash2, label: "O'chirish", run: () => setDeleting(p), danger: true },
                        ].map((a) => (
                          <button
                            type="button"
                            role="menuitem"
                            key={a.label}
                            onClick={() => {
                              setMenu(null)
                              a.run()
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left hover:bg-sunken ${a.danger ? 'text-rose-600' : ''}`}
                          >
                            <a.icon size={16} aria-hidden /> {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              onClick={() => navigate(`/create?new=${Date.now()}`)}
              className="rounded-2xl border-2 border-dashed border-line hover:border-brand-200 hover:bg-brand-50/40 min-h-[200px] flex flex-col items-center justify-center gap-2 text-muted hover:text-brand-600 transition"
            >
              <span className="w-12 h-12 rounded-full bg-surface border border-line grid place-items-center">
                <Plus aria-hidden />
              </span>
              <span className="font-medium">Yangi loyiha</span>
            </button>
          </div>
        </>
      )}

      <Modal open={!!viewed} onClose={() => setViewing(null)} title={viewed?.title} wide>
        {viewed && (
          <>
            <VideoPreview scenes={viewed.scenes} title={viewed.title} autoPlay />
            <p className="mt-3 text-sm text-muted">
              {viewed.duration} daqiqa · {viewed.style} · {viewed.language} tilida · {fmtDate(viewed.createdAt)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                onClick={async () => {
                  const r = await exportScript(viewed)
                  toast(r === 'downloaded' ? 'Ssenariy yuklab olindi' : r === 'copied' ? 'Ssenariy nusxalandi' : "Yuklab bo'lmadi", r === 'failed' ? 'error' : 'success')
                }}
              >
                <Download size={16} aria-hidden /> Ssenariy
              </Button>
              <Button variant="secondary" onClick={() => shareToTelegram(viewed)}>
                <Send size={16} aria-hidden /> Telegram
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Nomini o'zgartirish">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!renaming) return
            const t = newName.trim()
            if (!t) return
            upsertProject({ ...renaming, title: t.slice(0, 80) })
            setRenaming(null)
            toast('Nomi yangilandi', 'success')
          }}
        >
          <input
            autoFocus
            value={newName}
            maxLength={80}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-xl border border-line bg-bg px-4 py-3 outline-none focus:border-brand-600"
            aria-label="Yangi nom"
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setRenaming(null)}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!newName.trim()}>
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Loyihani o'chirish"
        text={`«${deleting?.title ?? ''}» butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        danger
        onConfirm={() => {
          if (deleting) {
            removeProject(deleting.id)
            toast("Loyiha o'chirildi", 'success')
          }
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
