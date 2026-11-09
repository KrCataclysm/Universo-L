import { describe, expect, it } from 'vitest'
import { BRANDS } from '../src/brand/brands'

describe('BRANDS', () => {
  it('tem as 3 marcas na ordem certa', () => {
    expect(BRANDS.map((b) => b.name)).toEqual(['Lay.Store', 'Ousada Delicada', 'Falou, Bordei'])
  })
  it('slugs são únicos', () => {
    expect(new Set(BRANDS.map((b) => b.slug)).size).toBe(3)
  })
  it('categorias exatas', () => {
    expect(BRANDS.map((b) => b.category)).toEqual(['Moda fitness', 'Moda íntima', 'Bordados e personalizados'])
  })
  it('cores-assinatura terminam no lilás da marca', () => {
    for (const b of BRANDS) expect(b.accentTo).toBe('#A38A9E')
  })
})
