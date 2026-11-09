import { describe, expect, it } from 'vitest'

// Roda contra o Supabase real só quando SUPABASE_URL e SUPABASE_ANON existirem.
const URL_ = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_ANON
const run = describe.skipIf(!URL_ || !KEY)

const call = (path: string, init: RequestInit = {}) =>
  fetch(`${URL_}${path}`, { ...init, headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers as Record<string, string>) } })

run('RLS (visitante anônimo)', () => {
  it('lê as 3 marcas', async () => {
    const rows = await (await call('/rest/v1/brands?select=slug&order=sort')).json()
    expect(rows.map((r: { slug: string }) => r.slug)).toEqual(['lay-store', 'ousada-delicada', 'falou-bordei'])
  })
  it('só enxerga produtos publicados (rascunho não vaza)', async () => {
    const rows = await (await call('/rest/v1/products?select=slug,status')).json()
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r: { status: string }) => r.status === 'published')).toBe(true)
    expect(rows.some((r: { slug: string }) => r.slug === 'rascunho-teste-rls')).toBe(false)
  })
  it('não consegue inserir produto', async () => {
    const brand = (await (await call('/rest/v1/brands?select=id&limit=1')).json())[0].id
    const res = await call('/rest/v1/products', { method: 'POST', body: JSON.stringify({ brand_id: brand, slug: 'invasor', name: 'x', price_cents: 1 }) })
    expect(res.status).toBeGreaterThanOrEqual(400)
  })
  it('não consegue alterar nem apagar produto (0 linhas afetadas)', async () => {
    const upd = await (await call('/rest/v1/products?is_example=eq.true', { method: 'PATCH', body: JSON.stringify({ price_cents: 1 }) })).json()
    expect(Array.isArray(upd) ? upd.length : 0).toBe(0)
    const del = await (await call('/rest/v1/products?is_example=eq.true', { method: 'DELETE' })).json()
    expect(Array.isArray(del) ? del.length : 0).toBe(0)
  })
  it('não escreve em settings nem lê admin_users', async () => {
    const res = await call('/rest/v1/settings', { method: 'POST', body: JSON.stringify({ key: 'whatsapp_number', value: '5500000000000' }) })
    expect(res.status).toBeGreaterThanOrEqual(400)
    const admins = await (await call('/rest/v1/admin_users?select=user_id')).json()
    expect(admins).toEqual([])
  })
  it('is_admin() não está exposta na API', async () => {
    const res = await call('/rest/v1/rpc/is_admin', { method: 'POST', body: '{}' })
    expect(res.status).toBe(404)
  })
  it('não envia arquivo para o bucket de imagens', async () => {
    const res = await fetch(`${URL_}/storage/v1/object/product-images/invasor.webp`, { method: 'POST', headers: { apikey: KEY!, Authorization: `Bearer ${KEY}`, 'Content-Type': 'image/webp' }, body: new Uint8Array([1, 2, 3]) })
    expect(res.status).toBeGreaterThanOrEqual(400)
  })
})
