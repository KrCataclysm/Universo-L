import { Link } from 'react-router-dom'
import { BRANDS, HERO_LEAD, SLOGAN } from '../brand/brands'
import BannerSlot from '../components/BannerSlot'
import BrandPortal from '../components/BrandPortal'
import ProductGrid from '../components/ProductGrid'
import { useAsync, useProducts } from '../data/CatalogProvider'
import NeonFrames from '../fx/NeonFrames'
import Reveal from '../fx/Reveal'
import SplitWords from '../fx/SplitWords'
import { useMagnetic } from '../fx/useMagnetic'
import { asset } from '../lib/env'
import { igHandle } from '../lib/format'
import { INFO, infoParagraphs } from '../lib/info'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const STEPS = [
  { t: 'Escolha suas peças', d: 'Navegue pelas marcas.', icon: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" /> },
  { t: 'Monte seu carrinho', d: 'Selecione cor ou tamanho.', icon: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></> },
  { t: 'Finalize pelo WhatsApp', d: 'Combine pagamento e entrega.', icon: <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.6-4A8 8 0 1 1 20 11.5Z" /> },
]

const Head = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <>
    <Reveal><p className="eyebrow">{eyebrow}</p></Reveal>
    <Reveal delay={60}><h2>{title}</h2></Reveal>
  </>
)

export default function Home() {
  useDocumentTitle()
  const cta = useMagnetic<HTMLAnchorElement>()
  const all = useProducts({})
  const settings = useAsync((c) => c.getSettings(), [])
  const news = { ...all, data: all.data?.filter((p) => p.labels?.includes('Novidade')).slice(0, 4) }
  const featured = { ...all, data: all.data?.filter((p) => p.featured).slice(0, 4) }
  const igs = BRANDS.map((b) => ({ b, url: settings.data?.[`instagram_${b.slug.replace(/-/g, '_')}`] })).filter((x) => igHandle(x.url))

  return (
    <main className="page home">
      <section className="hero" aria-label="Universo Lay">
        <div className="hero__glow" aria-hidden />
        <NeonFrames from="#9FB8FF" to="#F2A7C8" layers={3} className="hero__frames" />
        <div className="hero__collage" aria-hidden>
          {BRANDS.map((b) => <img key={b.slug} src={asset(`produtos/${b.cover}-480.webp`)} alt="" width={480} height={600} loading="lazy" decoding="async" />)}
        </div>
        <div className="hero__content container">
          <h1><SplitWords text={SLOGAN} delay={300} /></h1>
          <p className="hero__lead">{HERO_LEAD}</p>
          <a ref={cta} href="#marcas" className="btn btn--glow" onClick={(e) => { e.preventDefault(); document.getElementById('marcas')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }}>Conheça nossas marcas</a>
        </div>
      </section>

      <section id="marcas" className="sec brands">
        <div className="container">
          <Head eyebrow="Três marcas, um só lugar" title="Escolha seu universo" />
          <div className="portals">{BRANDS.map((b, i) => <Reveal key={b.slug} delay={i * 90} className="portals__item"><BrandPortal brand={b} /></Reveal>)}</div>
        </div>
      </section>

      {!!news.data?.length && (
        <section className="sec">
          <div className="container">
            <Head eyebrow="Acabou de chegar" title="Novidades e lançamentos" />
            <ProductGrid state={news} more={{ to: '/busca', label: 'Ver todas as peças' }} />
          </div>
        </section>
      )}

      <section className="sec featured">
        <div className="container">
          <Head eyebrow="Seleção" title="Produtos em destaque" />
          <ProductGrid state={featured} emptyText="Os destaques aparecem aqui assim que as peças forem cadastradas." />
        </div>
      </section>

      <BannerSlot />

      <section className="sec how">
        <div className="container">
          <Head eyebrow="Simples e direto" title="Como comprar" />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" className="step" delay={i * 80} key={s.t}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                <span><b>{i + 1}. {s.t}</b><small>{s.d}</small></span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec info">
        <div className="container">
          <Head eyebrow="Compra tranquila" title="Pagamento e entrega" />
          <div className="info__grid">
            {INFO.filter((i) => i.key !== 'prazos').map((i) => (
              <Reveal key={i.key} className="info__card">
                <h3>{i.title}</h3>
                <p>{infoParagraphs(settings.data, i)[0]}</p>
                <Link to={`/informacoes#${i.key}`}>Ver detalhes</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {!!igs.length && (
        <section className="sec social">
          <div className="container">
            <Head eyebrow="Redes sociais" title="Siga no Instagram" />
            <ul className="social__list">
              {igs.map(({ b, url }) => (
                <Reveal as="li" key={b.slug} className="social__item">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" /></svg>
                  <span><b>{b.name}</b><small>{igHandle(url)}</small></span>
                  <a className="btn btn--ghost" href={url} target="_blank" rel="noreferrer" aria-label={`Seguir ${igHandle(url)} no Instagram`}>Seguir</a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
