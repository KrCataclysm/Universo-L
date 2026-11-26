import { getSupabase } from '../lib/supabase'
import { compressImage } from './imageUpload'
import { slugify, uniqueSlug } from './slug'

export type Status = 'draft' | 'published' | 'hidden'
export interface Brand { id: string; slug: string; name: string }
export interface Cat { id: string; brand_id: string; slug: string; name: string; sort: number }
export interface FieldDef { key: string; label: string; type: 'text' | 'select'; options?: string[]; required: boolean }
export interface VariantRow { id?: string; label: string; option_type: 'size' | 'color' | 'other'; value: string; in_stock: boolean; /** unidades; null/ausente = sem controle de quantidade */ stock?: number | null }
export interface ImageRow { id: string; path: string; alt: string; sort: number }
export interface AdminProduct {
  id: string; brand_id: string; category_id: string | null; slug: string; name: string; description: string; price_cents: number
  status: Status; featured: boolean; sold_out: boolean; labels: string[]; customizable: boolean; customization_schema: FieldDef[]; is_example: boolean
  product_images: ImageRow[]; product_variants: (VariantRow & { sort: number })[]; brands?: { name: string } | null
}

const sb = () => getSupabase()
const ok = <T,>(r: { data: T; error: { message: string } | null }): T => { if (r.error) throw new Error(r.error.message); return r.data }

export const listBrands = async (): Promise<Brand[]> => (ok(await sb().from('brands').select('id,slug,name').order('sort')) ?? [])
export const listCats = async (): Promise<Cat[]> => (ok(await sb().from('categories').select('id,brand_id,slug,name,sort').order('sort')) ?? [])

export const listProducts = async (): Promise<AdminProduct[]> =>
  ok(await sb().from('products').select('*, brands(name), product_images(id,path,alt,sort), product_variants(id,label,option_type,value,in_stock,stock,sort)').order('created_at', { ascending: false })) as unknown as AdminProduct[]

export const getProduct = async (id: string): Promise<AdminProduct | null> =>
  ok(await sb().from('products').select('*, product_images(id,path,alt,sort), product_variants(id,label,option_type,value,in_stock,stock,sort)').eq('id', id).maybeSingle()) as unknown as AdminProduct | null

/** Cria um rascunho vazio e devolve o id (o editor trabalha sempre sobre um produto existente). */
export async function createDraft(brandId: string): Promise<string> {
  const taken = new Set((ok(await sb().from('products').select('slug').eq('brand_id', brandId)) as { slug: string }[]).map((r) => r.slug))
  const row = ok(await sb().from('products').insert({ brand_id: brandId, slug: uniqueSlug('novo-produto', taken), name: 'Novo produto', price_cents: 0, status: 'draft' }).select('id').single()) as { id: string }
  return row.id
}

export interface SaveInput {
  id: string; brandId: string; categoryId: string | null; name: string; description: string; priceCents: number
  status: Status; featured: boolean; soldOut: boolean; labels: string[]; customizable: boolean; fields: FieldDef[]; variants: VariantRow[]
}

export async function saveProduct(i: SaveInput, current: { slug: string; name: string; brand_id: string }): Promise<string> {
  let slug = current.slug
  if (i.name !== current.name || i.brandId !== current.brand_id) {
    const taken = new Set((ok(await sb().from('products').select('slug').eq('brand_id', i.brandId).neq('id', i.id)) as { slug: string }[]).map((r) => r.slug))
    slug = uniqueSlug(slugify(i.name), taken)
  }
  ok(await sb().from('products').update({
    brand_id: i.brandId, category_id: i.categoryId, slug, name: i.name, description: i.description, price_cents: i.priceCents,
    status: i.status, featured: i.featured, sold_out: i.soldOut, labels: i.labels, customizable: i.customizable, customization_schema: i.customizable ? i.fields : [],
  }).eq('id', i.id))
  ok(await sb().from('product_variants').delete().eq('product_id', i.id))
  if (i.variants.length) ok(await sb().from('product_variants').insert(i.variants.map((v, n) => ({ product_id: i.id, label: v.label, option_type: v.option_type, value: v.value, in_stock: v.stock == null ? v.in_stock : v.stock > 0, stock: v.stock ?? null, sort: n }))))
  return slug
}

export async function deleteProduct(id: string): Promise<void> {
  const imgs = ok(await sb().from('product_images').select('path').eq('product_id', id)) as { path: string }[]
  const stored = imgs.filter((x) => !x.path.startsWith('/')) // fotos do próprio site (/produtos/...) não estão no storage
  if (stored.length) await sb().storage.from('product-images').remove(stored.map((x) => x.path))
  ok(await sb().from('products').delete().eq('id', id))
}

export const quickUpdate = async (id: string, patch: Partial<{ status: Status; featured: boolean }>): Promise<void> => { ok(await sb().from('products').update(patch).eq('id', id)) }

export async function addImage(productId: string, file: File, alt: string, sort: number): Promise<ImageRow> {
  const blob = await compressImage(file)
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `${productId}/${crypto.randomUUID()}.${ext}`
  const up = await sb().storage.from('product-images').upload(path, blob, { contentType: blob.type, upsert: false })
  if (up.error) throw new Error(up.error.message)
  return ok(await sb().from('product_images').insert({ product_id: productId, path, alt, sort }).select('id,path,alt,sort').single()) as ImageRow
}

export async function removeImage(img: ImageRow): Promise<void> {
  if (!img.path.startsWith('/')) await sb().storage.from('product-images').remove([img.path])
  ok(await sb().from('product_images').delete().eq('id', img.id))
}

export async function reorderImages(imgs: ImageRow[]): Promise<void> {
  await Promise.all(imgs.map((im, n) => sb().from('product_images').update({ sort: n }).eq('id', im.id)))
}

export async function removeExamples(): Promise<number> {
  const ex = ok(await sb().from('products').select('id').eq('is_example', true)) as { id: string }[]
  for (const p of ex) await deleteProduct(p.id)
  return ex.length
}

export const addCategory = async (brandId: string, name: string): Promise<void> => {
  const taken = new Set((ok(await sb().from('categories').select('slug').eq('brand_id', brandId)) as { slug: string }[]).map((r) => r.slug))
  ok(await sb().from('categories').insert({ brand_id: brandId, name, slug: uniqueSlug(slugify(name), taken) }))
}
export const renameCategory = async (id: string, name: string): Promise<void> => { ok(await sb().from('categories').update({ name }).eq('id', id)) }
export const deleteCategory = async (id: string): Promise<void> => { ok(await sb().from('categories').delete().eq('id', id)) }

export const loadSettings = async (): Promise<Record<string, string>> =>
  Object.fromEntries((ok(await sb().from('settings').select('key,value')) as { key: string; value: string }[]).map((s) => [s.key, s.value]))
export async function saveSetting(key: string, value: string): Promise<void> {
  if (!value) ok(await sb().from('settings').delete().eq('key', key))
  else ok(await sb().from('settings').upsert({ key, value }))
}

export interface BannerRow { id: string; title: string; subtitle: string | null; cta_label: string | null; link_url: string | null; image_path: string | null; active: boolean; sort: number }
export const listBannersAdmin = async (): Promise<BannerRow[]> => (ok(await sb().from('banners').select('*').order('sort').order('created_at', { ascending: false })) ?? []) as BannerRow[]
export async function saveBanner(b: Partial<BannerRow> & { title: string }): Promise<void> {
  const row = { title: b.title, subtitle: b.subtitle || null, cta_label: b.cta_label || null, link_url: b.link_url || null, image_path: b.image_path ?? null, active: b.active ?? true, sort: b.sort ?? 0 }
  if (b.id) ok(await sb().from('banners').update(row).eq('id', b.id))
  else ok(await sb().from('banners').insert(row))
}
export const deleteBanner = async (b: BannerRow): Promise<void> => {
  if (b.image_path && !b.image_path.startsWith('/')) await sb().storage.from('product-images').remove([b.image_path])
  ok(await sb().from('banners').delete().eq('id', b.id))
}
export async function uploadBannerImage(file: File): Promise<string> {
  const blob = await compressImage(file, { maxSide: 1800 })
  const path = `banners/${crypto.randomUUID()}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`
  const up = await sb().storage.from('product-images').upload(path, blob, { contentType: blob.type })
  if (up.error) throw new Error(up.error.message)
  return path
}

// ---------- coleções ----------
export interface CollectionRow { id: string; slug: string; name: string; description: string; active: boolean; sort: number; product_ids: string[] }
export async function listCollectionsAdmin(): Promise<CollectionRow[]> {
  const rows = ok(await sb().from('collections').select('id,slug,name,description,active,sort,collection_products(product_id,sort)').order('sort').order('created_at', { ascending: false })) as unknown as (Omit<CollectionRow, 'product_ids'> & { collection_products: { product_id: string; sort: number }[] })[]
  return (rows ?? []).map((c) => ({ id: c.id, slug: c.slug, name: c.name, description: c.description, active: c.active, sort: c.sort, product_ids: [...c.collection_products].sort((a, b) => a.sort - b.sort).map((x) => x.product_id) }))
}
export async function saveCollection(c: { id?: string; name: string; description: string; active: boolean; productIds: string[] }): Promise<void> {
  let id = c.id
  if (id) {
    ok(await sb().from('collections').update({ name: c.name, description: c.description, active: c.active }).eq('id', id))
  } else {
    const taken = new Set((ok(await sb().from('collections').select('slug')) as { slug: string }[]).map((r) => r.slug))
    const row = ok(await sb().from('collections').insert({ slug: uniqueSlug(slugify(c.name), taken), name: c.name, description: c.description, active: c.active }).select('id').single()) as { id: string }
    id = row.id
  }
  ok(await sb().from('collection_products').delete().eq('collection_id', id))
  if (c.productIds.length) ok(await sb().from('collection_products').insert(c.productIds.map((product_id, sort) => ({ collection_id: id, product_id, sort }))))
}
export const deleteCollection = async (id: string): Promise<void> => { ok(await sb().from('collections').delete().eq('id', id)) }

// ---------- trabalhos realizados ----------
export interface WorkRow { id: string; brand_id: string; title: string; description: string; image_path: string; active: boolean; sort: number }
export async function listWorksAdmin(): Promise<WorkRow[]> {
  return (ok(await sb().from('works').select('id,brand_id,title,description,image_path,active,sort').order('sort').order('created_at', { ascending: false })) ?? []) as WorkRow[]
}
export async function addWork(brandId: string, file: File, title: string, sort: number): Promise<void> {
  const blob = await compressImage(file, { maxSide: 1600 })
  const path = `works/${crypto.randomUUID()}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`
  const up = await sb().storage.from('product-images').upload(path, blob, { contentType: blob.type })
  if (up.error) throw new Error(up.error.message)
  try { ok(await sb().from('works').insert({ brand_id: brandId, title, description: '', image_path: path, active: true, sort })) }
  catch (e) { await sb().storage.from('product-images').remove([path]); throw e }
}
export const updateWork = async (id: string, patch: Partial<Pick<WorkRow, 'title' | 'description' | 'active' | 'sort'>>): Promise<void> => { ok(await sb().from('works').update(patch).eq('id', id)) }
export async function deleteWork(w: WorkRow): Promise<void> {
  ok(await sb().from('works').delete().eq('id', w.id))
  if (!w.image_path.startsWith('/')) await sb().storage.from('product-images').remove([w.image_path])
}
