import { afterEach, describe, expect, it, vi } from 'vitest'
import { isLowPower, prefersReducedMotion } from '../src/fx/motion'

function mockMedia(matches: Record<string, boolean>) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: !!matches[q], media: q, addEventListener() {}, removeEventListener() {} }))
}

afterEach(() => vi.unstubAllGlobals())

describe('motion utils', () => {
  it('reduced motion true quando o sistema pede', () => {
    mockMedia({ '(prefers-reduced-motion: reduce)': true })
    expect(prefersReducedMotion()).toBe(true)
  })
  it('reduced motion false por padrão', () => {
    mockMedia({})
    expect(prefersReducedMotion()).toBe(false)
  })
  it('low power quando o ponteiro é touch', () => {
    mockMedia({ '(pointer: coarse)': true })
    expect(isLowPower()).toBe(true)
  })
  it('sem matchMedia não quebra', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(prefersReducedMotion()).toBe(false)
  })
})
