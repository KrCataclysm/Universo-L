import { beforeEach, describe, expect, it } from 'vitest'
import { itemKey, useCart, type CartItem } from '../src/cart/cartStore'
import { mapProduct, type ProductRow } from '../src/data/mapProduct'

const row = (variants: ProductRow['product_variants'], extra: Partial<ProductRow> = {}): ProductRow => ({ id: 'p1', slug: 'x', name: 'X', description: '', price_cents: 5000, featured: false, customizable: false, customization_schema: null, is_example: false, status: 'published', brands: { slug: 'lay-store' }, categories: null, product_images: [], product_variants: variants, ...extra })
const v = (id: string, value: string, in_stock: boolean, stock: number | null | undefined): NonNullable<ProductRow['product_variants']>[number] => ({ id, label: 'Tamanho', option_type: 'size', value, in_stock, stock, sort: 0 })
const map = (r: ProductRow) => mapProduct(r, (p) => p)

describe('estoque por quantidade', () => {
  it('quantidade 0 deixa a opção esgotada; quantidade maior que 0 segue disponível', () => {
    const p = map(row([v('1', 'P', true, 0), v('2', 'M', true, 3), v('3', 'G', true, null)]))
    expect(p.variants.map((x) => x.inStock)).toEqual([false, true, true])
    expect(p.variants.map((x) => x.stock)).toEqual([0, 3, null])
    expect(p.soldOut).toBe(false)
  })
  it('sem controle (null) respeita o in_stock manual', () => {
    const p = map(row([v('1', 'P', false, null)]))
    expect(p.variants[0].inStock).toBe(false)
  })
  it('peça fica esgotada sozinha quando todas as opções acabam', () => {
    expect(map(row([v('1', 'P', true, 0), v('2', 'M', true, 0)])).soldOut).toBe(true)
    expect(map(row([])).soldOut).toBe(false)
    expect(map(row([], { sold_out: true })).soldOut).toBe(true)
  })
})

describe('sacola respeita o estoque', () => {
  const item = (qty: number, max?: number): CartItem => ({ productId: 'p1', slug: 'x', brandSlug: 'lay-store', name: 'X', unitPriceCents: 5000, qty, variantLabel: 'Tamanho: M', max })
  beforeEach(() => { localStorage.clear(); useCart.setState({ items: [] }) })
  it('não deixa adicionar além do estoque, nem somando itens repetidos', () => {
    useCart.getState().add(item(5, 3)); expect(useCart.getState().items[0].qty).toBe(3)
    useCart.getState().add(item(2, 3)); expect(useCart.getState().items[0].qty).toBe(3)
  })
  it('aumentar a quantidade na sacola para no limite', () => {
    useCart.getState().add(item(1, 2))
    const k = itemKey(useCart.getState().items[0])
    useCart.getState().setQty(k, 9); expect(useCart.getState().items[0].qty).toBe(2)
  })
  it('sem limite (estoque não controlado) segue livre', () => {
    useCart.getState().add(item(7)); expect(useCart.getState().items[0].qty).toBe(7)
  })
})
