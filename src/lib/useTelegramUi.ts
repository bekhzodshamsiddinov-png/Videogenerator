import { useEffect, useRef } from 'react'
import { getTg } from './telegram'

/** Telegram MainButton'ni komponent hayotiy sikliga bog'laydi */
export function useMainButton(opts: { text: string; onClick: () => void; visible: boolean; enabled?: boolean }) {
  const cb = useRef(opts.onClick)
  cb.current = opts.onClick
  const { text, visible, enabled = true } = opts

  useEffect(() => {
    const mb = getTg()?.MainButton
    if (!mb) return
    const handler = () => cb.current()
    mb.onClick(handler)
    return () => {
      mb.offClick(handler)
      mb.hide()
    }
  }, [])

  useEffect(() => {
    const mb = getTg()?.MainButton
    if (!mb) return
    mb.setText(text)
    if (enabled) mb.enable()
    else mb.disable()
    if (visible) mb.show()
    else mb.hide()
  }, [text, visible, enabled])
}

/** Ichki "orqaga" ishlovchisi (masalan, wizard qadamlari). true qaytarsa — ishlov berildi */
let backOverride: (() => boolean) | null = null
const backSubs = new Set<() => void>()
export const getBackOverride = () => backOverride
export function subscribeBack(fn: () => void) {
  backSubs.add(fn)
  return () => {
    backSubs.delete(fn)
  }
}

export function useBackOverride(handler: (() => boolean) | null, active: boolean) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!active) return
    const fn = () => (ref.current ? ref.current() : false)
    backOverride = fn
    backSubs.forEach((s) => s())
    return () => {
      if (backOverride === fn) backOverride = null
      backSubs.forEach((s) => s())
    }
  }, [active])
}
