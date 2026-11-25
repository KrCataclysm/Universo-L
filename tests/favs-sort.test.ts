import { beforeEach, describe, expect, it } from 'vitest'
import type { Product } from '../src/data/catalog'
import { applyTools, bandCounts, bandOf } from '../src/lib/sort'
import { useFavs } from '../src/store/favStore'
import { getRecent, pushRecent } from '../src/store/recent'

const P = (id: string, name: string, priceCents: number): Product => ({ id, brandSlug: 'x', categorySlug: null, slug: id, name, description: '', priceCents, images: [], variants: [], featured: false, customizable: false, customizationFields: [] })
const list = [P('a', 'Zebra', 9000), P('b', 'Alfa', 0), P('c', 'Meio', 3000), P('d', 'Topo', 15000)]

describe('ordenar e filtrar', () => {
  it('menor e maior preço deixam "sob consulta" no fim', () => {
    expect(applyTools(list, { sort: 'menor', band: 'todos' }).map((p) => p.id)).toEqual(['c', 'a', 'd', 'b'])
    expect(applyTools(list, { sort: 'maior', band: 'todos' }).map((p) => p.id)).toEqual(['d', 'a', 'c', 'b'])
  })
  it('A–Z ordena por nome em português e padrão mantém a ordem', () => {
    expect(applyTools(list, { sort: 'az', band: 'todos' }).map((p) => p.name)).toEqual(['Alfa', 'Meio', 'Topo', 'Zebra'])
    expect(applyTools(list, { sort: 'padrao', band: 'todos' }).map((p) => p.id)).toEqual(['a', 'b', 'c', 'd'])
  })
  it('faixas de preço e contagem', () => {
    expect(['c', 'a', 'd', 'b'].map((id) => bandOf(list.find((p) => p.id === id)!))).toEqual(['ate50', 'de50a100', 'acima100', 'consulta'])
    expect(bandCounts(list)).toEqual({ ate50: 1, de50a100: 1, acima100: 1, consulta: 1 })
    expect(applyTools(list, { sort: 'padrao', band: 'consulta' }).map((p) => p.id)).toEqual(['b'])
  })
})

describe('favoritos e vistos', () => {
  beforeEach(() => { localStorage.clear(); useFavs.setState({ ids: [] }) })
  it('alterna, persiste e limpa', () => {
    expect(useFavs.getState().toggle('a')).toBe(true)
    expect(useFavs.getState().toggle('b')).toBe(true)
    expect(JSON.parse(localStorage.getItem('ul-favs')!)).toEqual(['a', 'b'])
    expect(useFavs.getState().toggle('a')).toBe(false)
    useFavs.getState().clear(); expect(useFavs.getState().ids).toEqual([])
  })
  it('vistos: mais novo primeiro, sem repetir, máx. 8', () => {
    for (let i = 1; i <= 10; i++) pushRecent(String(i))
    pushRecent('5')
    const r = getRecent()
    expect(r[0]).toBe('5'); expect(r).toHaveLength(8); expect(new Set(r).size).toBe(8)
  })
})
