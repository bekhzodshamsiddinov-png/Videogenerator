import { describe, expect, it } from 'vitest'
import { loadState, sanitizeState, STORAGE_KEY } from '../../src/lib/storage'
import { generateCharacters, generateScript, sceneCount, totalCost, topicFrom, defaultAnim } from '../../src/lib/scriptGen'
import { scriptToText } from '../../src/lib/format'

describe('storage', () => {
  it("buzilgan ma'lumotdan boshlang'ich holat", () => {
    expect(loadState({ getItem: () => '{oops' }).credits).toBe(40)
    expect(loadState({ getItem: () => { throw new Error('blocked') } }).projects).toEqual([])
    expect(loadState(undefined).plan).toBe('free')
    expect(loadState({ getItem: (k) => (k === STORAGE_KEY ? 'x'.repeat(2_000_001) : null) }).credits).toBe(40)
  })
  it('turlarni tozalaydi va cheklaydi', () => {
    const s = sanitizeState({ credits: -5, plan: 'admin', theme: 'neon', name: 'x'.repeat(100), projects: [{ id: 'a', status: 'hack', duration: 999, scenes: [{ id: 's', action: 1 }], anim: ['yes'] }, 5] })
    expect(s.credits).toBe(0)
    expect(s.plan).toBe('free')
    expect(s.theme).toBe('system')
    expect(s.name).toHaveLength(40)
    expect(s.projects).toHaveLength(1)
    expect(s.projects[0]).toMatchObject({ status: 'draft', duration: 10, anim: [false] })
    expect(s.projects[0].scenes[0].action).toBe('')
  })
})

describe('ssenariy generatori', () => {
  it('davomiylikka qarab sahnalar soni', () => {
    expect([1, 3, 5, 10].map(sceneCount)).toEqual([4, 5, 6, 8])
    const chars = generateCharacters('Ali ismli bola haqida ertak', 'Bolalar')
    expect(chars[0].name).toBe('Ali')
    for (const d of [1, 3, 5, 10]) expect(generateScript('test haqida', 'Multfilm', d, chars)).toHaveLength(sceneCount(d))
    expect(generateScript('Non haqida reklama', 'Reklama', 1, chars)[0].line).toContain('Diktor')
  })
  it('deterministik va mavzu ajratish', () => {
    const c = generateCharacters('x haqida', 'Kattalar')
    expect(generateScript('x haqida', 'Multfilm', 3, c).map((s) => s.action)).toEqual(generateScript('x haqida', 'Multfilm', 3, c).map((s) => s.action))
    expect(topicFrom('Bolalar uchun halol mehnat haqida ertak')).toBe('halol mehnat')
    expect(topicFrom('')).toBe("do'stlik")
  })
  it('narx: animatsiya qimmatroq, arzon rejim arzonroq', () => {
    expect(totalCost(3, [true, true, true, true, true])).toBeGreaterThan(totalCost(3, [false, false, false, false, false]))
    expect(defaultAnim(4)).toEqual([true, false, true, true])
    expect(totalCost(1, [])).toBe(0)
  })
  it('ssenariy matni', () => {
    const t = scriptToText({ title: 'Test', duration: 1, language: "O'zbek", style: 'Anime', characters: [{ name: 'Ali', desc: 'bola', voice: 'Bola ovozi' }], scenes: [{ place: 'Bog', action: 'A', line: 'L' }] })
    expect(t).toContain('SAHNA 1. Bog')
    expect(t).toContain('- Ali (Bola ovozi): bola')
  })
})
