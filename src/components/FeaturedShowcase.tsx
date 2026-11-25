import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { useCart } from '../cart/cartStore'
import { priceLabel } from '../cart/money'
import type { Product } from '../data/catalog'
import { imgSize, imgSrcSet } from '../lib/env'
import { igHandle } from '../lib/format'
import { toast } from '../ui/toast'
import FavButton from './FavButton'

/** Vitrine em destaque: o fundo ganha o tom da marca da peça (referência: showcase de produto com cor dominante). */
export default function FeaturedShowcase({ items, ig }: { items: Product[]; ig: (brandSlug: string) => string | undefined }) {
  const [i, setI] = useState(0)
  const [variantId, setVariantId] = useState<string>()
  const root = useRef<HTMLDivElement>(null)
  const n = items.length
  const p = items[i]
  const brand = getBrand(p.brandSlug)
  const next = items[(i + 1) % n]
  const go = (k: number) => { setI((k + n) % n); setVariantId(undefined) }
  const simple = p.priceCents > 0 && !p.customizable && !p.customizationFields.length
  const variant = p.variants.find((v) => v.id === variantId)
  const handle = igHandle(ig(p.brandSlug))

  const add = () => {
    if (p.variants.length && !variant) { toast({ tone: 'warn', title: 'Escolha uma opção antes de continuar' }); return }
    useCart.getState().add({ productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty: 1, variantLabel: variant ? `${variant.label}: ${variant.value}` : undefined, image: p.images[0]?.url })
    toast({ title: 'Adicionado ao carrinho', text: p.name, action: { label: 'Ver carrinho', run: () => useCart.getState().setOpen(true) } })
  }
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) } if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) } }

  return (
    <div ref={root} className="show" role="group" aria-roledescription="carrossel" aria-label="Produtos em destaque" onKeyDown={onKey}>
      <div className="show__bg" aria-hidden>
        {['lay-store', 'ousada-delicada', 'falou-bordei'].map((s) => { const b = getBrand(s)!; return <span key={s} className={p.brandSlug === s ? 'on' : ''} style={{ ['--a' as string]: b.accentFrom, ['--b' as string]: b.accentTo }} /> })}
      </div>

      <nav className="show__tabs" aria-label="Escolher peça em destaque">
        {items.map((x, k) => <button key={x.id} type="button" className={k === i ? 'on' : ''} aria-pressed={k === i} onClick={() => go(k)}>{x.name}</button>)}
      </nav>

      <div className="show__stage" key={p.id}>
        <div className="show__copy">
          <p className="eyebrow">{brand?.name}</p>
          <h3>{p.name}</h3>
          <p className="show__desc">{p.description}</p>
          <div className="show__acts">
            <Link className="btn btn--ink btn--arrow" to={`/${p.brandSlug}/${p.slug}`}>Ver detalhes</Link>
            <FavButton id={p.id} name={p.name} className="show__fav" />
          </div>
          <div className="show__ctrl">
            <button type="button" onClick={() => go(i - 1)} aria-label="Peça anterior">‹</button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Próxima peça">›</button>
            <span aria-hidden>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          </div>
        </div>

        <Link to={`/${p.brandSlug}/${p.slug}`} className="show__media" aria-label={`Abrir ${p.name}`} tabIndex={-1}>
          {p.images[0] && <img src={imgSize(p.images[0].url, 800)} srcSet={imgSrcSet(p.images[0].url)} sizes="340px" alt="" width={640} height={800} />}
        </Link>

        <aside className="show__buy" aria-label="Preço e opções">
          <p className="show__price">{priceLabel(p.priceCents)}</p>
          {simple && !!p.variants.length && (
            <div className="show__opts" role="radiogroup" aria-label={p.variants[0].label}>
              <span>{p.variants[0].label}</span>
              <div>{p.variants.map((v) => <button key={v.id} type="button" role="radio" aria-checked={v.id === variantId} disabled={!v.inStock} className={v.id === variantId ? 'on' : ''} onClick={() => setVariantId(v.id)}>{v.value}</button>)}</div>
            </div>
          )}
          {simple && !p.soldOut
            ? <button type="button" className="btn btn--glass" onClick={add}>Adicionar ao carrinho</button>
            : <Link className="btn btn--glass" to={`/${p.brandSlug}/${p.slug}`}>{p.priceCents === 0 ? 'Solicitar orçamento' : 'Personalizar e comprar'}</Link>}
        </aside>
      </div>

      {handle && (
        <a className="show__ig" href={ig(p.brandSlug)} target="_blank" rel="noreferrer" aria-label={`Instagram ${handle}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" /></svg>
          <span>{handle}</span>
        </a>
      )}
      <button type="button" className="show__next" onClick={() => go(i + 1)} aria-label={`Próxima peça: ${next.name}`}>
        {next.images[0] && <img src={imgSize(next.images[0].url, 480)} alt="" width={96} height={120} />}
        <span><small>Próxima</small>{next.name}</span>
      </button>
      <p className="sr-only" role="status" aria-live="polite">Peça {i + 1} de {n}: {p.name}</p>
    </div>
  )
}
