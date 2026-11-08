import { create } from 'zustand'

export interface CartItem {
  productId: string
  slug: string
  brandSlug: string
  name: string
  unitPriceCents: number
  qty: number
  variantLabel?: string
  /** personalização: rótulo do campo → valor */
  custom?: Record<string, string>
}

const KEY = 'ul-cart'

export const itemKey = (i: Pick<CartItem, 'productId' | 'variantLabel' | 'custom'>): string => {
  const c = i.custom ? Object.entries(i.custom).sort(([a], [b]) => a.localeCompare(b)) : []
  return JSON.stringify([i.productId, i.variantLabel ?? '', c])
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((i) => i && typeof i.productId === 'string' && Number.isInteger(i.unitPriceCents) && Number.isInteger(i.qty) && i.qty > 0)
  } catch {
    return []
  }
}

const save = (items: CartItem[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage bloqueado: segue em memória */ }
}

interface CartState {
  items: CartItem[]
  open: boolean
  add(item: CartItem): void
  setQty(key: string, qty: number): void
  remove(key: string): void
  clear(): void
  totalCents(): number
  count(): number
  prune(validProductIds: Set<string>): number
  setOpen(open: boolean): void
}

export const useCart = create<CartState>((set, get) => {
  const commit = (items: CartItem[]) => { save(items); set({ items }) }
  return {
    items: loadCart(),
    open: false,
    add: (item) => {
      const key = itemKey(item)
      const items = get().items
      const hit = items.find((i) => itemKey(i) === key)
      commit(hit ? items.map((i) => (i === hit ? { ...i, qty: i.qty + item.qty } : i)) : [...items, item])
    },
    setQty: (key, qty) => commit(qty <= 0 ? get().items.filter((i) => itemKey(i) !== key) : get().items.map((i) => (itemKey(i) === key ? { ...i, qty } : i))),
    remove: (key) => commit(get().items.filter((i) => itemKey(i) !== key)),
    clear: () => commit([]),
    totalCents: () => get().items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0),
    count: () => get().items.reduce((s, i) => s + i.qty, 0),
    prune: (valid) => {
      const kept = get().items.filter((i) => valid.has(i.productId))
      const removed = get().items.length - kept.length
      if (removed) commit(kept)
      return removed
    },
    setOpen: (open) => set({ open }),
  }
})
