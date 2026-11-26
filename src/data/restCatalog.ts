import type { Banner, Catalog, Category, Collection, Product, ProductQuery, Work } from './catalog'
import { mapProduct, type ProductRow } from './mapProduct'
import { usePreview } from './previewStore'

const COLS = 'id,slug,name,description,price_cents,featured,customizable,sold_out,labels,customization_schema,is_example,status,brands!inner(slug),product_images(path,sort,alt),product_variants(id,label,option_type,value,in_stock,stock,sort)'

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
      order: 'sort.asc,created_at.asc,id.asc', // id como desempate: peças criadas juntas não trocam de lugar sozinhas
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
    async listBanners(): Promise<Banner[]> {
      const rows = await get<{ id: string; title: string; subtitle: string | null; cta_label: string | null; link_url: string | null; image_path: string | null }[]>('banners', { select: 'id,title,subtitle,cta_label,link_url,image_path', active: 'eq.true', order: 'sort.asc,created_at.desc' })
      return rows.map((b) => ({ id: b.id, title: b.title, subtitle: b.subtitle ?? '', ctaLabel: b.cta_label ?? '', linkUrl: b.link_url ?? '', imageUrl: b.image_path ? (b.image_path.startsWith('/') ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${b.image_path}` : publicUrl(b.image_path)) : null }))
    },
    async listProducts(q): Promise<Product[]> {
      return (await get<ProductRow[]>('products', productParams(q), usePreview.getState().enabled)).map(map)
    },
    async getProduct(brandSlug, slug) {
      const rows = await get<ProductRow[]>('products', { ...productParams({ brandSlug, slug }), limit: '1' }, usePreview.getState().enabled)
      return rows[0] ? map(rows[0]) : null
    },
    async listCollections(): Promise<Collection[]> {
      const rows = await get<{ id: string; slug: string; name: string; description: string; image_path: string | null; collection_products: { product_id: string }[] }[]>('collections', { select: 'id,slug,name,description,image_path,collection_products(product_id)', order: 'sort.asc,created_at.desc' })
      if (!rows.length) return []
      const pub = new Set((await get<{ id: string }[]>('products', { select: 'id', status: 'eq.published' })).map((x) => x.id))
      return rows.map((c) => ({ slug: c.slug, name: c.name, description: c.description, imageUrl: c.image_path ? (c.image_path.startsWith('/') ? c.image_path : publicUrl(c.image_path)) : null, count: c.collection_products.filter((cp) => pub.has(cp.product_id)).length })).filter((c) => c.count > 0)
    },
    async getCollection(slug) {
      const rows = await get<{ id: string; slug: string; name: string; description: string; image_path: string | null; collection_products: { product_id: string; sort: number }[] }[]>('collections', { select: 'id,slug,name,description,image_path,collection_products(product_id,sort)', slug: `eq.${slug}`, limit: '1' })
      const c = rows[0]
      if (!c) return null
      const ids = c.collection_products.sort((a, b) => a.sort - b.sort).map((x) => x.product_id)
      const prods = ids.length ? (await get<ProductRow[]>('products', { select: COLS, status: 'eq.published', id: `in.(${ids.join(',')})` })).map(map) : []
      const ordered = ids.map((id) => prods.find((p) => p.id === id)).filter((p): p is Product => !!p)
      if (!ordered.length) return null
      return { collection: { slug: c.slug, name: c.name, description: c.description, imageUrl: c.image_path ? (c.image_path.startsWith('/') ? c.image_path : publicUrl(c.image_path)) : null, count: ordered.length }, products: ordered }
    },
    async listWorks(brandSlug): Promise<Work[]> {
      const rows = await get<{ id: string; title: string; description: string; image_path: string; brands: { slug: string } | { slug: string }[] }[]>('works', { select: 'id,title,description,image_path,brands!inner(slug)', 'brands.slug': `eq.${brandSlug}`, active: 'eq.true', order: 'sort.asc,created_at.desc' })
      return rows.map((w) => ({ id: w.id, brandSlug, title: w.title, description: w.description, imageUrl: w.image_path.startsWith('/') ? w.image_path : publicUrl(w.image_path) }))
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
