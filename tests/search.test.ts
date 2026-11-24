import { describe, expect, it } from 'vitest'
import { badgesOf, searchProducts } from '../src/lib/search'
import type { Product } from '../src/data/catalog'

const p = (o: Partial<Product>): Product => ({ id: 'x', brandSlug: 'lay-store', categorySlug: null, slug: 's', name: 'Peça', description: '', priceCents: 1000, images: [], variants: [], featured: false, customizable: false, customizationFields: [], ...o })
const list = [
  p({ id: '1', name: 'Bermuda ciclista', description: 'Tecido de alta compressão' }),
  p({ id: '2', name: 'Sutiã coringa', brandSlug: 'ousada-delicada', description: 'Alças removíveis' }),
  p({ id: '3', name: 'Fotografia bordada à mão', brandSlug: 'falou-bordei', customizable: true }),
]

describe('searchProducts', () => {
  it('ignora acentos e maiúsculas e exige todas as palavras', () => {
    expect(searchProducts(list, 'SUTIA').map((x) => x.id)).toEqual(['2'])
    expect(searchProducts(list, 'bordada mao').map((x) => x.id)).toEqual(['3'])
    expect(searchProducts(list, 'bermuda ciclista').map((x) => x.id)).toEqual(['1'])
    expect(searchProducts(list, 'bermuda sutia')).toEqual([])
  })
  it('procura também na descrição e no nome da marca', () => {
    expect(searchProducts(list, 'compressao').map((x) => x.id)).toEqual(['1'])
    expect(searchProducts(list, 'ousada').map((x) => x.id)).toEqual(['2'])
  })
  it('busca vazia devolve tudo; sem resultado devolve vazio', () => {
    expect(searchProducts(list, '  ')).toHaveLength(3)
    expect(searchProducts(list, 'xyzzy')).toEqual([])
  })
})

describe('badgesOf', () => {
  it('mostra no máximo 2 selos; "Personalizável" vem do produto; sem repetir', () => {
    expect(badgesOf(p({ labels: ['Novidade'] }))).toEqual(['Novidade'])
    expect(badgesOf(p({ customizable: true, labels: ['Sob encomenda'] }))).toEqual(['Sob encomenda', 'Personalizável'])
    expect(badgesOf(p({ customizable: true, labels: ['Personalizável', 'Novidade', 'Pronta entrega'] }))).toEqual(['Novidade', 'Pronta entrega'])
    expect(badgesOf(p({}))).toEqual([])
  })
})
