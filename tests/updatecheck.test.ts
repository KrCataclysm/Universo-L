import { describe, expect, it } from 'vitest'
import { isNewVersion, shouldReloadOnce } from '../src/lib/updateCheck'

describe('isNewVersion', () => {
  it('só considera nova quando o id remoto existe e é diferente', () => {
    expect(isNewVersion('abc', 'abc')).toBe(false)
    expect(isNewVersion('abc', 'def')).toBe(true)
    expect(isNewVersion('abc', undefined)).toBe(false)
    expect(isNewVersion('abc', '')).toBe(false)
    expect(isNewVersion('abc', 42)).toBe(false)
  })
})

describe('shouldReloadOnce', () => {
  const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { m.set(k, v) } } }
  it('permite uma vez e bloqueia repetição em 60 s', () => {
    const s = mem()
    expect(shouldReloadOnce(s, 1_000_000)).toBe(true)
    expect(shouldReloadOnce(s, 1_030_000)).toBe(false)
    expect(shouldReloadOnce(s, 1_061_000)).toBe(true)
  })
  it('sem storage disponível, não recarrega (evita laço)', () => {
    expect(shouldReloadOnce({ getItem: () => { throw new Error('x') }, setItem: () => {} })).toBe(false)
  })
})
