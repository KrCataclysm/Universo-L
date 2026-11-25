import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { useCart } from '../cart/cartStore'
import { priceLabel } from '../cart/money'
import { imgSize } from '../lib/env'
import { useQuick } from '../store/quick'
import { toast } from '../ui/toast'

/** Janela de visualização rápida (elemento <dialog>: foco preso e Esc nativos). */
export default function QuickView() {
  const p = useQuick((s) => s.p)
  const close = useQuick((s) => s.close)
  const ref = useRef<HTMLDialogElement>(null)
  const [variantId, setVariantId] = useState<string>()
  const [qty, setQty] = useState(1)
  const [err, setErr] = useState('')
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (p && !d.open) { setVariantId(undefined); setQty(1); setErr(''); d.showModal() }
    if (!p && d.open) d.close()
  }, [p])
  const simple = !!p && p.priceCents > 0 && !p.customizable && !p.customizationFields.length
  const variant = p?.variants.find((v) => v.id === variantId)
  const add = () => {
    if (!p) return
    if (p.variants.length && !variant) { setErr('Escolha uma opção.'); toast({ tone: 'warn', title: 'Escolha uma opção antes de continuar' }); return }
    useCart.getState().add({ productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty, variantLabel: variant ? `${variant.label}: ${variant.value}` : undefined, image: p.images[0]?.url })
    toast({ title: 'Adicionado ao carrinho', text: `${qty > 1 ? `${qty}× ` : ''}${p.name}`, action: { label: 'Ver carrinho', run: () => useCart.getState().setOpen(true) } })
    close()
  }
  const brand = p ? getBrand(p.brandSlug) : undefined
  return (
    <dialog ref={ref} className="qv" aria-label={p ? `Visualização rápida: ${p.name}` : 'Visualização rápida'} onClose={close} onClick={(e) => { if (e.target === ref.current) close() }}>
      {p && (
        <div className="qv__body">
          <button type="button" className="qv__x" onClick={close} aria-label="Fechar">✕</button>
          <div className="qv__media">{p.images[0] && <img src={imgSize(p.images[0].url, 800)} alt={p.images[0].alt} width={640} height={800} />}</div>
          <div className="qv__info">
            <p className="eyebrow">{brand?.name}</p>
            <h2>{p.name}</h2>
            <p className="qv__price">{priceLabel(p.priceCents)}</p>
            <p className="qv__desc">{p.description}</p>
            {simple && !!p.variants.length && (
              <div className="variants" role="radiogroup" aria-label={p.variants[0].label}>
                <span className="variants__label">{p.variants[0].label}</span>
                <div>{p.variants.map((v) => <button key={v.id} role="radio" aria-checked={v.id === variantId} disabled={!v.inStock} className={v.id === variantId ? 'on' : ''} onClick={() => { setVariantId(v.id); setErr('') }}>{v.value}</button>)}</div>
                {err && <em role="alert">{err}</em>}
              </div>
            )}
            <div className="qv__buy">
              {simple && !p.soldOut && (<>
                <div className="qty qty--lg"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">−</button><span>{qty}</span><button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Aumentar">+</button></div>
                <button className="btn btn--ink" onClick={add}>Adicionar ao carrinho</button>
              </>)}
              {p.soldOut && <button className="btn btn--ink" disabled>Esgotado</button>}
              <Link className="btn btn--ghost" to={`/${p.brandSlug}/${p.slug}`} onClick={close}>{simple ? 'Ver detalhes completos' : p.priceCents === 0 ? 'Solicitar orçamento' : 'Personalizar e comprar'}</Link>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
