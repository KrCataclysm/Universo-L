import { publicImageUrl } from '../lib/env'
import { getSupabase } from '../lib/supabase'
import type { Catalog, Category, Product, ProductQuery } from './catalog'
import { mapProduct, type ProductRow } from './mapProduct'
import { usePreview } from './previewStore'

const COLS = 'id,slug,name,description,price_cents,featured,customizable,customization_schema,is_example,status,brands!inner(slug),product_images(path,alt,sort),product_variants(id,label,option_type,value,in_stock,sort)'

export function createSupabaseCatalog(): Catalog {
  const sb = getSupabase()
  const map = (r: unknown) => mapProduct(r as ProductRow, publicImageUrl)
  return {
    async listProducts(q: ProductQuery): Promise<Product[]> {
      let req = sb.from('products').select(`${COLS},categories${q.categorySlug ? '!inner' : ''}(slug)`)
      if (!usePreview.getState().enabled) req = req.eq('status', 'published')
      if (q.brandSlug) req = req.eq('brands.slug', q.brandSlug)
      if (q.categorySlug) req = req.eq('categories.slug', q.categorySlug)
      if (q.featured !== undefined) req = req.eq('featured', q.featured)
      const { data, error } = await req.order('sort').order('created_at')
      if (error) throw error
      return (data ?? []).map(map)
    },
    async getProduct(brandSlug, slug) {
      let req = sb.from('products').select(`${COLS},categories(slug)`).eq('slug', slug).eq('brands.slug', brandSlug)
      if (!usePreview.getState().enabled) req = req.eq('status', 'published')
      const { data, error } = await req.maybeSingle()
      if (error) throw error
      return data ? map(data) : null
    },
    async listCategories(brandSlug): Promise<Category[]> {
      const { data, error } = await sb.from('categories').select('slug,name,brands!inner(slug)').eq('brands.slug', brandSlug).order('sort')
      if (error) throw error
      return (data ?? []).map((c) => ({ slug: c.slug as string, name: c.name as string }))
    },
    async getSettings() {
      const { data, error } = await sb.from('settings').select('key,value')
      if (error) throw error
      return Object.fromEntries((data ?? []).map((s) => [s.key as string, s.value as string]))
    },
  }
}
