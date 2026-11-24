import { useEffect, useState } from 'react'
import { useAsync } from '../data/CatalogProvider'

/** Botão flutuante discreto: só aparece com número cadastrado e se esconde ao rolar para baixo (não cobre produtos). */
export default function WhatsAppFab() {
  const { data } = useAsync((c) => c.getSettings(), [])
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY, d = y - last
      if (Math.abs(d) < 8) return
      setHidden(d > 0 && y > 240)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const n = (data?.whatsapp_number ?? '').replace(/\D/g, '')
  if (!n) return null
  return (
    <a className={`wafab ${hidden ? 'is-hidden' : ''}`} href={`https://wa.me/${n}?text=${encodeURIComponent('Olá! Vim pelo site do Universo Lay.')}`} target="_blank" rel="noreferrer" aria-label="Falar com a loja no WhatsApp" tabIndex={hidden ? -1 : 0}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.6-4A8 8 0 1 1 20 11.5Z" /><path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1-1.2-1.6-.9-.7.6c-.7-.3-1.4-1-1.7-1.7l.6-.7-.9-1.6L9 9.5Z" /></svg>
    </a>
  )
}
