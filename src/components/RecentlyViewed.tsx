import { useProducts } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import ProductCard from './ProductCard'

export default function RecentlyViewed({ ids }: { ids: string[] }) {
  const all = useProducts({})
  const items = ids.map((id) => all.data?.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p).slice(0, 4)
  if (!items.length) return null
  return (
    <section className="container pdp__more" aria-labelledby="recent-h">
      <Reveal><h2 id="recent-h">Vistos recentemente</h2></Reveal>
      <div className="pgrid">{items.map((r) => <ProductCard key={r.id} p={r} />)}</div>
    </section>
  )
}
