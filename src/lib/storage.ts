import {
  AUDIENCES, LANGUAGES, STYLES, VIDEO_TYPES, VOICES,
  type AppState, type Character, type Plan, type Project, type Scene, type Theme,
} from './types'

export const STORAGE_KEY = 'sahna-ai:v1'
export const START_CREDITS = 40

export const initialState = (): AppState => ({
  version: 1,
  name: '',
  credits: START_CREDITS,
  plan: 'free',
  theme: 'system',
  projects: [],
})

const str = (v: unknown, max: number, fallback = '') => (typeof v === 'string' ? v.slice(0, max) : fallback)
const num = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback
const oneOf = <T extends string>(v: unknown, list: readonly T[], fallback: T): T =>
  typeof v === 'string' && (list as readonly string[]).includes(v) ? (v as T) : fallback

function sanitizeScene(v: unknown): Scene | null {
  if (!v || typeof v !== 'object') return null
  const s = v as Record<string, unknown>
  const id = str(s.id, 64)
  if (!id) return null
  return { id, place: str(s.place, 120), action: str(s.action, 500), line: str(s.line, 300) }
}

function sanitizeCharacter(v: unknown): Character | null {
  if (!v || typeof v !== 'object') return null
  const c = v as Record<string, unknown>
  const id = str(c.id, 64)
  if (!id) return null
  return {
    id,
    name: str(c.name, 40, 'Qahramon'),
    desc: str(c.desc, 200),
    voice: oneOf(c.voice, VOICES, 'Bola ovozi'),
    look: Math.round(num(c.look, 0, 100, 0)),
  }
}

export function sanitizeProject(v: unknown): Project | null {
  if (!v || typeof v !== 'object') return null
  const p = v as Record<string, unknown>
  const id = str(p.id, 64)
  if (!id) return null
  const scenes = Array.isArray(p.scenes) ? p.scenes.slice(0, 20).map(sanitizeScene).filter((x): x is Scene => !!x) : []
  const characters = Array.isArray(p.characters)
    ? p.characters.slice(0, 8).map(sanitizeCharacter).filter((x): x is Character => !!x)
    : []
  const animRaw = Array.isArray(p.anim) ? p.anim : []
  const anim = scenes.map((_, i) => animRaw[i] === true)
  const status = oneOf(p.status, ['draft', 'processing', 'ready'] as const, 'draft')
  return {
    id,
    title: str(p.title, 80, 'Nomsiz loyiha') || 'Nomsiz loyiha',
    idea: str(p.idea, 1000),
    type: oneOf(p.type, VIDEO_TYPES, 'Multfilm'),
    style: oneOf(p.style, STYLES, '3D multfilm'),
    duration: num(p.duration, 1, 10, 1),
    audience: oneOf(p.audience, AUDIENCES, 'Bolalar'),
    language: oneOf(p.language, LANGUAGES, "O'zbek"),
    scenes,
    characters,
    anim,
    step: Math.round(num(p.step, 0, 4, 0)),
    status,
    cost: Math.round(num(p.cost, 0, 100000, 0)),
    createdAt: num(p.createdAt, 0, 8.64e15, Date.now()),
    startedAt: status === 'draft' ? undefined : num(p.startedAt, 0, 8.64e15, Date.now()),
    renderMs: status === 'draft' ? undefined : num(p.renderMs, 1000, 600000, 12000),
  }
}

export function sanitizeState(v: unknown): AppState {
  const base = initialState()
  if (!v || typeof v !== 'object') return base
  const s = v as Record<string, unknown>
  return {
    version: 1,
    name: str(s.name, 40),
    credits: Math.round(num(s.credits, 0, 1_000_000, base.credits)),
    plan: oneOf<Plan>(s.plan, ['free', 'creator', 'studio'], 'free'),
    theme: oneOf<Theme>(s.theme, ['system', 'light', 'dark'], 'system'),
    projects: Array.isArray(s.projects)
      ? s.projects.slice(0, 200).map(sanitizeProject).filter((x): x is Project => !!x)
      : [],
  }
}

export function loadState(storage: Pick<Storage, 'getItem'> | undefined): AppState {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    if (!raw || raw.length > 2_000_000) return initialState()
    return sanitizeState(JSON.parse(raw))
  } catch {
    return initialState()
  }
}

export function saveState(storage: Pick<Storage, 'setItem'> | undefined, state: AppState) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* xotira to'la yoki bloklangan — jim o'tamiz */
  }
}

export function safeStorage(): Storage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined
  } catch {
    return undefined
  }
}
