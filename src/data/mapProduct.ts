import { art } from './exampleCatalog'
import type { CustomField, Product } from './catalog'

type One<T> = T | T[] | null

export interface ProductRow {
  id: string
  slug: string
  name: string
  description: string
  price_cents: number
  featured: boolean
  customizable: boolean
  customization_schema: unknown
  is_example: boolean
  status: string
  brands: One<{ slug: string }>
  categories: One<{ slug: string }>
  product_images: { path: string; alt: string; sort: number }[] | null
  product_variants: { id: string; label: string; option_type: string; value: string; in_stock: boolean; sort: number }[] | null
}

const first = <T,>(v: One<T>): T | null => (Array.isArray(v) ? (v[0] ?? null) : v)

function toField(x: unknown): CustomField | null {
  if (!x || typeof x !== 'object') return null
  const f = x as Record<string, unknown>
  if (typeof f.key !== 'string' || typeof f.label !== 'string') return null
  const type = f.type === 'select' ? 'select' : 'text'
  return { key: f.key, label: f.label, type, required: f.required === true, options: Array.isArray(f.options) ? f.options.filter((o): o is string => typeof o === 'string') : undefined }
}

const variantType = (t: string): 'size' | 'color' | 'other' => (t === 'size' || t === 'color' ? t : 'other')

export function mapProduct(r: ProductRow, publicUrl: (path: string) => string): Product {
  const brandSlug = first(r.brands)?.slug ?? ''
  const images = [...(r.product_images ?? [])].sort((a, b) => a.sort - b.sort).map((i) => ({ url: publicUrl(i.path), alt: i.alt || r.name }))
  return {
    id: r.id,
    brandSlug,
    categorySlug: first(r.categories)?.slug ?? null,
    slug: r.slug,
    name: r.name,
    description: r.description,
    priceCents: r.price_cents,
    images: images.length || !r.is_example ? images : [1, 2, 3].map((n) => ({ url: art(brandSlug, `${r.name} ${n}`), alt: `${r.name}, foto ${n}` })),
    variants: [...(r.product_variants ?? [])].sort((a, b) => a.sort - b.sort).map((v) => ({ id: v.id, label: v.label, type: variantType(v.option_type), value: v.value, inStock: v.in_stock })),
    featured: r.featured,
    customizable: r.customizable,
    customizationFields: Array.isArray(r.customization_schema) ? r.customization_schema.map(toField).filter((f): f is CustomField => !!f) : [],
    isExample: r.is_example,
    status: r.status,
  }
}
