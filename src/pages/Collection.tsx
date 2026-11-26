import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import ShopTools from '../components/ShopTools'
import { useAsync } from '../data/CatalogProvider'
import { DEFAULT_TOOLS, applyTools, type Tools } from '../lib/sort'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import NotFound from './NotFound'

export default function Collection() {
  const { slug = '' } = useParams()
  const data = useAsync((c) => c.getCollection(slug), [slug])
  const [tools, setTools] = useState<Tools>(DEFAULT_TOOLS)
  const all = data.data?.products ?? []
  const list = useMemo(() => applyTools(all, tools), [all, tools])
  useDocumentTitle(data.data ? `${data.data.collection.name} — Coleção` : 'Coleção')
  if (!data.loading && !data.data) return <NotFound />
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Coleção</p>
          <h1>{data.data?.collection.name ?? ' '}</h1>
          {data.data?.collection.description && <p className="phead__lead">{data.data.collection.description}</p>}
        </header>
        {!!data.data && <ShopTools all={all} shown={list.length} value={tools} onChange={setTools} />}
        <ProductGrid state={{ ...data, data: data.data ? list : undefined }} emptyText="As peças desta coleção chegam em breve." />
      </div>
    </main>
  )
}
