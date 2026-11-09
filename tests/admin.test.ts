import { describe, expect, it } from 'vitest'
import { normalizeInstagram, normalizeWhatsApp } from '../src/admin/validators'
import { slugify, uniqueSlug } from '../src/admin/slug'
import { fitWithin, ImageRejected, validateImageFile } from '../src/admin/imageUpload'

describe('normalizeWhatsApp', () => {
  it('normaliza para dígitos com DDI 55', () => {
    expect(normalizeWhatsApp('(11) 99999-9999')).toBe('5511999999999')
    expect(normalizeWhatsApp('+55 11 99999-9999')).toBe('5511999999999')
    expect(normalizeWhatsApp('11 3333-4444')).toBe('551133334444')
  })
  it('rejeita lixo, curto e vazio', () => {
    for (const v of ['abc', '123', '', '   ', '99999-999']) expect(normalizeWhatsApp(v)).toBeNull()
  })
})

describe('normalizeInstagram', () => {
  it('aceita @, link e usuário', () => {
    expect(normalizeInstagram('@lay.store')).toBe('https://instagram.com/lay.store')
    expect(normalizeInstagram('https://instagram.com/lay.store/')).toBe('https://instagram.com/lay.store')
    expect(normalizeInstagram('instagram.com/x_y')).toBe('https://instagram.com/x_y')
  })
  it('vazio significa remover; esquemas perigosos são rejeitados', () => {
    expect(normalizeInstagram('  ')).toBe('')
    expect(normalizeInstagram('javascript:alert(1)')).toBeNull()
    expect(normalizeInstagram('https://evil.com/lay')).toBeNull()
  })
})

describe('slug', () => {
  it('remove acentos e símbolos', () => {
    expect(slugify('Legging Cintura Alta!')).toBe('legging-cintura-alta')
    expect(slugify('Toalha Bordada Ação')).toBe('toalha-bordada-acao')
    expect(slugify('  ')).toBe('produto')
  })
  it('evita colisão com sufixo numérico', () => {
    expect(uniqueSlug('a', new Set(['a', 'a-2']))).toBe('a-3')
    expect(uniqueSlug('b', new Set())).toBe('b')
  })
})

describe('imagem', () => {
  it('fitWithin reduz mantendo proporção e nunca amplia', () => {
    expect(fitWithin(4000, 3000, 1600)).toEqual({ w: 1600, h: 1200 })
    expect(fitWithin(3000, 4000, 1600)).toEqual({ w: 1200, h: 1600 })
    expect(fitWithin(800, 600, 1600)).toEqual({ w: 800, h: 600 })
  })
  it('recusa não-imagem e arquivo acima de 15 MB', () => {
    expect(() => validateImageFile({ type: 'text/plain', size: 10 })).toThrow(ImageRejected)
    expect(() => validateImageFile({ type: 'image/jpeg', size: 16 * 1024 * 1024 })).toThrow(ImageRejected)
    expect(() => validateImageFile({ type: 'image/jpeg', size: 1024 * 1024 })).not.toThrow()
  })
})
