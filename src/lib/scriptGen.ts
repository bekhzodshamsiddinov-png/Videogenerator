import type { Audience, Character, Scene, VideoType, Voice } from './types'

/**
 * Demo ssenariy generatori. Haqiqiy AI (Claude/Gemini) ulanganda shu modul
 * o'rniga API chaqiruvi qo'yiladi — interfeys (generateScript / generateCharacters) o'zgarmaydi.
 */

let counter = 0
export const uid = () => `${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 7)}`

function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

export function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)]

const HERO_NAMES = ['Ali', 'Zarina', 'Sardor', 'Madina', 'Jasur', 'Laylo', 'Bobur', 'Nilufar']
const HELPERS = [
  { name: 'Mushukcha Momiq', desc: "Oq-kulrang paxmoq mushuk, aqlli va sho'x", voice: 'Bola ovozi' as Voice },
  { name: "Kuchukcha Bo'ri", desc: "Jigarrang quloqli sodiq kuchukcha", voice: 'Bola ovozi' as Voice },
  { name: "To'tiqush Rangin", desc: "Yashil patli, gapga usta to'tiqush", voice: 'Ayol ovozi' as Voice },
]
const ELDERS = [
  { name: 'Buvijon', desc: "Mehribon buvi, oq ro'mol, atlas ko'ylak", voice: 'Qariya ovozi' as Voice },
  { name: 'Bobojon', desc: "Oq soqolli dono bobo, chopon va do'ppi", voice: 'Qariya ovozi' as Voice },
  { name: 'Ustoz', desc: "Ko'zoynakli, sabrli va mehribon o'qituvchi", voice: 'Erkak ovozi' as Voice },
]

const PLACES = [
  'Qishloq hovlisi, tong',
  "Bog', kunduzi",
  'Bozor, peshin',
  'Maktab sinfi, ertalab',
  'Tog\' etagi, quyosh botishi',
  'Uy, kechqurun',
  'Choyxona, kunduzi',
  'Daryo bo\'yi, salqin tong',
]

const ARC = [
  (h: string, t: string) => ({ action: `${h} kunni boshlaydi va ${t} haqida o'ylab qoladi.`, line: `${h}: Bugun nimadir yangi o'rganaman!` }),
  (h: string, _t: string, a: string) => ({ action: `${h} va ${a} yo'lda kutilmagan muammoga duch kelishadi.`, line: `${a}: Qo'rqma, birga yechimini topamiz!` }),
  (h: string, t: string) => ({ action: `${h} sabr va mehnat bilan ${t} sirini ochadi.`, line: `${h}: Harakat qilsang, albatta uddalaysan!` }),
  (h: string, _t: string, _a: string, e: string) => ({ action: `${e} ${h}ga muhim maslahat beradi.`, line: `${e}: Yaxshilik qilsang, yaxshilik qaytadi, bolam.` }),
  (h: string, t: string, a: string) => ({ action: `${h} va ${a} o'rganganlarini boshqalar bilan bo'lishadi.`, line: `${h}: ${capitalize(t)} — bu hammamiz uchun!` }),
  (h: string, _t: string, _a: string, e: string) => ({ action: `Kechqurun hamma yig'ilib, ${h}ning yutug'ini nishonlaydi.`, line: `${e}: Barakalla! Sendan faxrlanamiz.` }),
]

const AD_ARC = [
  (_h: string, t: string) => ({ action: `Shahar tongi. Odamlar ${t} izlab shoshilishadi.`, line: 'Diktor: Har kuni sifatli tanlov kerakmi?' }),
  (h: string, t: string) => ({ action: `${h} ${t}ni birinchi marta sinab ko'radi va hayratlanadi.`, line: `${h}: Voy, bu haqiqatan zo'r ekan!` }),
  (_h: string, t: string) => ({ action: `Yaqin plan: ${t} afzalliklari chiroyli ko'rsatiladi.`, line: 'Diktor: Tez, arzon va ishonchli.' }),
  () => ({ action: 'Logotip va manzil ekranda paydo bo\'ladi.', line: 'Diktor: Bugunoq murojaat qiling!' }),
]

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** G'oyadan qisqa mavzu ajratib olish */
const STOP = new Set(['va', 'uchun', 'bilan', 'haqida', 'ismli', 'nomli', 'bola', 'qiz', 'bolalar', 'kattalar', 'ham', 'bir', 'uning', 'bu', 'shu', 'ertak', 'dars', 'hikoya', 'reklama'])
export function topicFrom(idea: string) {
  const clean = idea.replace(/\s+/g, ' ').trim()
  if (!clean) return "do'stlik"
  const words = clean.split(/[.,!?;:]/)[0].split(' ')
  const lower = words.map((w) => w.toLowerCase())
  const at = lower.lastIndexOf('haqida')
  let picked: string[] = []
  if (at > 0) {
    for (let i = at - 1; i >= 0 && picked.length < 2; i--) {
      if (STOP.has(lower[i])) {
        if (picked.length) break
        continue
      }
      picked.unshift(lower[i])
    }
  }
  if (!picked.length) picked = lower.filter((w) => !STOP.has(w)).slice(0, 2)
  return picked.join(' ') || "do'stlik"
}

export function titleFrom(idea: string, heroName: string, type: VideoType) {
  const topic = topicFrom(idea)
  if (type === 'Reklama') return `${capitalize(topic)} — reklama`
  if (type === "Ta'limiy") return `${capitalize(topic)}: qiziqarli dars`
  return `${heroName} va ${topic}`
}

export function sceneCount(duration: number) {
  if (duration <= 1) return 4
  if (duration <= 3) return 5
  if (duration <= 5) return 6
  return 8
}

export function generateCharacters(idea: string, audience: Audience, seed = 0): Character[] {
  const r = rng(hash(idea) + seed * 7919)
  const nameMatch = idea.match(/(?:ismli|nomli)\s*([A-ZÀ-ÿʻʼ'][\p{L}'ʻʼ]+)|([A-Z][\p{L}'ʻʼ]+)\s+(?:ismli|nomli)/u)
  const hero = (nameMatch?.[1] || nameMatch?.[2]) ?? pick(r, HERO_NAMES)
  const helper = pick(r, HELPERS)
  const elder = pick(r, ELDERS)
  const age = audience === 'Bolalar' ? `${7 + Math.floor(r() * 4)} yoshli` : 'yosh'
  return [
    { id: uid(), name: hero, desc: `${age} mehnatkash va quvnoq qahramon`, voice: audience === 'Bolalar' ? 'Bola ovozi' : 'Erkak ovozi', look: Math.floor(r() * 6) },
    { id: uid(), ...helper, look: Math.floor(r() * 6) },
    { id: uid(), ...elder, look: Math.floor(r() * 6) },
  ]
}

export function generateScript(idea: string, type: VideoType, duration: number, characters: Character[], seed = 0): Scene[] {
  const r = rng(hash(idea) + seed * 104729 + duration)
  const n = sceneCount(duration)
  const topic = topicFrom(idea)
  const [hero, helper, elder] = [characters[0]?.name ?? 'Ali', characters[1]?.name ?? 'Momiq', characters[2]?.name ?? 'Buvijon']
  const arc = type === 'Reklama' ? AD_ARC : ARC
  const places = [...PLACES].sort(() => r() - 0.5)
  const scenes: Scene[] = []
  for (let i = 0; i < n; i++) {
    const beat = arc[Math.min(arc.length - 1, Math.floor((i / n) * arc.length))]
    const { action, line } = beat(hero, topic, helper, elder)
    scenes.push({ id: uid(), place: places[i % places.length], action, line })
  }
  return scenes
}

/** Kredit narxi: to'liq animatsiya soniyasiga 0.5, "rasm + harakat" 0.12 kredit */
export function sceneCost(duration: number, scenes: number, animated: boolean) {
  const secs = (duration * 60) / Math.max(1, scenes)
  return Math.max(1, Math.ceil(secs * (animated ? 0.5 : 0.12)))
}

export function totalCost(duration: number, anim: boolean[]) {
  return anim.reduce((s, a) => s + sceneCost(duration, anim.length, a), 0)
}

/** Standart aralash: har ikkinchi sahna animatsiya */
export const defaultAnim = (n: number) => Array.from({ length: n }, (_, i) => i === 0 || i === n - 1 || i % 2 === 0)

export const CREDIT_PRICE = 780 // so'm, 150 kreditlik paket bo'yicha taxminiy
