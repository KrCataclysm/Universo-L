import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import { useCart } from '../cart/cartStore'
import { priceLabel } from '../cart/money'
import { buildWhatsAppUrl } from '../cart/whatsapp'
import CustomizationForm from '../components/CustomizationForm'
import Gallery from '../components/Gallery'
import ProductCard from '../components/ProductCard'
import ShareButton from '../components/ShareButton'
import { useAsync } from '../data/CatalogProvider'
import { seedProduct } from '../data/seed'
import Reveal from '../fx/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'
import { toast } from '../ui/toast'
import { getRecent, pushRecent } from '../store/recent'
import RecentlyViewed from '../components/RecentlyViewed'

export default function ProductPage() {
  const { brand: brandSlug = '', slug = '' } = useParams()
  const brand = getBrand(brandSlug)
  const seed = useMemo(() => seedProduct(brandSlug, slug), [brandSlug, slug])
  const state = useAsync((c) => c.getProduct(brandSlug, slug), [brandSlug, slug], seed)
  const settings = useAsync((c) => c.getSettings(), [])
  const more = useAsync((c) => c.listProducts({ brandSlug }), [brandSlug])
  const addBtn = useRef<HTMLButtonElement>(null)
  const [added, setAdded] = useState(false)
  const [variantId, setVariantId] = useState<string>()
  const [custom, setCustom] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  useEffect(() => { void import('../components/CartDrawer') }, [])
  const phone = (settings.data?.whatsapp_number ?? '').replace(/\D/g, '')
  const p = state.data
  // dados embutidos no HTML valem só para a 1ª pintura: até a conferência com o banco chegar, não deixa adicionar (preço/estoque podem ter mudado)
  const stale = !!seed && state.data === seed
  const [recentIds, setRecentIds] = useState<string[]>([])
  useEffect(() => { if (!p) return; setRecentIds(getRecent().filter((x) => x !== p.id)); pushRecent(p.id) }, [p?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useDocumentTitle(p ? `${p.name} — ${brand?.name ?? ''}` : undefined)
  const variant = p?.variants.find((v) => v.id === variantId)
  const maxQty = Math.min(20, variant?.stock ?? 20)

  const ask = useMemo(() => p ? buildWhatsAppUrl({
    phone: settings.data?.whatsapp_number,
    items: [{ productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty: 1 }],
  }).url : null, [p, settings.data])

  const related = (more.data ?? []).filter((r) => r.slug !== slug).slice(0, 4)

  const quoteUrl = useMemo(() => {
    if (!p || !phone) return null
    const extra = p.customizationFields.filter((f) => custom[f.key]?.trim()).map((f) => `${f.label}: ${custom[f.key].trim()}`)
    const msg = ['Olá! Gostaria de solicitar um orçamento.', `Peça: ${p.name}${brand ? ` (${brand.name})` : ''}`, ...extra, window.location.href].join('\n')
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
  }, [p, phone, custom, brand])

  if (!brand) return <NotFound />
  if (state.loading && !p) return <main className="page pdp"><div className="container pdp__skel" aria-busy /></main>
  if (state.error) return <main className="page pdp"><div className="container empty" role="alert"><h3>Ops!</h3><p>{state.error}</p><button className="btn btn--ink" onClick={state.reload}>Tentar de novo</button></div></main>
  if (!p) return <NotFound />

  const add = () => {
    const errs: Record<string, string> = {}
    if (p.variants.length && !variant) errs.__variant = 'Escolha uma opção.'
    for (const f of p.customizationFields) if (f.required && !custom[f.key]?.trim()) errs[f.key] = 'Campo obrigatório.'
    setErrors(errs)
    if (Object.keys(errs).length) { toast({ tone: 'warn', title: errs.__variant ? 'Escolha uma opção antes de continuar' : 'Preencha os campos obrigatórios' }); return }
    const labelled = Object.fromEntries(p.customizationFields.filter((f) => custom[f.key]?.trim()).map((f) => [f.label, custom[f.key].trim()]))
    useCart.getState().add({
      productId: p.id, slug: p.slug, brandSlug: p.brandSlug, name: p.name, unitPriceCents: p.priceCents, qty: Math.min(qty, maxQty), max: variant?.stock ?? undefined,
      variantLabel: variant ? `${variant.label}: ${variant.value}` : undefined, image: p.images[0]?.url, custom: Object.keys(labelled).length ? labelled : undefined,
    })
    toast({ title: 'Adicionado ao carrinho', text: `${qty > 1 ? `${qty}× ` : ''}${p.name}`, action: { label: 'Ver carrinho', run: () => { addBtn.current?.focus(); useCart.getState().setOpen(true) } } })
    setAdded(true); setTimeout(() => setAdded(false), 1800)
  }

  return (
    <main className="page pdp" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }}>
      <div className="container pdp__grid">
        <div><Gallery images={p.images} /></div>
        <div className="pdp__info">
          <nav className="crumbs" aria-label="Você está em"><Link to="/">Início</Link> / <Link to={`/${brand.slug}`}>{brand.name}</Link></nav>
          {p.isExample && <span className="tag tag--inline">Exemplo</span>}
          <h1>{p.name}</h1>
          <p className="pdp__price">{priceLabel(p.priceCents)}</p>
          {p.priceCents === 0 && <p className="pdp__note">O valor é combinado com a loja, pelo WhatsApp, conforme o seu pedido.</p>}
          <p className="pdp__desc">{p.description}</p>
          {!!p.variants.length && (
            <div className="variants" role="radiogroup" aria-label={p.variants[0].label}>
              <span className="variants__label">{p.variants[0].label}</span>
              <div>{p.variants.map((v) => (
                <button key={v.id} role="radio" aria-checked={v.id === variantId} disabled={!v.inStock} className={v.id === variantId ? 'on' : ''} onClick={() => { setVariantId(v.id); setQty((q) => Math.min(q, v.stock ?? 20)); setErrors((e) => ({ ...e, __variant: '' })) }}>{v.value}</button>
              ))}</div>
              {errors.__variant && <em role="alert">{errors.__variant}</em>}
            </div>
          )}
          <CustomizationForm fields={p.customizationFields} values={custom} errors={errors} onChange={(k, v) => setCustom((c) => ({ ...c, [k]: v }))} />
          {p.priceCents === 0 ? (
            <div className="pdp__buy">
              {quoteUrl && !p.soldOut ? <a className="btn btn--ink" href={quoteUrl} target="_blank" rel="noreferrer">Solicitar orçamento</a> : <button className="btn btn--ink" disabled>{p.soldOut ? 'Esgotado' : 'Solicitar orçamento'}</button>}
            </div>
          ) : (
          <div className="pdp__buy">
              <div className="qty qty--lg"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir">−</button><span>{qty}</span><button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Aumentar" disabled={qty >= maxQty}>+</button></div>
              {variant?.stock != null && variant.stock > 0 && variant.stock <= 3 && <p className="pdp__stock" role="status">{variant.stock === 1 ? 'Resta 1 unidade' : `Restam ${variant.stock} unidades`}</p>}
              <button ref={addBtn} className="btn btn--ink" onClick={add} disabled={p.soldOut || stale} aria-busy={stale}>{p.soldOut ? 'Esgotado' : added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}</button>
            </div>
          )}
          <div className="pdp__links">
            {ask && <a className="btn btn--ghost adm-sm" href={ask} target="_blank" rel="noreferrer">Tirar dúvida no WhatsApp</a>}
            <ShareButton title={p.name} />
          </div>
          <ul className="pdp__trust">
            <li>Você finaliza o pedido pelo WhatsApp, direto com a loja.</li>
            <li>Pagamento e entrega combinados na conversa.</li>
            <li>Dúvida sobre tamanho, cor ou entrega? Pergunte antes de comprar.</li>
          </ul>
        </div>
      </div>
      {!!related.length && (
        <section className="container pdp__more">
          <Reveal><h2>Mais de {brand.name}</h2></Reveal>
          <div className="pgrid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
      {!!recentIds.length && <RecentlyViewed ids={recentIds} />}
    </main>
  )
}
