import { Link } from 'react-router-dom'
import { BRANDS } from '../brand/brands'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Página não encontrada')
  return (
    <main className="page nf404">
      <div className="nf404__txt container">
        <p className="nf404__code" aria-hidden>404</p>
        <p className="eyebrow">Página não encontrada</p>
        <h1>Essa peça saiu da vitrine</h1>
        <p className="nf404__lead">A página que você procura não existe ou foi movida. Veja as marcas ou volte ao início.</p>
        <div className="nf404__links">
          <Link className="btn btn--ink btn--arrow" to="/">Voltar ao início</Link>
          {BRANDS.map((b) => <Link key={b.slug} className="btn btn--ghost" to={`/${b.slug}`}>{b.name}</Link>)}
        </div>
      </div>
    </main>
  )
}
