export type Scene = { id: string; place: string; action: string; line: string }

export type Voice = 'Bola ovozi' | 'Ayol ovozi' | 'Erkak ovozi' | 'Qariya ovozi'

export type Character = {
  id: string
  name: string
  desc: string
  voice: Voice
  look: number
}

export type VideoType = 'Multfilm' | 'Kino uslubi' | "Ta'limiy" | 'Reklama'
export type VideoStyle = '3D multfilm' | '2D rasm' | 'Anime' | 'Realistik'
export type Audience = 'Bolalar' | 'Kattalar'
export type Language = "O'zbek" | 'Rus' | 'Ingliz'
export type Status = 'draft' | 'processing' | 'ready'
export type Plan = 'free' | 'creator' | 'studio'
export type Theme = 'system' | 'light' | 'dark'

export type Project = {
  id: string
  title: string
  idea: string
  type: VideoType
  style: VideoStyle
  duration: number
  audience: Audience
  language: Language
  scenes: Scene[]
  characters: Character[]
  anim: boolean[]
  step: number
  status: Status
  cost: number
  createdAt: number
  startedAt?: number
  renderMs?: number
}

export type AppState = {
  version: 1
  name: string
  credits: number
  plan: Plan
  theme: Theme
  projects: Project[]
}

export const VIDEO_TYPES: VideoType[] = ['Multfilm', 'Kino uslubi', "Ta'limiy", 'Reklama']
export const STYLES: VideoStyle[] = ['3D multfilm', '2D rasm', 'Anime', 'Realistik']
export const AUDIENCES: Audience[] = ['Bolalar', 'Kattalar']
export const LANGUAGES: Language[] = ["O'zbek", 'Rus', 'Ingliz']
export const VOICES: Voice[] = ['Bola ovozi', 'Ayol ovozi', 'Erkak ovozi', 'Qariya ovozi']
export const DURATIONS = [1, 3, 5, 10]

export const PLAN_LIMITS: Record<Plan, { name: string; maxDuration: number; monthlyMinutes: number }> = {
  free: { name: "Boshlang'ich", maxDuration: 1, monthlyMinutes: 1 },
  creator: { name: 'Ijodkor', maxDuration: 10, monthlyMinutes: 30 },
  studio: { name: 'Studiya', maxDuration: 10, monthlyMinutes: 120 },
}

export const GRADIENTS = [
  'from-amber-200 via-orange-200 to-rose-300',
  'from-sky-200 via-indigo-200 to-violet-300',
  'from-emerald-200 via-teal-200 to-cyan-300',
  'from-rose-200 via-pink-200 to-fuchsia-300',
  'from-lime-200 via-green-200 to-emerald-300',
  'from-violet-200 via-purple-200 to-indigo-300',
]

export const gradient = (i: number) => GRADIENTS[((i % GRADIENTS.length) + GRADIENTS.length) % GRADIENTS.length]
