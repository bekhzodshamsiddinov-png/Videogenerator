import { useEffect, useState } from 'react'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import type { Scene } from '../lib/types'
import { gradient } from '../lib/types'
import { haptic } from '../lib/telegram'

const SCENE_MS = 3200

/** Demo pleyer: sahnalarni subtitrlar bilan ketma-ket ko'rsatadi */
export function VideoPreview({ scenes, title, seed = 0, autoPlay = false }: { scenes: Scene[]; title: string; seed?: number; autoPlay?: boolean }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(autoPlay)
  const [ended, setEnded] = useState(false)
  const n = Math.max(1, scenes.length)
  const scene = scenes[i]

  useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => {
      if (i + 1 >= n) {
        setPlaying(false)
        setEnded(true)
      } else setI(i + 1)
    }, SCENE_MS)
    return () => window.clearTimeout(t)
  }, [playing, i, n])

  const toggle = () => {
    haptic('tap')
    if (ended) {
      setI(0)
      setEnded(false)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }
  const jump = (d: number) => {
    haptic('select')
    setEnded(false)
    setI((x) => Math.min(n - 1, Math.max(0, x + d)))
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-stone-900 select-none" data-testid="video-preview">
      <div className="relative aspect-video overflow-hidden">
        <div key={`${i}-${playing}`} className={`absolute inset-0 bg-gradient-to-br ${gradient(i + seed)} ${playing ? 'animate-kenburns' : ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <span className="bg-black/40 rounded-md px-2 py-1 truncate max-w-[70%]">{title}</span>
          <span className="bg-black/40 rounded-md px-2 py-1">
            Sahna {Math.min(i + 1, n)}/{n}
          </span>
        </div>
        {scene && (
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
            <p className="text-[11px] uppercase tracking-wider opacity-80">{scene.place}</p>
            <p className="mt-1 text-sm sm:text-base font-medium leading-snug drop-shadow">{scene.action}</p>
            <p className="mt-2 inline-block bg-black/55 rounded-lg px-2.5 py-1 text-sm italic">{scene.line}</p>
          </div>
        )}
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 grid place-items-center shadow-lg hover:scale-105 transition"
            aria-label={ended ? 'Qayta ko\'rish' : 'Ijro etish'}
          >
            {ended ? <RotateCcw className="text-brand-600" size={26} /> : <Play className="text-brand-600 ml-1" size={28} fill="currentColor" />}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 bg-stone-900 text-white">
        <button type="button" onClick={() => jump(-1)} className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-40" disabled={i === 0} aria-label="Oldingi sahna">
          <SkipBack size={16} />
        </button>
        <button type="button" onClick={toggle} className="p-1.5 rounded-lg hover:bg-white/10" aria-label={playing ? 'Pauza' : 'Ijro etish'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button type="button" onClick={() => jump(1)} className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-40" disabled={i >= n - 1} aria-label="Keyingi sahna">
          <SkipForward size={16} />
        </button>
        <div className="flex-1 flex gap-1" aria-hidden>
          {scenes.map((s, k) => (
            <span key={s.id} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
              <span
                className={`block h-full bg-white ${k < i || (k === i && ended) ? 'w-full' : k === i && playing ? 'w-full transition-[width] ease-linear' : 'w-0'}`}
                style={k === i && playing ? { transitionDuration: `${SCENE_MS}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
