import { describe, expect, it } from 'vitest'
import { buildWhatsAppUrl } from '../src/cart/whatsapp'
import type { CartItem } from '../src/cart/cartStore'

const item = (over: Partial<CartItem> = {}): CartItem => ({ productId: 'p', slug: 's', brandSlug: 'lay-store', name: 'Peça de teste', unitPriceCents: 1990, qty: 1, ...over })
const text = (url: string) => decodeURIComponent(url.split('?text=')[1])

describe('buildWhatsAppUrl', () => {
  it('sem telefone → no-phone', () => {
    expect(buildWhatsAppUrl({ phone: undefined, items: [item()] })).toMatchObject({ url: null, reason: 'no-phone' })
    expect(buildWhatsAppUrl({ phone: '   ', items: [item()] })).toMatchObject({ url: null, reason: 'no-phone' })
  })
  it('carrinho vazio → empty', () => {
    expect(buildWhatsAppUrl({ phone: '5511999999999', items: [] })).toMatchObject({ url: null, reason: 'empty' })
  })
  it('usa só dígitos do telefone', () => {
    const r = buildWhatsAppUrl({ phone: '+55 (11) 99999-9999', items: [item()] })
    expect(r.url!.startsWith('https://wa.me/5511999999999?text=')).toBe(true)
  })
  it('preserva caracteres especiais, emoji e quebras de linha', () => {
    const r = buildWhatsAppUrl({
      phone: '5511999999999',
      customerName: 'Ana & "Bia" #1',
      items: [item({ name: 'Toalha 100% algodão 💜', custom: { nome: 'Maria & José\nlinha 2' } })],
    })
    const t = text(r.url!)
    expect(t).toContain('Toalha 100% algodão 💜')
    expect(t).toContain('Maria & José\nlinha 2')
    expect(t).toContain('Ana & "Bia" #1')
  })
  it('inclui variante, quantidade, subtotal e total', () => {
    const t = text(buildWhatsAppUrl({ phone: '5511999999999', items: [item({ qty: 2, variantLabel: 'M' })] }).url!)
    expect(t).toContain('2x Peça de teste (M)')
    expect(t.replace(/ /g, ' ')).toContain('Total: R$ 39,80')
  })
  it('60 itens longos: URL ≤ 1900, truncated=true e avisa o resumo', () => {
    const items = Array.from({ length: 60 }, (_, i) => item({ productId: `p${i}`, name: `Peça de teste número ${i} com nome bem comprido para estourar o limite` }))
    const r = buildWhatsAppUrl({ phone: '5511999999999', items })
    expect(r.url!.length).toBeLessThanOrEqual(1900)
    expect(r.truncated).toBe(true)
    expect(text(r.url!)).toMatch(/resumid/i)
    expect(text(r.url!).replace(/ /g, ' ')).toContain('Total: R$ 1.194,00')
  })
})
