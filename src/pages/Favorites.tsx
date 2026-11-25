import { Link } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { priceLabel } from '../cart/money'
import ProductCard from '../components/ProductCard'
import { useAsync, useProducts } from '../data/CatalogProvider'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { useFavs } from '../store/favStore'
import { toast } from '../ui/toast'

export default function Favorites() {
  useDocumentTitle('Favoritos')
  const ids = useFavs((s) => s.ids)
  const all = useProducts({})
  const settings = useAsync((c) => c.getSettings(), [])
  const items = (all.data ?? []).filter((p) => ids.includes(p.id))
  const phone = (settings.data?.whatsapp_number ?? '').replace(/\D/g, '')
  const send = () => {
    const base = new URL(import.meta.env.BASE_URL, window.location.origin).toString()
    const lines = items.map((p) => `• ${p.name} (${getBrand(p.brandSlug)?.name}) — ${priceLabel(p.priceCents)}\n${base}${p.brandSlug}/${p.slug}`)
    const msg = `Olá! Salvei estes favoritos no site do Universo Lay:\n\n${lines.join('\n\n')}`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    toast({ tone: 'info', title: 'Abrindo o WhatsApp', text: 'Envie a lista para a loja.' })
  }
  const clear = () => {
    const prev = useFavs.getState().ids
    useFavs.getState().clear()
    toast({ tone: 'info', title: 'Favoritos limpos', action: { label: 'Desfazer', run: () => useFavs.getState().set(prev) } })
  }
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Sua seleção</p>
          <h1>Favoritos</h1>
          <p className="phead__lead">As peças que você salvou ficam guardadas neste aparelho. Envie a lista para a loja quando quiser.</p>
        </header>
        {all.loading && !all.data ? <div className="pgrid">{Array.from({ length: 4 }, (_, k) => <div key={k} className="pcard pcard--skel" aria-hidden />)}</div>
          : !items.length ? (
            <div className="empty" role="status">
              <h3>Nenhum favorito ainda</h3>
              <p>Toque no coração de uma peça para guardá-la aqui.</p>
              <div className="contact__links"><Link className="btn btn--ink btn--arrow" to="/busca">Ver todas as peças</Link></div>
            </div>
          ) : (<>
            <div className="favbar">
              <p role="status">{items.length} {items.length === 1 ? 'peça salva' : 'peças salvas'}</p>
              <div>
                {phone && <button className="btn btn--ink" onClick={send}>Enviar lista pelo WhatsApp</button>}
                <button className="btn btn--ghost" onClick={clear}>Limpar favoritos</button>
              </div>
            </div>
            <div className="pgrid">{items.map((p) => <div key={p.id} className="pgrid__item"><ProductCard p={p} /></div>)}</div>
          </>)}
      </div>
    </main>
  )
}
