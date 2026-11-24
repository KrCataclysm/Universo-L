import { toast } from '../ui/toast'

/** Compartilhar: usa o menu do celular quando existe; senão copia o link. */
export default function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) { await navigator.share({ title: `${title} · Universo Lay`, url }); return }
      await navigator.clipboard.writeText(url)
      toast({ title: 'Link copiado', text: 'Cole onde quiser compartilhar.' })
    } catch { /* cancelado pela pessoa */ }
  }
  return <button type="button" className="btn btn--ghost adm-sm" onClick={share}>Compartilhar</button>
}
