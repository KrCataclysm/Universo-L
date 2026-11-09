import { getSupabase } from '../lib/supabase'
import { compressImage } from './imageUpload'
import { slugify, uniqueSlug } from './slug'

export type Status = 'draft' | 'published' | 'hidden'
export interface Brand { id: string; slug: string; name: string }
export interface Cat { id: string; brand_id: string; slug: string; name: string; sort: number }
export interface FieldDef { key: string; label: string; type: 'text' | 'select'; options?: string[]; required: boolean }
export interface VariantRow { id?: string; label: string; option_type: 'size' | 'color' | 'other'; value: string; in_stock: boolean }
export interface ImageRow { id: string; path: string; alt: string; sort: number }
export interface AdminProduct {
  id: string; brand_id: string; category_id: string | null; slug: string; name: string; description: string; price_cents: number
  status: Status; featured: boolean; customizable: boolean; customization_schema: FieldDef[]; is_example: boolean
  product_images: ImageRow[]; product_variants: (VariantRow & { sort: number })[]; brands?: { name: string } | null
}

const sb = () => getSupabase()
const ok = <T,>(r: { data: T; error: { message: string } | null }): T => { if (r.error) throw new Error(r.error.message); return r.data }

export const listBrands = async (): Promise<Brand[]> => (ok(await sb().from('brands').select('id,slug,name').order('sort')) ?? [])
export const listCats = async (): Promise<Cat[]> => (ok(await sb().from('categories').select('id,brand_id,slug,name,sort').order('sort')) ?? [])

export const listProducts = async (): Promise<AdminProduct[]> =>
  ok(await sb().from('products').select('*, brands(name), product_images(id,path,alt,sort), product_variants(id,label,option_type,value,in_stock,sort)').order('created_at', { ascending: false })) as unknown as AdminProduct[]

export const getProduct = async (id: string): Promise<AdminProduct | null> =>
  ok(await sb().from('products').select('*, product_images(id,path,alt,sort), product_variants(id,label,option_type,value,in_stock,sort)').eq('id', id).maybeSingle()) as unknown as AdminProduct | null

/** Cria um rascunho vazio e devolve o id (o editor trabalha sempre sobre um produto existente). */
export async function createDraft(brandId: string): Promise<string> {
  const taken = new Set((ok(await sb().from('products').select('slug').eq('brand_id', brandId)) as { slug: string }[]).map((r) => r.slug))
  const row = ok(await sb().from('products').insert({ brand_id: brandId, slug: uniqueSlug('novo-produto', taken), name: 'Novo produto', price_cents: 0, status: 'draft' }).select('id').single()) as { id: string }
  return row.id
}

export interface SaveInput {
  id: string; brandId: string; categoryId: string | null; name: string; description: string; priceCents: number
  status: Status; featured: boolean; customizable: boolean; fields: FieldDef[]; variants: VariantRow[]
}

export async function saveProduct(i: SaveInput, current: { slug: string; name: string; brand_id: string }): Promise<string> {
  let slug = current.slug
  if (i.name !== current.name || i.brandId !== current.brand_id) {
    const taken = new Set((ok(await sb().from('products').select('slug').eq('brand_id', i.brandId).neq('id', i.id)) as { slug: string }[]).map((r) => r.slug))
    slug = uniqueSlug(slugify(i.name), taken)
  }
  ok(await sb().from('products').update({
    brand_id: i.brandId, category_id: i.categoryId, slug, name: i.name, description: i.description, price_cents: i.priceCents,
    status: i.status, featured: i.featured, customizable: i.customizable, customization_schema: i.customizable ? i.fields : [],
  }).eq('id', i.id))
  ok(await sb().from('product_variants').delete().eq('product_id', i.id))
  if (i.variants.length) ok(await sb().from('product_variants').insert(i.variants.map((v, n) => ({ product_id: i.id, label: v.label, option_type: v.option_type, value: v.value, in_stock: v.in_stock, sort: n }))))
  return slug
}

export async function deleteProduct(id: string): Promise<void> {
  const imgs = ok(await sb().from('product_images').select('path').eq('product_id', id)) as { path: string }[]
  if (imgs.length) await sb().storage.from('product-images').remove(imgs.map((x) => x.path))
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
  await sb().storage.from('product-images').remove([img.path])
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
