import { useEffect } from 'react'

const BASE = 'Universo Lay'

/** Título da aba por página (a versão estática para compartilhamento é gerada no build). */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} — Todas as suas marcas em um só lugar.`
  }, [title])
}
