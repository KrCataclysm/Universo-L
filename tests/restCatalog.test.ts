import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRestCatalog } from '../src/data/restCatalog'
import { usePreview } from '../src/data/previewStore'

const URL_ = 'https://proj.supabase.co'
const row = { id: 'p1', slug: 's', name: 'Peça de teste', description: 'd', price_cents: 1990, featured: true, customizable: false, customization_schema: [], is_example: false, status: 'published', brands: { slug: 'lay-store' }, categories: { slug: 'tops' }, product_images: [], product_variants: [] }

let calls: { url: string; headers: Record<string, string> }[] = []
const mockFetch = (body: unknown, ok = true) => vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
  calls.push({ url, headers: (init?.headers ?? {}) as Record<string, string> })
  return { ok, status: ok ? 200 : 500, json: async () => body }
}))

beforeEach(() => { calls = []; localStorage.clear(); usePreview.setState({ enabled: false }) })
afterEach(() => vi.unstubAllGlobals())

describe('restCatalog', () => {
  it('lista com filtros de marca, categoria e destaque + só publicados', async () => {
    mockFetch([row])
    const out = await createRestCatalog(URL_, 'KEY').listProducts({ brandSlug: 'lay-store', categorySlug: 'tops', featured: true })
    const u = decodeURIComponent(calls[0].url)
    expect(u).toContain(`${URL_}/rest/v1/products?`)
    expect(u).toContain('brands.slug=eq.lay-store')
    expect(u).toContain('categories.slug=eq.tops')
    expect(u).toContain('categories!inner(slug)')
    expect(u).toContain('featured=eq.true')
    expect(u).toContain('status=eq.published')
    expect(calls[0].headers.apikey).toBe('KEY')
    expect(out[0]).toMatchObject({ id: 'p1', brandSlug: 'lay-store', priceCents: 1990 })
  })
  it('sem filtro de categoria usa join opcional (produto sem categoria continua aparecendo)', async () => {
    mockFetch([])
    await createRestCatalog(URL_, 'KEY').listProducts({})
    const u = decodeURIComponent(calls[0].url)
    expect(u).toContain('categories(slug)')
    expect(u).not.toContain('categories!inner')
  })
  it('getProduct devolve null quando não existe e o produto quando existe', async () => {
    mockFetch([])
    expect(await createRestCatalog(URL_, 'KEY').getProduct('lay-store', 'x')).toBeNull()
    mockFetch([row])
    expect((await createRestCatalog(URL_, 'KEY').getProduct('lay-store', 's'))?.slug).toBe('s')
  })
  it('categorias e configurações', async () => {
    mockFetch([{ slug: 'tops', name: 'Tops', brands: { slug: 'lay-store' } }])
    expect(await createRestCatalog(URL_, 'KEY').listCategories('lay-store')).toEqual([{ slug: 'tops', name: 'Tops' }])
    mockFetch([{ key: 'whatsapp_number', value: '5511999999999' }])
    expect(await createRestCatalog(URL_, 'KEY').getSettings()).toEqual({ whatsapp_number: '5511999999999' })
  })
  it('modo prévia + sessão do admin: inclui rascunhos e envia o token', async () => {
    localStorage.setItem('sb-proj-auth-token', JSON.stringify({ access_token: 'JWT123' }))
    usePreview.setState({ enabled: true })
    mockFetch([])
    await createRestCatalog(URL_, 'KEY').listProducts({})
    expect(decodeURIComponent(calls[0].url)).not.toContain('status=eq.published')
    expect(calls[0].headers.Authorization).toBe('Bearer JWT123')
  })
  it('sem prévia nunca envia o token (visitante e admin veem o mesmo)', async () => {
    localStorage.setItem('sb-proj-auth-token', JSON.stringify({ access_token: 'JWT123' }))
    mockFetch([])
    await createRestCatalog(URL_, 'KEY').listProducts({})
    expect(calls[0].headers.Authorization).toBeUndefined()
  })
  it('erro de rede/HTTP rejeita', async () => {
    mockFetch({}, false)
    await expect(createRestCatalog(URL_, 'KEY').getSettings()).rejects.toThrow()
  })
})
