import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Check, ChevronLeft, ChevronRight, Coins, RefreshCw, PenLine, Volume2, Image as ImageIcon, Film, Download, Send, Share2, Sparkles,
  Info, Clock, Lock, ArrowUp, ArrowDown, Loader2, X, Save, Plus, FolderOpen,
} from 'lucide-react'
import { useStore } from '../lib/store'
import { navigate } from '../lib/router'
import {
  CREDIT_PRICE, defaultAnim, generateCharacters, generateScript, sceneCost, titleFrom, totalCost, uid,
} from '../lib/scriptGen'
import {
  AUDIENCES, DURATIONS, LANGUAGES, PLAN_LIMITS, STYLES, VIDEO_TYPES, VOICES, gradient,
  type Project, type Scene, type Voice,
} from '../lib/types'
import { fmt } from '../lib/format'
import { haptic, isTelegram } from '../lib/telegram'
import { exportScript, shareProject, shareToTelegram, speakSample } from '../lib/share'
import { useBackOverride, useMainButton } from '../lib/useTelegramUi'
import { Button, Chip, Modal } from '../components/ui'
import { VideoPreview } from '../components/VideoPreview'

const STEP_NAMES = ["G'oya", 'Ssenariy', 'Personajlar', 'Storyboard', 'Tayyorlash']
const MIN_IDEA = 8

function blankProject(idea: string): Project {
  return {
    id: uid(),
    title: 'Yangi loyiha',
    idea,
    type: 'Multfilm',
    style: '3D multfilm',
    duration: 1,
    audience: 'Bolalar',
    language: "O'zbek",
    scenes: [],
    characters: [],
    anim: [],
    step: 0,
    status: 'draft',
    cost: 0,
    createdAt: Date.now(),
  }
}

const sig = (p: Pick<Project, 'idea' | 'type' | 'duration' | 'audience'>) => `${p.idea.trim()}|${p.type}|${p.duration}|${p.audience}`

function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-2.5">
      {children}
    </label>
  )
}

export function Wizard({ search }: { search: string }) {
  const { state, upsertProject, startRender, progressOf, statusOf, toast } = useStore()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const loadId = params.get('id')
  const ideaParam = (params.get('idea') || '').slice(0, 500)

  const [p, setP] = useState<Project>(() => {
    const existing = loadId ? state.projects.find((x) => x.id === loadId) : undefined
    return existing ? { ...existing } : blankProject(ideaParam)
  })
  const saved = state.projects.find((x) => x.id === p.id)
  const genSig = useRef<string | null>(p.scenes.length ? sig(p) : null)
  const [busy, setBusy] = useState<null | 'script' | 'chars'>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<Scene | null>(null)
  const [lockModal, setLockModal] = useState(false)
  const [lowCredits, setLowCredits] = useState(false)
  const seed = useRef(0)
  const tg = isTelegram()

  useEffect(() => {
    if (loadId && !state.projects.some((x) => x.id === loadId)) toast('Loyiha topilmadi — yangisi ochildi', 'error')
    // faqat birinchi ochilishda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Saqlangan loyihadagi holat o'zgarishlarini (render tugashi) olish
  useEffect(() => {
    if (saved && (saved.status !== p.status || saved.step !== p.step) && saved.status !== 'draft') setP((cur) => ({ ...cur, status: saved.status, step: saved.step, cost: saved.cost, startedAt: saved.startedAt, renderMs: saved.renderMs }))
  }, [saved, p.status, p.step])

  // Qoralamani avtomatik saqlash (ssenariy yaratilgandan keyin)
  useEffect(() => {
    if (p.status === 'draft' && p.scenes.length > 0) upsertProject(p)
    // upsertProject barqaror emas (useMemo ichida), shuning uchun faqat p'ga bog'laymiz
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p])

  const update = (patch: Partial<Project>) => setP((cur) => ({ ...cur, ...patch }))
  const step = p.step
  const limit = PLAN_LIMITS[state.plan]
  const cost = totalCost(p.duration, p.anim)
  const live = saved ?? p
  const progress = progressOf(live)
  const status = statusOf(live)

  async function generate(kind: 'all' | 'script' | 'chars') {
    setBusy(kind === 'chars' ? 'chars' : 'script')
    await new Promise((r) => setTimeout(r, 700))
    seed.current += 1
    setP((cur) => {
      const characters = kind === 'script' && cur.characters.length ? cur.characters : generateCharacters(cur.idea, cur.audience, seed.current)
      // personajlarni qayta yaratishda ismlar o'zgarmaydi — faqat ko'rinish va tavsif
      const chars =
        kind === 'chars'
          ? cur.characters.map((c, i) => ({ ...c, look: c.look + 1 + i, desc: characters[i]?.desc ?? c.desc }))
          : characters
      const scenes = kind === 'chars' ? cur.scenes : generateScript(cur.idea, cur.type, cur.duration, chars, seed.current)
      const anim = kind === 'chars' ? cur.anim : defaultAnim(scenes.length)
      const title = kind === 'all' || cur.title === 'Yangi loyiha' ? titleFrom(cur.idea, chars[0]?.name ?? 'Ali', cur.type) : cur.title
      return { ...cur, characters: chars, scenes, anim, title }
    })
    if (kind !== 'chars') genSig.current = sig(p)
    setBusy(null)
    haptic('success')
  }

  async function next() {
    setError('')
    if (step === 0) {
      if (p.idea.trim().length < MIN_IDEA) {
        setError(`G'oyani batafsilroq yozing (kamida ${MIN_IDEA} ta belgi).`)
        haptic('error')
        return
      }
      if (p.duration > limit.maxDuration) {
        setLockModal(true)
        return
      }
      if (genSig.current !== sig(p) || !p.scenes.length) await generate('all')
      update({ step: 1 })
      return
    }
    if (step === 1 && editing) {
      setError('Avval tahrirlanayotgan sahnani saqlang.')
      return
    }
    if (step === 3) {
      if (state.credits < cost) {
        setLowCredits(true)
        haptic('warning')
        return
      }
      upsertProject({ ...p, step: 3 })
      const ok = startRender(p.id, cost)
      if (!ok) {
        setLowCredits(true)
        return
      }
      update({ step: 4, status: 'processing', cost, startedAt: Date.now() })
      haptic('success')
      return
    }
    update({ step: Math.min(4, step + 1) })
    window.scrollTo({ top: 0 })
  }

  function back() {
    setError('')
    if (step > 0 && step < 4) {
      update({ step: step - 1 })
      window.scrollTo({ top: 0 })
      return true
    }
    return false
  }
  useBackOverride(back, step > 0 && step < 4)

  const primaryText = busy ? 'Yaratilmoqda...' : step === 3 ? `Videoni yaratish · ${cost} kredit` : 'Davom etish'
  useMainButton({ text: primaryText, onClick: () => void next(), visible: tg && step < 4, enabled: !busy })

  function moveScene(i: number, d: number) {
    const j = i + d
    if (j < 0 || j >= p.scenes.length) return
    haptic('select')
    const scenes = [...p.scenes]
    const anim = [...p.anim]
    ;[scenes[i], scenes[j]] = [scenes[j], scenes[i]]
    ;[anim[i], anim[j]] = [anim[j], anim[i]]
    update({ scenes, anim })
  }

  function saveScene() {
    if (!draft) return
    if (!draft.action.trim()) {
      setError("Sahna tavsifi bo'sh bo'lmasin.")
      return
    }
    update({ scenes: p.scenes.map((s) => (s.id === draft.id ? { ...draft, place: draft.place.trim(), action: draft.action.trim(), line: draft.line.trim() } : s)) })
    setEditing(null)
    setDraft(null)
    setError('')
    toast('Sahna saqlandi', 'success')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{step === 0 ? 'Yangi video' : p.title}</h1>
          <p className="text-muted text-sm mt-1">{step === 4 ? 'Videongiz tayyorlanmoqda' : "Har bir qadamda natijani ko'rib, o'zgartirishingiz mumkin"}</p>
        </div>
        {p.status === 'draft' && p.scenes.length > 0 && (
          <span className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-xs text-muted bg-sunken px-2.5 py-1 rounded-full">
            <Save size={13} aria-hidden /> Avtomatik saqlandi
          </span>
        )}
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2 sm:gap-3 mb-6 overflow-x-auto no-scrollbar pb-1" aria-label="Qadamlar">
        {STEP_NAMES.map((n, i) => (
          <li key={n} className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => i < step && step < 4 && update({ step: i })}
              disabled={!(i < step && step < 4)}
              className="flex items-center gap-2 disabled:cursor-default"
              aria-label={`${i + 1}-qadam: ${n}`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span
                className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold transition ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-sunken text-faint'
                }`}
              >
                {i < step ? <Check size={16} aria-hidden /> : i + 1}
              </span>
              <span className={`text-sm font-medium ${i === step ? '' : 'text-muted'} ${i === step ? 'inline' : 'hidden sm:inline'}`}>{n}</span>
            </button>
            {i < STEP_NAMES.length - 1 && <span className={`w-5 sm:w-10 h-0.5 rounded ${i < step ? 'bg-emerald-400' : 'bg-line'}`} aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="bg-surface border border-line rounded-2xl p-4 sm:p-8 shadow-sm">
        {/* QADAM 1 — G'oya */}
        {step === 0 && (
          <div className="grid lg:grid-cols-[1fr_280px] gap-7">
            <div className="space-y-7">
              <div>
                <Label htmlFor="idea">Video nima haqida bo'lsin?</Label>
                <textarea
                  id="idea"
                  value={p.idea}
                  maxLength={1000}
                  onChange={(e) => update({ idea: e.target.value })}
                  rows={4}
                  placeholder="Masalan: Ali ismli bola va uning mushukchasi haqida halol mehnat haqida ertak"
                  className="w-full rounded-xl border border-line bg-bg p-4 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-50 resize-none"
                />
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
                  <button
                    type="button"
                    className="text-brand-600 font-semibold inline-flex items-center gap-1.5 text-sm"
                    onClick={() => {
                      haptic('tap')
                      const base = p.idea.trim() || "do'stlik haqida ertak"
                      if (/sarguzasht/i.test(base)) {
                        toast("G'oya allaqachon boyitilgan", 'info')
                        return
                      }
                      update({ idea: `${base.replace(/[.!]+$/, '')}. Qiziqarli sarguzasht, kulgili lahzalar va oxirida foydali saboq bilan.`.slice(0, 1000) })
                      toast("G'oya boyitildi", 'success')
                    }}
                  >
                    <Sparkles size={14} aria-hidden /> G'oyani AI bilan boyitish
                  </button>
                  <span>{p.idea.length}/1000</span>
                </div>
              </div>
              <div>
                <Label>Video turi</Label>
                <div className="flex flex-wrap gap-2">
                  {VIDEO_TYPES.map((t) => (
                    <Chip key={t} active={p.type === t} onClick={() => update({ type: t })}>
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <Label>Uslub</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Uslub">
                  {STYLES.map((s, i) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={p.style === s}
                      key={s}
                      onClick={() => {
                        haptic('select')
                        update({ style: s })
                      }}
                      className={`rounded-xl overflow-hidden border-2 text-left transition ${p.style === s ? 'border-brand-600' : 'border-transparent hover:border-line'}`}
                    >
                      <div className={`aspect-[4/3] bg-gradient-to-br ${gradient([1, 0, 3, 2][i])} relative`}>
                        {p.style === s && (
                          <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-600 text-white grid place-items-center">
                            <Check size={14} aria-hidden />
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium px-2.5 py-2 bg-sunken">{s}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <Label>Davomiyligi</Label>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map((d) => {
                      const locked = d > limit.maxDuration
                      return (
                        <Chip
                          key={d}
                          active={p.duration === d}
                          title={locked ? 'Ijodkor tarifida' : undefined}
                          onClick={() => (locked ? setLockModal(true) : update({ duration: d }))}
                        >
                          {locked && <Lock size={12} aria-label="Yopiq" />}
                          {d} daq
                        </Chip>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <Label>Tomoshabin</Label>
                  <div className="flex flex-wrap gap-2">
                    {AUDIENCES.map((a) => (
                      <Chip key={a} active={p.audience === a} onClick={() => update({ audience: a })}>
                        {a}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Til</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <Chip key={l} active={p.language === l} onClick={() => update({ language: l })}>
                        {l}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Coins size={16} aria-hidden /> Taxminiy narx
              </p>
              {(() => {
                const est = totalCost(p.duration, defaultAnim(p.scenes.length || [4, 5, 6, 8][DURATIONS.indexOf(p.duration)] || 4))
                return (
                  <>
                    <p className="mt-3 text-3xl font-extrabold" data-testid="estimate">
                      {est} <span className="text-base font-semibold text-muted">kredit</span>
                    </p>
                    <p className="text-sm text-muted">≈ {fmt(est * CREDIT_PRICE)} so'm · {p.duration} daqiqa</p>
                  </>
                )
              })()}
              <div className="mt-4 pt-4 border-t border-amber-500/30 text-sm text-muted space-y-1.5">
                <p className="flex items-center gap-2">
                  <Clock size={14} aria-hidden /> Tayyorlanish: ~{p.duration * 6} daqiqa
                </p>
                <p className="flex items-center gap-2">
                  <Coins size={14} aria-hidden /> Balansingiz: {state.credits} kredit
                </p>
                <p className="flex items-start gap-2">
                  <Info size={14} className="mt-0.5 shrink-0" aria-hidden /> Storyboard'da narxni kamaytirish mumkin
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* QADAM 2 — Ssenariy */}
        {step === 1 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div className="flex-1 min-w-[220px]">
                <Label htmlFor="title">Video nomi</Label>
                <input
                  id="title"
                  value={p.title}
                  maxLength={80}
                  onChange={(e) => update({ title: e.target.value })}
                  onBlur={() => !p.title.trim() && update({ title: 'Nomsiz loyiha' })}
                  className="w-full rounded-xl border border-line bg-bg px-4 py-2.5 font-semibold outline-none focus:border-brand-600"
                />
                <p className="text-sm text-muted mt-1.5">
                  {p.scenes.length} ta sahna · ~{p.duration} daqiqa · {p.language} tilida
                </p>
              </div>
              <Button variant="secondary" size="sm" disabled={!!busy || !!editing} onClick={() => void generate('script')}>
                {busy === 'script' ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <RefreshCw size={15} aria-hidden />} Qayta yozish
              </Button>
            </div>
            <div className="space-y-3">
              {p.scenes.map((s, i) => (
                <div key={s.id} className="rounded-xl border border-line p-4 sm:p-5" data-testid="scene-card">
                  {editing === s.id && draft ? (
                    <div className="space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Sahna {i + 1} — tahrirlash</p>
                      <input
                        aria-label="Joy va vaqt"
                        value={draft.place}
                        maxLength={120}
                        onChange={(e) => setDraft({ ...draft, place: e.target.value })}
                        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand-600"
                      />
                      <textarea
                        aria-label="Sahna tavsifi"
                        value={draft.action}
                        maxLength={500}
                        rows={2}
                        onChange={(e) => setDraft({ ...draft, action: e.target.value })}
                        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-brand-600 resize-none"
                      />
                      <input
                        aria-label="Dialog"
                        value={draft.line}
                        maxLength={300}
                        onChange={(e) => setDraft({ ...draft, line: e.target.value })}
                        className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm italic outline-none focus:border-brand-600"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(null)
                            setDraft(null)
                            setError('')
                          }}
                        >
                          <X size={15} aria-hidden /> Bekor
                        </Button>
                        <Button size="sm" onClick={saveScene}>
                          <Check size={15} aria-hidden /> Saqlash
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
                          Sahna {i + 1} · <span className="text-muted normal-case font-medium tracking-normal">{s.place}</span>
                        </p>
                        <button
                          type="button"
                          className="w-8 h-8 grid place-items-center rounded-lg text-faint hover:text-ink hover:bg-sunken"
                          aria-label={`Sahna ${i + 1}ni tahrirlash`}
                          onClick={() => {
                            haptic('tap')
                            setEditing(s.id)
                            setDraft({ ...s })
                          }}
                        >
                          <PenLine size={16} />
                        </button>
                      </div>
                      <p className="mt-1.5">{s.action}</p>
                      {s.line && <p className="mt-2 text-sm bg-sunken rounded-lg px-3 py-2 text-muted italic">{s.line}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QADAM 3 — Personajlar */}
        {step === 2 && (
          <div>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Personajlar</h2>
                <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
                  <Info size={14} aria-hidden /> Personaj butun video davomida bir xil ko'rinadi
                </p>
              </div>
              <Button variant="secondary" size="sm" disabled={!!busy} onClick={() => void generate('chars')}>
                {busy === 'chars' ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <RefreshCw size={15} aria-hidden />} Hammasini qayta yaratish
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {p.characters.map((c, idx) => (
                <div key={c.id} className="rounded-2xl border border-line overflow-hidden" data-testid="character-card">
                  <div className={`aspect-[4/3] sm:aspect-square bg-gradient-to-br ${gradient(c.look)} grid place-items-center transition-colors`}>
                    <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/70 grid place-items-center text-4xl font-extrabold text-stone-700">{c.name.charAt(0) || '?'}</span>
                  </div>
                  <div className="p-4">
                    <input
                      aria-label="Personaj ismi"
                      value={c.name}
                      maxLength={40}
                      onChange={(e) => update({ characters: p.characters.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) })}
                      onBlur={() => !c.name.trim() && update({ characters: p.characters.map((x) => (x.id === c.id ? { ...x, name: `Qahramon ${idx + 1}` } : x)) })}
                      className="w-full font-semibold bg-transparent outline-none border-b border-transparent focus:border-brand-600"
                    />
                    <p className="text-sm text-muted mt-0.5 min-h-[40px]">{c.desc}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <select
                        aria-label={`${c.name} ovozi`}
                        value={c.voice}
                        onChange={(e) => update({ characters: p.characters.map((x) => (x.id === c.id ? { ...x, voice: e.target.value as Voice } : x)) })}
                        className="flex-1 min-w-0 text-sm border border-line rounded-lg px-2.5 py-2 bg-surface"
                      >
                        {VOICES.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0"
                        aria-label={`${c.name} ovozini eshitish`}
                        onClick={() => {
                          haptic('tap')
                          const line = p.scenes.find((s) => s.line.startsWith(c.name))?.line.split(':').slice(1).join(':').trim() || `Assalomu alaykum! Men ${c.name}.`
                          if (!speakSample(c.voice, line)) toast("Bu qurilmada ovoz namunasi mavjud emas", 'error')
                          else toast(`${c.voice}: namuna ijro etilmoqda`, 'info')
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="mt-3 w-full text-sm font-medium border border-line rounded-lg py-2 flex items-center justify-center gap-1.5 hover:bg-sunken"
                      onClick={() => {
                        haptic('tap')
                        update({ characters: p.characters.map((x) => (x.id === c.id ? { ...x, look: x.look + 1 } : x)) })
                      }}
                    >
                      <RefreshCw size={14} aria-hidden /> Ko'rinishini o'zgartirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QADAM 4 — Storyboard */}
        {step === 3 && (
          <div>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Storyboard</h2>
                <p className="text-sm text-muted mt-1">Har bir sahna turini tanlang. «Rasm + harakat» ancha arzon.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => update({ anim: p.anim.map(() => false) })}>
                  <ImageIcon size={14} aria-hidden /> Hammasi arzon
                </Button>
                <Button variant="secondary" size="sm" onClick={() => update({ anim: p.anim.map(() => true) })}>
                  <Film size={14} aria-hidden /> Hammasi video
                </Button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {p.scenes.map((s, i) => (
                <div key={s.id} className="rounded-2xl border border-line overflow-hidden flex" data-testid="storyboard-card">
                  <div className={`w-24 sm:w-36 shrink-0 bg-gradient-to-br ${gradient(i + 2)} relative`}>
                    <span className="absolute top-2 left-2 text-xs font-bold bg-white/85 text-stone-800 rounded-md px-1.5 py-0.5">{i + 1}</span>
                  </div>
                  <div className="p-3 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-medium line-clamp-2">{s.action}</p>
                      <div className="flex flex-col shrink-0 -mr-1 -mt-1">
                        <button type="button" disabled={i === 0} onClick={() => moveScene(i, -1)} className="p-1 rounded text-faint hover:text-ink disabled:opacity-30" aria-label={`Sahna ${i + 1}ni yuqoriga`}>
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={i === p.scenes.length - 1}
                          onClick={() => moveScene(i, 1)}
                          className="p-1 rounded text-faint hover:text-ink disabled:opacity-30"
                          aria-label={`Sahna ${i + 1}ni pastga`}
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 bg-sunken rounded-lg p-1 text-xs font-medium" role="radiogroup" aria-label={`Sahna ${i + 1} turi`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={p.anim[i]}
                        onClick={() => {
                          haptic('select')
                          update({ anim: p.anim.map((v, k) => (k === i ? true : v)) })
                        }}
                        className={`py-1.5 rounded-md flex items-center justify-center gap-1 ${p.anim[i] ? 'bg-surface shadow-sm text-brand-700' : 'text-muted'}`}
                      >
                        <Film size={13} aria-hidden /> Video
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={!p.anim[i]}
                        onClick={() => {
                          haptic('select')
                          update({ anim: p.anim.map((v, k) => (k === i ? false : v)) })
                        }}
                        className={`py-1.5 rounded-md flex items-center justify-center gap-1 ${!p.anim[i] ? 'bg-surface shadow-sm text-emerald-600' : 'text-muted'}`}
                      >
                        <ImageIcon size={13} aria-hidden /> Rasm+harakat
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted">{sceneCost(p.duration, p.scenes.length, p.anim[i])} kredit</p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2 ${
                state.credits >= cost ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
              }`}
            >
              <span className="flex items-center gap-2" data-testid="total-cost">
                <Coins size={16} aria-hidden /> Jami: <b>{cost} kredit</b> · balans: {state.credits}
              </span>
              <span className="text-muted">Maslahat: dialogli sahnalarni «Rasm + harakat» qilsangiz, sifat deyarli o'zgarmaydi.</span>
            </div>
          </div>
        )}

        {/* QADAM 5 — Tayyorlash */}
        {step === 4 &&
          (status !== 'ready' ? (
            <div className="max-w-xl mx-auto text-center py-6" data-testid="render-progress">
              <span className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center">
                <Sparkles className="animate-pulse" aria-hidden />
              </span>
              <h2 className="mt-4 text-xl font-bold">Videongiz tayyorlanmoqda</h2>
              <p className="text-sm text-muted mt-1">Sahifani yopsangiz ham bo'ladi — tayyor bo'lganda «Mening videolarim»da paydo bo'ladi</p>
              <div className="mt-6 h-3 rounded-full bg-sunken overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm font-semibold">{progress}%</p>
              <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-left">
                {['Ssenariy', 'Personajlar', 'Sahnalar', 'Ovoz', 'Musiqa', 'Montaj'].map((s, i, arr) => {
                  const done = progress >= ((i + 1) / arr.length) * 100
                  const active = !done && progress >= (i / arr.length) * 100
                  return (
                    <li
                      key={s}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                        done ? 'border-emerald-500/30 bg-emerald-500/10' : active ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-line text-faint'
                      }`}
                    >
                      {done ? <Check size={15} className="text-emerald-600" aria-hidden /> : <span className={`w-2 h-2 rounded-full ${active ? 'bg-brand-600 animate-pulse' : 'bg-line'}`} />}
                      {s}
                    </li>
                  )
                })}
              </ul>
              <Button variant="secondary" className="mt-6" onClick={() => navigate('/videos')}>
                <FolderOpen size={16} aria-hidden /> Mening videolarimga o'tish
              </Button>
            </div>
          ) : (
            <div data-testid="render-done">
              <VideoPreview scenes={p.scenes} title={p.title} />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-bold flex items-center gap-2">
                    {p.title}
                    <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-600 px-2 py-0.5 rounded-full">Tayyor</span>
                  </p>
                  <p className="text-sm text-muted">
                    {p.duration} daqiqa · {p.style} · {p.language} tilida · {p.cost} kredit
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={async () => {
                      const r = await exportScript(p)
                      toast(r === 'downloaded' ? 'Ssenariy yuklab olindi' : r === 'copied' ? 'Ssenariy nusxalandi' : 'Yuklab bo\'lmadi', r === 'failed' ? 'error' : 'success')
                    }}
                  >
                    <Download size={16} aria-hidden /> Ssenariy
                  </Button>
                  <Button variant="secondary" onClick={() => shareToTelegram(p)}>
                    <Send size={16} aria-hidden /> Telegram
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      const r = await shareProject(p)
                      if (r === 'copied') toast('Havola nusxalandi', 'success')
                      if (r === 'failed') toast("Ulashib bo'lmadi", 'error')
                    }}
                  >
                    <Share2 size={16} aria-hidden /> Ulashish
                  </Button>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-line flex flex-col sm:flex-row gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => navigate('/videos')}>
                  <FolderOpen size={16} aria-hidden /> Mening videolarim
                </Button>
                <Button className="flex-1" onClick={() => navigate(`/create?new=${Date.now()}`)}>
                  <Plus size={16} aria-hidden /> Yangi video
                </Button>
              </div>
            </div>
          ))}

        {error && (
          <p className="mt-5 text-sm text-rose-600 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Pastki tugmalar */}
      {step < 4 && (
        <div className="sticky bottom-[calc(4rem+var(--safe-bottom))] md:bottom-0 z-20 mt-4 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-bg/95 backdrop-blur md:bg-transparent md:backdrop-blur-none flex items-center justify-between gap-3">
          <Button variant="secondary" disabled={step === 0 || !!busy} onClick={back}>
            <ChevronLeft size={16} aria-hidden /> Orqaga
          </Button>
          {!tg && (
            <Button disabled={!!busy} onClick={() => void next()} data-testid="wizard-next">
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
              {primaryText}
              {!busy && <ChevronRight size={16} aria-hidden />}
            </Button>
          )}
        </div>
      )}

      <Modal open={lockModal} onClose={() => setLockModal(false)} title="Uzunroq videolar — Ijodkor tarifida">
        <p className="text-sm text-muted leading-relaxed">
          «{limit.name}» tarifida video davomiyligi {limit.maxDuration} daqiqagacha. 3, 5 va 10 daqiqalik multfilmlar uchun «Ijodkor» yoki «Studiya» tarifiga o'ting.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              update({ duration: limit.maxDuration })
              setLockModal(false)
            }}
          >
            {limit.maxDuration} daqiqa qoldirish
          </Button>
          <Button
            onClick={() => {
              setLockModal(false)
              navigate('/pricing')
            }}
          >
            Tariflarni ko'rish
          </Button>
        </div>
      </Modal>

      <Modal open={lowCredits} onClose={() => setLowCredits(false)} title="Kredit yetarli emas">
        <p className="text-sm text-muted leading-relaxed">
          Bu video uchun <b className="text-ink">{cost} kredit</b> kerak, balansingizda <b className="text-ink">{state.credits}</b> kredit bor. Kredit sotib oling yoki sahnalarni «Rasm + harakat» rejimiga o'tkazib narxni kamaytiring.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              update({ anim: p.anim.map(() => false) })
              setLowCredits(false)
              toast('Barcha sahnalar arzon rejimga o\'tkazildi', 'success')
            }}
          >
            Arzon rejim
          </Button>
          <Button
            onClick={() => {
              setLowCredits(false)
              upsertProject(p)
              navigate('/pricing')
            }}
          >
            Kredit olish
          </Button>
        </div>
      </Modal>
    </div>
  )
}
