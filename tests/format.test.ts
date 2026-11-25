import { describe, expect, it } from 'vitest'
import { formatPhone, igHandle } from '../src/lib/format'

describe('formatPhone', () => {
  it('celular de 8 dígitos (12 no total) e de 9 dígitos (13 no total)', () => {
    expect(formatPhone('5586999463019')).toBe('+55 (86) 99946-3019')
    expect(formatPhone('558699463019')).toBe('+55 (86) 9946-3019')
    expect(formatPhone('5511999999999')).toBe('+55 (11) 99999-9999')
  })
  it('número desconhecido volta como veio (só dígitos) e vazio vira vazio', () => {
    expect(formatPhone('123')).toBe('123')
    expect(formatPhone('')).toBe('')
  })
})

describe('igHandle', () => {
  it('extrai @usuario do link do Instagram', () => {
    expect(igHandle('https://instagram.com/lay.store')).toBe('@lay.store')
    expect(igHandle('https://www.instagram.com/lojaousadadelicada/')).toBe('@lojaousadadelicada')
  })
  it('link estranho devolve vazio', () => {
    expect(igHandle('https://outro.com/x')).toBe('')
    expect(igHandle(undefined)).toBe('')
  })
})
