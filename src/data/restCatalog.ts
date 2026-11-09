import type { Catalog, Category, Product, ProductQuery } from './catalog'
import { mapProduct, type ProductRow } from './mapProduct'
import { usePreview } from './previewStore'

const COLS = 'id,slug,name,description,price_cents,featured,customizable,customization_schema,is_example,status,brands!inner(slug),product_images(path,sort,alt),product_variants(id,label,option_type,value,in_stock,sort)'

/** Catálogo público via PostgREST com fetch (poucos bytes; o supabase-js fica só no painel). */
export function createRestCatalog(url: string, key: string): Catalog {
  const ref = new URL(url).hostname.split('.')[0]
  const publicUrl = (path: string) => `${url}/storage/v1/object/public/product-images/${path}`

  const token = (): string | null => {
    try { return (JSON.parse(localStorage.getItem(`sb-${ref}-auth-token`) ?? 'null') as { access_token?: string } | null)?.access_token ?? null } catch { return null }
  }
  const get = async <T,>(path: string, params: Record<string, string>, withAuth = false): Promise<T> => {
    const qs = new URLSearchParams(params).toString()
    const headers: Record<string, string> = { apikey: key }
    const jwt = withAuth ? token() : null
    if (jwt) headers.Authorization = `Bearer ${jwt}`
    const res = await fetch(`${url}/rest/v1/${path}?${qs}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as T
  }
  const productParams = (q: ProductQuery & { slug?: string }): Record<string, string> => {
    const p: Record<string, string> = {
      select: `${COLS},categories${q.categorySlug ? '!inner' : ''}(slug)`,
      order: 'sort.asc,created_at.asc',
    }
    if (!usePreview.getState().enabled) p.status = 'eq.published'
    if (q.brandSlug) p['brands.slug'] = `eq.${q.brandSlug}`
    if (q.categorySlug) p['categories.slug'] = `eq.${q.categorySlug}`
    if (q.featured !== undefined) p.featured = `eq.${q.featured}`
    if (q.slug) p.slug = `eq.${q.slug}`
    return p
  }
  const map = (r: ProductRow) => mapProduct(r, publicUrl)

  return {
    async listProducts(q): Promise<Product[]> {
      return (await get<ProductRow[]>('products', productParams(q), usePreview.getState().enabled)).map(map)
    },
    async getProduct(brandSlug, slug) {
      const rows = await get<ProductRow[]>('products', { ...productParams({ brandSlug, slug }), limit: '1' }, usePreview.getState().enabled)
      return rows[0] ? map(rows[0]) : null
    },
    async listCategories(brandSlug): Promise<Category[]> {
      const rows = await get<{ slug: string; name: string }[]>('categories', { select: 'slug,name,brands!inner(slug)', 'brands.slug': `eq.${brandSlug}`, order: 'sort.asc' })
      return rows.map((c) => ({ slug: c.slug, name: c.name }))
    },
    async getSettings() {
      const rows = await get<{ key: string; value: string }[]>('settings', { select: 'key,value' })
      return Object.fromEntries(rows.map((s) => [s.key, s.value]))
    },
  }
}
