import { generateCharacters, generateScript } from './scriptGen'
import type { VideoType } from './types'

export type Example = { title: string; sub: string; dur: string; idea: string; type: VideoType; minutes: number }

export const EXAMPLES: Example[] = [
  { title: 'Bolalar ertagi', sub: 'Halol mehnat haqida', dur: '3:12', idea: "Ali ismli bola haqida halol mehnat haqida ertak", type: 'Multfilm', minutes: 3 },
  { title: "Ta'limiy dars", sub: 'Quyosh tizimi sayohati', dur: '5:40', idea: "Bolalar uchun quyosh tizimi haqida qiziqarli dars", type: "Ta'limiy", minutes: 5 },
  { title: 'Reklama roligi', sub: 'Non zavodi uchun', dur: '0:30', idea: 'Issiq tandir noni haqida reklama', type: 'Reklama', minutes: 1 },
  { title: 'Tarixiy hikoya', sub: "Buyuk ipak yo'li", dur: '8:05', idea: "Buyuk ipak yo'li haqida tarixiy hikoya", type: 'Kino uslubi', minutes: 10 },
  { title: 'YouTube multfilm', sub: 'Mushukcha Momiq, 4-qism', dur: '6:18', idea: "Madina nomli qiz va mushukcha do'stlik haqida", type: 'Multfilm', minutes: 5 },
  { title: 'Tabrik videosi', sub: "Onajonim tug'ilgan kuni", dur: '1:20', idea: "Onajonim uchun mehr haqida tabrik", type: 'Multfilm', minutes: 1 },
]

export function exampleScenes(e: Example) {
  const chars = generateCharacters(e.idea, 'Bolalar')
  return generateScript(e.idea, e.type, e.minutes, chars)
}
