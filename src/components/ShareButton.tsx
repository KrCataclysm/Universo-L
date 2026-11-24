import { useState } from 'react'

/** Compartilhar: usa o menu do celular quando existe; senão copia o link. */
export default function ShareButton({ title }: { title: string }) {
  const [msg, setMsg] = useState('')
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) { await navigator.share({ title: `${title} · Universo Lay`, url }); return }
      await navigator.clipboard.writeText(url)
      setMsg('Link copiado!'); setTimeout(() => setMsg(''), 2200)
    } catch { /* cancelado pela pessoa */ }
  }
  return (
    <button type="button" className="btn btn--ghost adm-sm" onClick={share} aria-live="polite">
      {msg || 'Compartilhar'}
    </button>
  )
}
