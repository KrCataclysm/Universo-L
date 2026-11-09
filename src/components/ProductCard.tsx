import { Link } from 'react-router-dom'
import { formatBRL } from '../cart/money'
import type { Product } from '../data/catalog'
import { useTilt } from '../fx/useTilt'

export default function ProductCard({ p }: { p: Product }) {
  const tilt = useTilt(6)
  const [a, b] = p.images
  return (
    <Link to={`/${p.brandSlug}/${p.slug}`} className="pcard" {...tilt}>
      <div className="pcard__media">
        {a && <img src={a.url} alt={a.alt} loading="lazy" decoding="async" className="pcard__img" />}
        {b && <img src={b.url} alt="" aria-hidden loading="lazy" decoding="async" className="pcard__img pcard__img--alt" />}
        <span className="pcard__shine" aria-hidden />
        {p.status && p.status !== 'published' ? <span className="tag">{p.status === 'draft' ? 'Rascunho' : 'Oculto'}</span> : p.isExample && <span className="tag">Exemplo</span>}
        {p.customizable && <span className="tag tag--r">Personalizável</span>}
      </div>
      <div className="pcard__info">
        <h3>{p.name}</h3>
        <span className="pcard__price">{formatBRL(p.priceCents)}</span>
      </div>
    </Link>
  )
}
