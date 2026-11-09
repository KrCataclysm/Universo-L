import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { useCart } from '../cart/cartStore'
import { formatBRL } from '../cart/money'
import { buildWhatsAppUrl } from '../cart/whatsapp'
import CustomizationForm from '../components/CustomizationForm'
import Gallery from '../components/Gallery'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import NotFound from './NotFound'

export default function ProductPage() {
  const { brand: brandSlug = '', slug = '' } = useParams()
  const brand = getBrand(brandSlug)
  const state = useAsync((c) => c.getProduct(brandSlug, slug), [brandSlug, slug])
  const settings = useAsync((c) => c.getSettings(), [])
  const [variantId, setVariantId] = useState<string>()
  const [custom, setCustom] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  useEffect(() => { void import('../components/CartDrawer') }, [])
  const p = state.data
  const variant = p?.variants.find((v) => v.id === variantId)

  const ask = useMemo(() => p ? buildWhatsAppUrl({
    phone: settings.data?.whatsapp_number,
    items: [{ productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty: 1 }],
  }).url : null, [p, settings.data])

  if (!brand) return <NotFound />
  if (state.loading && !p) return <main className="page pdp"><div className="container pdp__skel" aria-busy /></main>
  if (state.error) return <main className="page pdp"><div className="container empty" role="alert"><h3>Ops!</h3><p>{state.error}</p><button className="btn btn--ink" onClick={state.reload}>Tentar de novo</button></div></main>
  if (!p) return <NotFound />

  const add = () => {
    const errs: Record<string, string> = {}
    if (p.variants.length && !variant) errs.__variant = 'Escolha uma opção.'
    for (const f of p.customizationFields) if (f.required && !custom[f.key]?.trim()) errs[f.key] = 'Campo obrigatório.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const labelled = Object.fromEntries(p.customizationFields.filter((f) => custom[f.key]?.trim()).map((f) => [f.label, custom[f.key].trim()]))
    useCart.getState().add({
      productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty,
      variantLabel: variant?.value, custom: Object.keys(labelled).length ? labelled : undefined,
    })
    useCart.getState().setOpen(true)
  }

  return (
    <main className="page pdp" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }}>
      <div className="container pdp__grid">
        <Reveal><Gallery images={p.images} /></Reveal>
        <Reveal delay={120} className="pdp__info">
          <nav className="crumbs" aria-label="Você está em"><Link to="/">Início</Link> / <Link to={`/${brand.slug}`}>{brand.name}</Link></nav>
          {p.isExample && <span className="tag tag--inline">Exemplo</span>}
          <h1>{p.name}</h1>
          <p className="pdp__price">{formatBRL(p.priceCents)}</p>
          <p className="pdp__desc">{p.description}</p>
          {!!p.variants.length && (
            <div className="variants" role="radiogroup" aria-label={p.variants[0].label}>
              <span className="variants__label">{p.variants[0].label}</span>
              <div>{p.variants.map((v) => (
                <button key={v.id} role="radio" aria-checked={v.id === variantId} disabled={!v.inStock} className={v.id === variantId ? 'on' : ''} onClick={() => { setVariantId(v.id); setErrors((e) => ({ ...e, __variant: '' })) }}>{v.value}</button>
              ))}</div>
              {errors.__variant && <em role="alert">{errors.__variant}</em>}
            </div>
          )}
          <CustomizationForm fields={p.customizationFields} values={custom} errors={errors} onChange={(k, v) => setCustom((c) => ({ ...c, [k]: v }))} />
          <div className="pdp__buy">
            <div className="qty qty--lg"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">−</button><span>{qty}</span><button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Aumentar">+</button></div>
            <button className="btn btn--ink" onClick={add}>Adicionar ao carrinho</button>
          </div>
          {ask && <a className="pdp__ask" href={ask} target="_blank" rel="noreferrer">Chamar no WhatsApp sobre esta peça</a>}
        </Reveal>
      </div>
    </main>
  )
}
