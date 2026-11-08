import type { Async } from '../data/CatalogProvider'
import type { Product } from '../data/catalog'
import EmptyState from './EmptyState'
import ProductCard from './ProductCard'
import Reveal from '../fx/Reveal'

export default function ProductGrid({ state, accent, emptyText }: { state: Async<Product[]>; accent?: [string, string]; emptyText?: string }) {
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
      {state.data.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProductCard p={p} /></Reveal>)}
    </div>
  )
}
