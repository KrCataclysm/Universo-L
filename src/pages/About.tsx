import { BRANDS, CONCEPT, SLOGAN } from '../brand/brands'
import BrandPortal from '../components/BrandPortal'
import Reveal from '../fx/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const HOW = [
  ['Escolha', 'as peças das três marcas.'],
  ['Monte o carrinho', 'e, nos bordados, conte como quer.'],
  ['Finalize no WhatsApp', 'e combine pagamento e entrega com a loja.'],
]

export default function About() {
  useDocumentTitle('Sobre')
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Sobre</p>
          <h1>Universo Lay</h1>
          <p className="phead__lead phead__lead--xl">{CONCEPT}</p>
          <p className="about__slogan">{SLOGAN}</p>
        </header>
        <section aria-labelledby="marcas-h">
          <h2 id="marcas-h" className="phead__h2">Nossas marcas</h2>
          <div className="unis">{BRANDS.map((b, i) => <Reveal key={b.slug} delay={i * 90} className="unis__item"><BrandPortal brand={b} /></Reveal>)}</div>
        </section>
        <section aria-labelledby="como-h" className="aboutHow">
          <h2 id="como-h" className="phead__h2">Como funciona</h2>
          <ol className="steps">
            {HOW.map(([t, d], i) => (
              <Reveal as="li" className="step panel" delay={i * 80} key={t}>
                <span className="step__n" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span><b>{t}</b><small>{d}</small></span>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>
    </main>
  )
}
