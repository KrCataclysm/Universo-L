import { Link } from 'react-router-dom'
import type { Async } from '../data/CatalogProvider'
import type { Product } from '../data/catalog'
import EmptyState from './EmptyState'
import ProductCard from './ProductCard'
import Reveal from '../fx/Reveal'

export default function ProductGrid({ state, accent, emptyText, more }: { state: Async<Product[]>; accent?: [string, string]; emptyText?: string; more?: { to: string; label: string } }) {
  if (state.loading && !state.data) {
    return <div className="pgrid">{Array.from({ length: 4 }, (_, i) => <div key={i} className="pcard pcard--skel" aria-hidden />)}</div>
  }
  if (state.error) {
    return (
      <div className="empty" role="alert">
        <h3>Ops!</h3>
        <p>{state.error}</p>
        <button className="btn btn--ink" onClick={state.reload}>Tentar de novo</button>
      </div>
    )
  }
  if (!state.data?.length) return <EmptyState from={accent?.[0]} to={accent?.[1]} text={emptyText ?? 'Estamos preparando peças especiais para você.'} />
  return (
    <div className="pgrid">
      {state.data.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80} className="pgrid__item"><ProductCard p={p} /></Reveal>)}
      {more && <Reveal delay={(state.data.length % 4) * 80} className="pgrid__item"><Link to={more.to} className="pmore"><span className="pmore__k">Tem mais</span><span className="pmore__t">{more.label}</span><span className="pmore__go">Ver tudo <i>→</i></span></Link></Reveal>}
    </div>
  )
}
