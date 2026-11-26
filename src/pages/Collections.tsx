import { Link } from 'react-router-dom'
import Reveal from '../fx/Reveal'
import { useAsync } from '../data/CatalogProvider'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Collections() {
  useDocumentTitle('Coleções')
  const cols = useAsync((c) => c.listCollections(), [])
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Seleções da loja</p>
          <h1>Coleções</h1>
          <p className="phead__lead">Peças reunidas por tema, de qualquer uma das três marcas.</p>
        </header>
        {cols.loading && !cols.data ? <div className="pgrid">{Array.from({ length: 3 }, (_, k) => <div key={k} className="pcard pcard--skel" aria-hidden />)}</div>
          : !cols.data?.length ? <div className="empty" role="status"><h2 className="sr-only">Coleções</h2><h3>Em breve</h3><p>As coleções aparecem aqui assim que forem criadas.</p></div>
          : (
            <ul className="colls">
              {cols.data.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 70}>
                  <Link to={`/colecao/${c.slug}`} className="coll panel">
                    {c.imageUrl && <img src={c.imageUrl} alt="" loading="lazy" decoding="async" width={640} height={400} />}
                    <span className="coll__body">
                      <span className="coll__n">{c.count} {c.count === 1 ? 'peça' : 'peças'}</span>
                      <h2>{c.name}</h2>
                      {c.description && <p>{c.description}</p>}
                      <span className="coll__go">Ver coleção <i>→</i></span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
      </div>
    </main>
  )
}
