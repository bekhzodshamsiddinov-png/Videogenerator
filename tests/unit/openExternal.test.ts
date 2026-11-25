import { afterEach, describe, expect, it, vi } from 'vitest'

describe('openExternal', () => {
  afterEach(() => vi.unstubAllGlobals())
  it("faqat https havolalarini ochadi", async () => {
    const open = vi.fn()
    vi.stubGlobal('window', { open, location: { hash: '', search: '' } })
    const { openExternal } = await import('../../src/lib/telegram')
    openExternal('javascript:alert(1)')
    openExternal('http://insecure.example')
    openExternal('data:text/html,hi')
    expect(open).not.toHaveBeenCalled()
    openExternal('https://t.me/sahna_ai_bot')
    expect(open).toHaveBeenCalledWith('https://t.me/sahna_ai_bot', '_blank', 'noopener,noreferrer')
  })
})
