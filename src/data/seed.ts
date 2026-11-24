import { publicImageUrl } from '../lib/env'
import type { Product } from './catalog'
import { mapProduct, type ProductRow } from './mapProduct'

/** Produto embutido no HTML estático pelo build (vale só para o carregamento inicial daquela página). */
export function seedProduct(brandSlug: string, slug: string): Product | null {
  try {
    if (typeof document === 'undefined') return null
    const raw = document.getElementById('__seed')?.textContent
    if (!raw) return null
    const row = JSON.parse(raw) as ProductRow
    const b = Array.isArray(row.brands) ? row.brands[0] : row.brands
    if (row.slug !== slug || b?.slug !== brandSlug) return null
    return mapProduct(row, publicImageUrl)
  } catch { return null }
}
