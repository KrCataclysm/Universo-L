import { Link } from 'react-router-dom'
import { priceLabel } from '../cart/money'
import { imgSize, imgSrcSet } from '../lib/env'
import type { Product } from '../data/catalog'
import { useTilt } from '../fx/useTilt'

export default function ProductCard({ p }: { p: Product }) {
  const tilt = useTilt(6)
  const [a, b] = p.images
  return (
    <Link to={`/${p.brandSlug}/${p.slug}`} className="pcard" {...tilt}>
      <div className="pcard__media">
        {a && <img src={imgSize(a.url, 480)} srcSet={imgSrcSet(a.url)} sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" alt={a.alt} width={640} height={800} loading="lazy" decoding="async" className="pcard__img" />}
        {b && <img src={imgSize(b.url, 480)} alt="" aria-hidden loading="lazy" decoding="async" className="pcard__img pcard__img--alt" />}
        <span className="pcard__shine" aria-hidden />
        {p.soldOut ? <span className="tag tag--sold">Esgotado</span> : p.status && p.status !== 'published' ? <span className="tag">{p.status === 'draft' ? 'Rascunho' : 'Oculto'}</span> : p.isExample && <span className="tag">Exemplo</span>}
        {p.customizable && <span className="tag tag--r">Personalizável</span>}
      </div>
      <div className="pcard__info">
        <h3>{p.name}</h3>
        <span className="pcard__price">{priceLabel(p.priceCents)}</span>
      </div>
    </Link>
  )
}
