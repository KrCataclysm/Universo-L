import { useAsync } from '../data/CatalogProvider'
import { INFO, infoParagraphs } from '../lib/info'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Info() {
  useDocumentTitle('Pagamento, entrega e trocas')
  const { data } = useAsync((c) => c.getSettings(), [])
  return (
    <main className="page about">
      <div className="container prose">
        <p className="eyebrow">Informações</p>
        <h1>Pagamento, entrega e trocas</h1>
        {INFO.map((i) => (
          <section key={i.key} id={i.key}>
            <h2>{i.title}</h2>
            {infoParagraphs(data, i).map((l, n) => <p key={n}>{l}</p>)}
          </section>
        ))}
      </div>
    </main>
  )
}
