import { describe, expect, it } from 'vitest'
import { isNewVersion } from '../src/lib/updateCheck'

describe('isNewVersion', () => {
  it('só considera nova quando o id remoto existe e é diferente', () => {
    expect(isNewVersion('abc', 'abc')).toBe(false)
    expect(isNewVersion('abc', 'def')).toBe(true)
    expect(isNewVersion('abc', undefined)).toBe(false)
    expect(isNewVersion('abc', '')).toBe(false)
    expect(isNewVersion('abc', 42)).toBe(false)
  })
})
