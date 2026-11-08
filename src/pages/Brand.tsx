import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBrand } from '../brand/brands'
import ProductGrid from '../components/ProductGrid'
import { useAsync, useProducts } from '../data/CatalogProvider'
import NeonFrames from '../fx/NeonFrames'
import Ribbon from '../fx/Ribbon'
import SplitWords from '../fx/SplitWords'
import NotFound from './NotFound'

export default function BrandPage() {
  const { brand: slug = '' } = useParams()
  const brand = getBrand(slug)
  const [cat, setCat] = useState<string | undefined>()
  const cats = useAsync((c) => c.listCategories(slug), [slug])
  const products = useProducts({ brandSlug: slug, categorySlug: cat })
  if (!brand) return <NotFound />
  const accent: [string, string] = [brand.accentFrom, brand.accentTo]
  return (
    <main className="page brandpage" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }}>
      <section className="bhero grain">
        <div className="bhero__bg"><Ribbon accent={accent} /></div>
        <NeonFrames from={brand.accentFrom} to={brand.accentTo} layers={5} className="bhero__frames" />
        <div className="container bhero__content">
          <p className="eyebrow">{brand.category}</p>
          <h1><SplitWords text={brand.name} delay={200} /></h1>
        </div>
      </section>
      <section className="catalog">
        <div className="container">
          {!!cats.data?.length && (
            <div className="chips" role="group" aria-label="Categorias">
              <button className={!cat ? 'on' : ''} onClick={() => setCat(undefined)}>Tudo</button>
              {cats.data.map((c) => <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setCat(c.slug)}>{c.name}</button>)}
            </div>
          )}
          <ProductGrid state={products} accent={accent} emptyText={`As peças de ${brand.name} chegam em breve.`} />
        </div>
      </section>
    </main>
  )
}
