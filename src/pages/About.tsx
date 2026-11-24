import { Link } from 'react-router-dom'
import { BRANDS, CONCEPT, SLOGAN } from '../brand/brands'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import { asset } from '../lib/env'
import { igHandle } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function About() {
  useDocumentTitle('Sobre')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const ig = (slug: string) => s?.[`instagram_${slug.replace(/-/g, '_')}`]
  return (
    <main className="page about">
      <div className="container">
        <Reveal><p className="eyebrow">Sobre</p></Reveal>
        <Reveal delay={80}><h1>Universo Lay</h1></Reveal>
        <Reveal delay={160}><p className="about__lead">{CONCEPT}</p></Reveal>
        <Reveal delay={200}><p className="about__slogan">{SLOGAN}</p></Reveal>
        <h2 className="sr-only">Nossas marcas</h2>
        <div className="about__brands">
          {BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={i * 100}>
              <Link to={`/${b.slug}`} className="abrand" style={{ ['--a' as string]: b.accentFrom, ['--b' as string]: b.accentTo }}>
                <span className="abrand__photo" style={{ backgroundImage: `url(${asset(`produtos/${b.cover}-800.webp`)})` }} aria-hidden />
                <span className="eyebrow">{b.category}</span><h3>{b.name}</h3>
                {igHandle(ig(b.slug)) && <small>{igHandle(ig(b.slug))}</small>}
                <span>Conhecer →</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <ol className="about__how">
            <li><b>Escolha</b> as peças das três marcas.</li>
            <li><b>Monte o carrinho</b> e, nos bordados, conte como quer.</li>
            <li><b>Finalize no WhatsApp</b> e combine pagamento e entrega com a loja.</li>
          </ol>
        </Reveal>
      </div>
    </main>
  )
}
