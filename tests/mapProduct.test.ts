import { describe, expect, it } from 'vitest'
import { mapProduct, type ProductRow } from '../src/data/mapProduct'

const pub = (p: string) => `https://cdn.test/${p}`
const row = (over: Partial<ProductRow> = {}): ProductRow => ({
  id: 'p1', slug: 'peca', name: 'Peça de teste', description: 'd', price_cents: 1990, featured: false, customizable: false,
  customization_schema: [], is_example: false, status: 'published', brands: { slug: 'lay-store' }, categories: { slug: 'tops' },
  product_images: [], product_variants: [], ...over,
})

describe('mapProduct', () => {
  it('ordena fotos e variações pelo campo sort e monta a URL pública', () => {
    const p = mapProduct(row({
      product_images: [{ path: 'p1/b.webp', alt: 'B', sort: 2 }, { path: 'p1/a.webp', alt: 'A', sort: 1 }],
      product_variants: [
        { id: 'v2', label: 'Tamanho', option_type: 'size', value: 'M', in_stock: true, sort: 2 },
        { id: 'v1', label: 'Tamanho', option_type: 'size', value: 'P', in_stock: false, sort: 1 },
      ],
    }), pub)
    expect(p.images.map((i) => i.url)).toEqual(['https://cdn.test/p1/a.webp', 'https://cdn.test/p1/b.webp'])
    expect(p.variants.map((v) => [v.value, v.type, v.inStock])).toEqual([['P', 'size', false], ['M', 'size', true]])
  })
  it('traduz campos de personalização e descarta itens inválidos', () => {
    const p = mapProduct(row({
      customizable: true,
      customization_schema: [
        { key: 'nome', label: 'Nome', type: 'text', required: true },
        { key: 'cor', label: 'Cor', type: 'select', options: ['Lilás', 'Rosé'], required: false },
        { nope: true }, 'lixo', null,
      ],
    }), pub)
    expect(p.customizationFields).toEqual([
      { key: 'nome', label: 'Nome', type: 'text', required: true, options: undefined },
      { key: 'cor', label: 'Cor', type: 'select', required: false, options: ['Lilás', 'Rosé'] },
    ])
  })
  it('aceita marca/categoria como objeto ou lista e categoria nula', () => {
    expect(mapProduct(row({ brands: [{ slug: 'falou-bordei' }], categories: null }), pub)).toMatchObject({ brandSlug: 'falou-bordei', categorySlug: null })
  })
  it('exemplo sem foto ganha imagens geradas; produto real sem foto fica sem imagens', () => {
    expect(mapProduct(row({ is_example: true }), pub).images.length).toBe(3)
    expect(mapProduct(row({ is_example: false }), pub).images).toEqual([])
  })
  it('preço sempre inteiro e flags preservadas', () => {
    const p = mapProduct(row({ price_cents: 1234, featured: true }), pub)
    expect(p.priceCents).toBe(1234)
    expect(p.featured).toBe(true)
  })
})
