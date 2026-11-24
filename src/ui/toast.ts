import { create } from 'zustand'

export type ToastTone = 'ok' | 'info' | 'warn' | 'error'
export interface ToastItem { id: number; tone: ToastTone; title: string; text?: string; action?: { label: string; run: () => void }; ms: number; leaving?: boolean }

interface ToastState { items: ToastItem[]; push(t: Omit<ToastItem, 'id' | 'ms' | 'tone'> & { tone?: ToastTone; ms?: number }): number; dismiss(id: number): void }

let seq = 0
export const useToasts = create<ToastState>((set, get) => ({
  items: [],
  push: (t) => {
    const id = ++seq
    // evita empilhar o mesmo aviso: troca o anterior de igual título
    const rest = get().items.filter((x) => x.title !== t.title)
    set({ items: [...rest, { id, tone: t.tone ?? 'ok', ms: t.ms ?? 4200, title: t.title, text: t.text, action: t.action }].slice(-3) })
    return id
  },
  dismiss: (id) => {
    set({ items: get().items.map((x) => (x.id === id ? { ...x, leaving: true } : x)) })
    setTimeout(() => set({ items: get().items.filter((x) => x.id !== id) }), 320)
  },
}))

/** Aviso rápido: toast({ title, text, tone, action }) */
export const toast = (t: Parameters<ToastState['push']>[0]) => useToasts.getState().push(t)
