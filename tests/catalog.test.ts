import { describe, expect, it } from 'vitest'
import { emptyCatalog } from '../src/data/emptyCatalog'
import { exampleCatalog } from '../src/data/exampleCatalog'
import { BRANDS } from '../src/brand/brands'

describe('emptyCatalog', () => {
  it('não devolve nada', async () => {
    expect(await emptyCatalog.listProducts({})).toEqual([])
    expect(await emptyCatalog.getProduct('lay-store', 'x')).toBeNull()
    expect(await emptyCatalog.getSettings()).toEqual({})
  })
})

describe('exampleCatalog', () => {
  it('todo item é marcado como exemplo, com preço inteiro e marca válida', async () => {
    const all = await exampleCatalog.listProducts({})
    expect(all.length).toBeGreaterThanOrEqual(9)
    for (const p of all) {
      expect(p.isExample).toBe(true)
      expect(p.name.toLowerCase()).toContain('exemplo')
      expect(Number.isInteger(p.priceCents)).toBe(true)
      expect(BRANDS.map((b) => b.slug)).toContain(p.brandSlug)
    }
  })
  it('as 3 marcas têm exemplos e slugs são únicos por marca', async () => {
    const all = await exampleCatalog.listProducts({})
    for (const b of BRANDS) expect(all.some((p) => p.brandSlug === b.slug)).toBe(true)
    const keys = all.map((p) => `${p.brandSlug}/${p.slug}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('filtra por marca, categoria e destaque', async () => {
    const lay = await exampleCatalog.listProducts({ brandSlug: 'lay-store' })
    expect(lay.every((p) => p.brandSlug === 'lay-store')).toBe(true)
    const feat = await exampleCatalog.listProducts({ featured: true })
    expect(feat.length).toBeGreaterThan(0)
    expect(feat.every((p) => p.featured)).toBe(true)
    const cat = (await exampleCatalog.listCategories('lay-store'))[0]
    const inCat = await exampleCatalog.listProducts({ brandSlug: 'lay-store', categorySlug: cat.slug })
    expect(inCat.every((p) => p.categorySlug === cat.slug)).toBe(true)
  })
  it('getProduct acha por marca+slug e devolve null se a marca não confere', async () => {
    const [p] = await exampleCatalog.listProducts({ brandSlug: 'falou-bordei' })
    expect((await exampleCatalog.getProduct('falou-bordei', p.slug))?.id).toBe(p.id)
    expect(await exampleCatalog.getProduct('lay-store', p.slug)).toBeNull()
  })
  it('produtos do Falou, Bordei exigem personalização', async () => {
    const items = await exampleCatalog.listProducts({ brandSlug: 'falou-bordei' })
    expect(items.every((p) => p.customizable && p.customizationFields.some((f) => f.required))).toBe(true)
  })
})
