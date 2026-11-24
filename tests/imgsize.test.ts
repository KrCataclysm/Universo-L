import { describe, expect, it } from 'vitest'
import { imgSize, imgSrcSet } from '../src/lib/env'

describe('variantes de foto do próprio site', () => {
  it('imgSize troca para a versão 480 ou 800 (só em /produtos/*.webp)', () => {
    expect(imgSize('/Universo-L/produtos/bermuda-ciclista.webp', 480)).toBe('/Universo-L/produtos/bermuda-ciclista-480.webp')
    expect(imgSize('/produtos/short-duplo.webp', 800)).toBe('/produtos/short-duplo-800.webp')
  })
  it('foto do storage, data URI ou já dimensionada não muda', () => {
    expect(imgSize('https://x.supabase.co/storage/v1/object/public/product-images/a/b.webp', 480)).toContain('/a/b.webp')
    expect(imgSize('data:image/svg+xml;utf8,abc', 480)).toBe('data:image/svg+xml;utf8,abc')
    expect(imgSize('/produtos/x-480.webp', 800)).toBe('/produtos/x-480.webp')
  })
  it('imgSrcSet monta 480w/800w/1280w só para foto do site', () => {
    expect(imgSrcSet('/produtos/a.webp')).toBe('/produtos/a-480.webp 480w, /produtos/a-800.webp 800w, /produtos/a.webp 1280w')
    expect(imgSrcSet('https://x.test/a.webp')).toBeUndefined()
  })
})
