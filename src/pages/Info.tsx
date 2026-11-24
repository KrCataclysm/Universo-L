import { useRef } from 'react'
import { useAsync } from '../data/CatalogProvider'
import { INFO, infoParagraphs } from '../lib/info'
import { useToc } from '../lib/useToc'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { DocNav } from '../components/DocNav'

export default function Info() {
  useDocumentTitle('Pagamento, entrega e trocas')
  const { data } = useAsync((c) => c.getSettings(), [])
  const body = useRef<HTMLDivElement>(null)
  const toc = useToc(body, [data])
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Informações</p>
          <h1>Pagamento, entrega e trocas</h1>
          <p className="phead__lead">Tudo o que você precisa saber antes de comprar. Dúvidas? É só chamar a loja no WhatsApp.</p>
        </header>
        <div className="doc">
          <DocNav items={toc} />
          <div className="doc__body prose" ref={body}>
            {INFO.map((i, n) => (
              <section key={i.key} id={i.key} className="panel">
                <span className="panel__n">{String(n + 1).padStart(2, '0')}</span>
                <h2>{i.title}</h2>
                {infoParagraphs(data, i).map((l, k) => <p key={k}>{l}</p>)}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
