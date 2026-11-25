import type { Product } from '../data/catalog'

export type SortKey = 'padrao' | 'menor' | 'maior' | 'az'
export type Band = 'todos' | 'ate50' | 'de50a100' | 'acima100' | 'consulta'
export interface Tools { sort: SortKey; band: Band }
export const DEFAULT_TOOLS: Tools = { sort: 'padrao', band: 'todos' }

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'padrao', label: 'Ordem da loja' }, { key: 'menor', label: 'Menor preço' }, { key: 'maior', label: 'Maior preço' }, { key: 'az', label: 'Nome (A–Z)' },
]
export const BANDS: { key: Exclude<Band, 'todos'>; label: string }[] = [
  { key: 'ate50', label: 'Até R$ 50' }, { key: 'de50a100', label: 'R$ 50 a R$ 100' }, { key: 'acima100', label: 'Acima de R$ 100' }, { key: 'consulta', label: 'Sob consulta' },
]

export const bandOf = (p: Product): Exclude<Band, 'todos'> =>
  p.priceCents === 0 ? 'consulta' : p.priceCents <= 5000 ? 'ate50' : p.priceCents <= 10000 ? 'de50a100' : 'acima100'

/** filtra por faixa de preço e ordena; "sob consulta" vai sempre para o fim nas ordens por preço */
export function applyTools(list: Product[], t: Tools): Product[] {
  const out = t.band === 'todos' ? [...list] : list.filter((p) => bandOf(p) === t.band)
  if (t.sort === 'az') return out.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  if (t.sort === 'menor' || t.sort === 'maior') {
    const dir = t.sort === 'menor' ? 1 : -1
    return out.sort((a, b) => (a.priceCents === 0 ? 1 : b.priceCents === 0 ? -1 : (a.priceCents - b.priceCents) * dir))
  }
  return out
}

export const bandCounts = (list: Product[]): Record<Exclude<Band, 'todos'>, number> => {
  const c = { ate50: 0, de50a100: 0, acima100: 0, consulta: 0 }
  for (const p of list) c[bandOf(p)]++
  return c
}
