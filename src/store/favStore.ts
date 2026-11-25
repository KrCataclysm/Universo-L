import { create } from 'zustand'

const KEY = 'ul-favs'
const load = (): string[] => {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [] } catch { return [] }
}
const save = (ids: string[]) => { try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* sem armazenamento: segue em memória */ } }

interface FavState { ids: string[]; has(id: string): boolean; toggle(id: string): boolean; set(ids: string[]): void; clear(): void }

export const useFavs = create<FavState>((set, get) => ({
  ids: load(),
  has: (id) => get().ids.includes(id),
  /** devolve true quando passou a ser favorito */
  toggle: (id) => {
    const on = get().ids.includes(id)
    const ids = on ? get().ids.filter((x) => x !== id) : [...get().ids, id]
    save(ids); set({ ids }); return !on
  },
  set: (ids) => { save(ids); set({ ids }) },
  clear: () => { save([]); set({ ids: [] }) },
}))
