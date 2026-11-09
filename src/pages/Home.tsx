import { useEffect, useRef } from 'react'
import { BRANDS, CONCEPT, SLOGAN } from '../brand/brands'
import BrandPortal from '../components/BrandPortal'
import ProductGrid from '../components/ProductGrid'
import { useFeatured } from '../data/CatalogProvider'
import NeonFrames from '../fx/NeonFrames'
import Reveal from '../fx/Reveal'
import Ribbon from '../fx/Ribbon'
import SplitWords from '../fx/SplitWords'
import { prefersReducedMotion } from '../fx/motion'
import { useMagnetic } from '../fx/useMagnetic'

const STEPS = [
  ['01', 'Escolha', 'Navegue pelas três marcas e escolha as peças que combinam com você.'],
  ['02', 'Monte o carrinho', 'Selecione tamanho e cor e, nos bordados, informe a personalização.'],
  ['03', 'Finalize no WhatsApp', 'Seu pedido sai pronto na conversa com a loja para combinar pagamento e entrega.'],
]

export default function Home() {
  const hero = useRef<HTMLElement>(null)
  const cta = useMagnetic<HTMLAnchorElement>()
  const featured = useFeatured()

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches || !hero.current) return
    let dead = false
    let ctx: { revert: () => void } | undefined
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (dead || !hero.current) return
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        const st = { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('.hero__content', { yPercent: -18, opacity: 0.1, ease: 'none', scrollTrigger: st })
        gsap.to('.hero__ribbon', { yPercent: 14, ease: 'none', scrollTrigger: st })
      })
    })
    return () => { dead = true; ctx?.revert() }
  }, [])

  return (
    <main className="page home">
      <section ref={hero} className="hero grain" aria-label="Universo Lay">
        <div className="hero__ribbon"><Ribbon /></div>
        <NeonFrames from="#9FB8FF" to="#F2A7C8" layers={6} className="hero__frames" />
        <div className="hero__content container">
          <p className="eyebrow">Universo Lay</p>
          <h1><SplitWords text={SLOGAN} delay={400} /></h1>
          <p className="hero__lead">{CONCEPT}</p>
          <div className="hero__cta">
            <a ref={cta} href="#marcas" className="btn btn--glow" onClick={(e) => { e.preventDefault(); document.getElementById('marcas')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }) }}>Explorar o universo</a>
          </div>
        </div>
        <span className="hero__scroll" aria-hidden><i />rolar</span>
      </section>

      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          {[0, 1].map((k) => <div key={k} style={{ display: 'flex' }}>{Array.from({ length: 4 }, (_, i) => <span key={i}>{SLOGAN}<i>✦</i></span>)}</div>)}
        </div>
      </div>

      <section id="marcas" className="brands">
        <div className="container">
          <Reveal><p className="eyebrow">Três marcas, um só lugar</p></Reveal>
          <Reveal delay={80}><h2>Escolha seu universo</h2></Reveal>
          <div className="portals">{BRANDS.map((b, i) => <Reveal key={b.slug} delay={i * 120} className="portals__item"><BrandPortal brand={b} index={i} /></Reveal>)}</div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <Reveal><p className="eyebrow">Seleção</p></Reveal>
          <Reveal delay={80}><h2>Destaques</h2></Reveal>
          <ProductGrid state={featured} emptyText="Os destaques aparecem aqui assim que as peças forem cadastradas." />
        </div>
      </section>

      <section className="how">
        <div className="container">
          <Reveal><p className="eyebrow">Simples e direto</p></Reveal>
          <Reveal delay={80}><h2>Como comprar</h2></Reveal>
          <ol className="steps">
            {STEPS.map(([n, t, d], i) => (
              <Reveal as="li" className="step" delay={i * 120} key={n}><span className="step__n">{n}</span><h3>{t}</h3><p>{d}</p></Reveal>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
