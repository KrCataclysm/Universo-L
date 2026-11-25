import { create } from 'zustand'
import type { Product } from '../data/catalog'

interface QuickState { p: Product | null; ever: boolean; open(p: Product): void; close(): void }
export const useQuick = create<QuickState>((set) => ({ p: null, ever: false, open: (p) => set({ p, ever: true }), close: () => set({ p: null }) }))
