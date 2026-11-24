import { Link } from 'react-router-dom'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'

/** Espaço de campanha/coleção/data comemorativa: editável em Painel → Banners. Sem banner ativo, não aparece. */
export default function BannerSlot() {
  const { data } = useAsync((c) => c.listBanners(), [])
  const b = data?.[0]
  if (!b) return null
  const external = /^https?:\/\//.test(b.linkUrl)
  const inner = (
    <>
      {b.imageUrl && <span className="banner__img" style={{ backgroundImage: `url(${b.imageUrl})` }} aria-hidden />}
      <span className="banner__txt">
        <strong>{b.title}</strong>
        {b.subtitle && <span>{b.subtitle}</span>}
        {b.ctaLabel && <em>{b.ctaLabel} →</em>}
      </span>
    </>
  )
  return (
    <section className="sec banner">
      <div className="container">
        <Reveal>
          {b.linkUrl
            ? external ? <a className="banner__card" href={b.linkUrl} target="_blank" rel="noreferrer">{inner}</a> : <Link className="banner__card" to={b.linkUrl}>{inner}</Link>
            : <div className="banner__card">{inner}</div>}
        </Reveal>
      </div>
    </section>
  )
}
