export const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ')

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
export const fmtDate = (ts: number) => {
  const d = new Date(ts)
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`
}

export const fmtDuration = (min: number) => `${min}:00`

export function scriptToText(p: {
  title: string
  duration: number
  language: string
  style: string
  characters: { name: string; desc: string; voice: string }[]
  scenes: { place: string; action: string; line: string }[]
}) {
  const lines = [
    p.title.toUpperCase(),
    `${p.duration} daqiqa · ${p.style} · ${p.language} tilida`,
    '',
    'PERSONAJLAR',
    ...p.characters.map((c) => `- ${c.name} (${c.voice}): ${c.desc}`),
    '',
    'SSENARIY',
  ]
  p.scenes.forEach((s, i) => {
    lines.push('', `SAHNA ${i + 1}. ${s.place}`, s.action, s.line)
  })
  lines.push('', '— Sahna AI yordamida tayyorlandi')
  return lines.join('\n')
}

export function downloadText(filename: string, text: string) {
  const safe = filename.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 60) || 'ssenariy'
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safe}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
