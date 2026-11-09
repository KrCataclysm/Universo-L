import { beforeEach, describe, expect, it } from 'vitest'
import { itemKey, useCart, type CartItem } from '../src/cart/cartStore'

const base: CartItem = { productId: 'p1', slug: 's', brandSlug: 'lay-store', name: 'Peça de teste', unitPriceCents: 1000, qty: 1 }

beforeEach(() => { localStorage.clear(); useCart.setState({ items: [] }) })

describe('cartStore', () => {
  it('soma qty do mesmo produto+variante+personalização', () => {
    useCart.getState().add(base)
    useCart.getState().add({ ...base, qty: 2 })
    expect(useCart.getState().items).toHaveLength(1)
    expect(useCart.getState().items[0].qty).toBe(3)
  })
  it('variante diferente cria nova linha', () => {
    useCart.getState().add({ ...base, variantLabel: 'P' })
    useCart.getState().add({ ...base, variantLabel: 'M' })
    expect(useCart.getState().items).toHaveLength(2)
  })
  it('personalização diferente cria nova linha, independente da ordem das chaves', () => {
    useCart.getState().add({ ...base, custom: { a: '1', b: '2' } })
    useCart.getState().add({ ...base, custom: { b: '2', a: '1' } })
    expect(useCart.getState().items).toHaveLength(1)
    useCart.getState().add({ ...base, custom: { a: '9' } })
    expect(useCart.getState().items).toHaveLength(2)
  })
  it('setQty(0) remove; total soma corretamente', () => {
    useCart.getState().add({ ...base, qty: 2 })
    useCart.getState().add({ ...base, productId: 'p2', unitPriceCents: 550 })
    expect(useCart.getState().totalCents()).toBe(2550)
    useCart.getState().setQty(itemKey(base), 0)
    expect(useCart.getState().items.map((i) => i.productId)).toEqual(['p2'])
  })
  it('persiste no localStorage', () => {
    useCart.getState().add(base)
    expect(JSON.parse(localStorage.getItem('ul-cart')!)).toHaveLength(1)
  })
  it('JSON corrompido no localStorage vira carrinho vazio, sem exceção', async () => {
    localStorage.setItem('ul-cart', '{nao é json')
    const mod = await import('../src/cart/cartStore')
    expect(mod.loadCart()).toEqual([])
  })
  it('remove órfãos (produto que não existe mais)', () => {
    useCart.getState().add(base)
    useCart.getState().add({ ...base, productId: 'gone' })
    const removed = useCart.getState().prune(new Set(['p1']))
    expect(removed).toBe(1)
    expect(useCart.getState().items.map((i) => i.productId)).toEqual(['p1'])
  })
})
