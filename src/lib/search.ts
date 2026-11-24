import { getBrand } from '../brand/brands'
import type { Product } from '../data/catalog'

const norm = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Busca no nome, descrição e marca; ignora acentos e maiúsculas; todas as palavras precisam aparecer. */
export function searchProducts(products: Product[], query: string): Product[] {
  const terms = norm(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return products
  return products.filter((p) => {
    const hay = norm(`${p.name} ${p.description} ${getBrand(p.brandSlug)?.name ?? ''}`)
    return terms.every((t) => hay.includes(t))
  })
}

/** Selos do cartão: no máximo 2; "Personalizável" vem do produto. */
export function badgesOf(p: Product): string[] {
  const out = (p.labels ?? []).filter((l) => l !== 'Personalizável')
  if (p.customizable) out.push('Personalizável')
  return out.slice(0, 2)
}
