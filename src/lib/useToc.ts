import { useEffect, useState, type RefObject } from 'react'

export interface TocItem { id: string; title: string }

/** Lê os títulos (h2) de uma página de texto e monta o índice lateral. */
export function useToc(ref: RefObject<HTMLElement | null>, deps: unknown[] = []): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([])
  useEffect(() => {
    const sections = [...(ref.current?.querySelectorAll<HTMLElement>('section[id], section > h2') ?? [])]
    const out: TocItem[] = []
    ref.current?.querySelectorAll<HTMLElement>('section').forEach((sec, i) => {
      const h = sec.querySelector('h2'); if (!h) return
      if (!sec.id) sec.id = `s${i + 1}`
      out.push({ id: sec.id, title: h.textContent ?? '' })
    })
    void sections
    setItems(out)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return items
}
