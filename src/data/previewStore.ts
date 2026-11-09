import { create } from 'zustand'

const KEY = 'ul-preview'
const read = (): boolean => { try { return localStorage.getItem(KEY) === '1' } catch { return false } }

/** Modo "ver como cliente" invertido: ligado = o admin vê também rascunhos nas páginas públicas. */
export const usePreview = create<{ enabled: boolean; setEnabled: (v: boolean) => void }>((set) => ({
  enabled: read(),
  setEnabled: (enabled) => { try { localStorage.setItem(KEY, enabled ? '1' : '0') } catch { /* ok */ } set({ enabled }) },
}))
