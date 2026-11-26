import { useMemo, useState } from 'react'
import ShopTools from '../components/ShopTools'
import WorksGallery from '../components/WorksGallery'
import { DEFAULT_TOOLS, applyTools, type Tools } from '../lib/sort'
import { useParams } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import ProductGrid from '../components/ProductGrid'
import { useAsync, useProducts } from '../data/CatalogProvider'
import { asset } from '../lib/env'
import SplitWords from '../fx/SplitWords'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

export default function BrandPage() {
  const { brand: slug = '' } = useParams()
  const brand = getBrand(slug)
  useDocumentTitle(brand ? `${brand.name} — ${brand.category}` : 'Página não encontrada')
  const [cat, setCat] = useState<string | undefined>()
  const cats = useAsync((c) => c.listCategories(slug), [slug])
  const products = useProducts({ brandSlug: slug, categorySlug: cat })
  const [tools, setTools] = useState<Tools>(DEFAULT_TOOLS)
  const [avail, setAvail] = useState<'todas' | 'Pronta entrega' | 'Sob encomenda'>('todas')
  const base = useMemo(() => (products.data ?? []).filter((p) => avail === 'todas' || p.labels?.includes(avail)), [products.data, avail])
  const list = useMemo(() => applyTools(base, tools), [base, tools])
  const countLabel = (l: string) => (products.data ?? []).filter((p) => p.labels?.includes(l)).length
  // Falou Bordei separa sempre pronta entrega × encomenda; nas outras marcas só aparece se houver peças com o selo
  const availOpts = (['Pronta entrega', 'Sob encomenda'] as const).filter((l) => slug === 'falou-bordei' || countLabel(l) > 0)
  if (!brand) return <NotFound />
  const accent: [string, string] = [brand.accentFrom, brand.accentTo]
  return (
    <main className="page brandpage" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }}>
      <section className="bhero grain">
        <div className="bhero__bg" aria-hidden><div className="bhero__photo" style={{ backgroundImage: `url(${asset(`produtos/${brand.cover}-800.webp`)})` }} /></div>
        <div className="container bhero__content">
          <p className="eyebrow">{brand.category}</p>
          <h1><SplitWords text={brand.name} delay={200} /></h1>
          <p className="bhero__intro">{brand.intro}</p>
        </div>
      </section>
      <section className="catalog">
        <div className="container">
          <h2 className="sr-only">Produtos de {brand.name}</h2>
          {!!cats.data?.length && (
            <div className="chips" role="group" aria-label="Categorias">
              <button className={!cat ? 'on' : ''} onClick={() => setCat(undefined)}>Tudo</button>
              {cats.data.map((c) => <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setCat(c.slug)}>{c.name}</button>)}
            </div>
          )}
          {availOpts.length > 0 && (
            <div className="chips chips--avail" role="group" aria-label="Disponibilidade">
              <button className={avail === 'todas' ? 'on' : ''} aria-pressed={avail === 'todas'} onClick={() => setAvail('todas')}>Todas</button>
              {availOpts.map((l) => <button key={l} className={avail === l ? 'on' : ''} aria-pressed={avail === l} onClick={() => setAvail(l)}>{l === 'Sob encomenda' ? 'Encomendas personalizadas' : 'Pronta entrega'} <small>{countLabel(l)}</small></button>)}
            </div>
          )}
          {!!products.data && <ShopTools all={base} shown={list.length} value={tools} onChange={setTools} />}
          <ProductGrid state={{ ...products, data: products.data ? list : undefined }} accent={accent} emptyText={avail === 'Pronta entrega' ? 'Nenhuma peça de pronta entrega no momento. Veja as encomendas personalizadas.' : `As peças de ${brand.name} chegam em breve.`} />
        </div>
      </section>
      <WorksGallery brandSlug={slug} brandName={brand.name} />
    </main>
  )
}
