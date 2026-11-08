import { Link } from 'react-router-dom'
import { BRANDS, CONCEPT, SLOGAN } from '../brand/brands'
import Reveal from '../fx/Reveal'

export default function About() {
  return (
    <main className="page about">
      <div className="container">
        <Reveal><p className="eyebrow">Sobre</p></Reveal>
        <Reveal delay={80}><h1>Universo Lay</h1></Reveal>
        <Reveal delay={160}><p className="about__lead">{CONCEPT}</p></Reveal>
        <Reveal delay={200}><p className="about__slogan">{SLOGAN}</p></Reveal>
        <div className="about__brands">
          {BRANDS.map((b, i) => (
            <Reveal key={b.slug} delay={i * 100}>
              <Link to={`/${b.slug}`} className="abrand" style={{ ['--a' as string]: b.accentFrom, ['--b' as string]: b.accentTo }}>
                <span className="eyebrow">{b.category}</span><h3>{b.name}</h3><span>Conhecer →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  )
}
