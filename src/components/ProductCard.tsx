import { Link } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { priceLabel } from '../cart/money'
import type { Product } from '../data/catalog'
import { imgSize, imgSrcSet } from '../lib/env'
import { badgesOf } from '../lib/search'
import { useTilt } from '../fx/useTilt'
import { useQuick } from '../store/quick'
import FavButton from './FavButton'

export default function ProductCard({ p }: { p: Product }) {
  const tilt = useTilt(5)
  const [a, b] = p.images
  const badges = badgesOf(p)
  const quote = p.priceCents === 0
  return (
    <div className="pcard-wrap">
      <Link to={`/${p.brandSlug}/${p.slug}`} className="pcard" {...tilt}>
        <div className="pcard__media">
          {a && <img src={imgSize(a.url, 480)} srcSet={imgSrcSet(a.url)} sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 25vw" alt={a.alt} width={640} height={800} loading="lazy" decoding="async" className="pcard__img" />}
          {b && <img src={imgSize(b.url, 480)} alt="" aria-hidden width={640} height={800} loading="lazy" decoding="async" className="pcard__img pcard__img--alt" />}
          <span className="pcard__shine" aria-hidden />
          <div className="pcard__tags">
            {p.soldOut && <span className="tag tag--sold">Esgotado</span>}
            {!p.soldOut && p.status && p.status !== 'published' && <span className="tag">{p.status === 'draft' ? 'Rascunho' : 'Oculto'}</span>}
            {!p.soldOut && badges.map((l) => <span key={l} className={`tag ${l === 'Novidade' ? 'tag--new' : ''}`}>{l}</span>)}
            {p.isExample && <span className="tag">Exemplo</span>}
          </div>
        </div>
        <div className="pcard__info">
          <span className="pcard__brand">{getBrand(p.brandSlug)?.name}</span>
          <h3>{p.name}</h3>
          <span className="pcard__price">{priceLabel(p.priceCents)}</span>
        </div>
        <span className={`pcard__cta ${quote ? 'pcard__cta--quote' : ''}`}>{quote ? 'Solicitar orçamento' : 'Ver detalhes'}</span>
      </Link>
      <FavButton id={p.id} name={p.name} className="pcard__fav" />
      <button type="button" className="pcard__qv" onClick={() => useQuick.getState().open(p)} aria-label={`Visualização rápida: ${p.name}`}>Visualização rápida</button>
    </div>
  )
}
