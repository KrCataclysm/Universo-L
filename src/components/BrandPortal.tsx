import { Link } from 'react-router-dom'
import type { Brand } from '../brand/brands'
import { asset } from '../lib/env'

export default function BrandPortal({ brand }: { brand: Brand }) {
  const src = (w: number) => asset(`produtos/${brand.cover}-${w}.webp`)
  return (
    <Link to={`/${brand.slug}`} className="uni" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }}>
      <span className="uni__frame">
        <img src={src(480)} srcSet={`${src(480)} 480w, ${src(800)} 800w`} sizes="(max-width: 900px) 96px, 33vw" alt="" width={800} height={1000} loading="lazy" decoding="async" />
      </span>
      <span className="uni__meta">
        <span className="uni__cat">{brand.category}</span>
        <h3>{brand.name}</h3>
        <span className="uni__go">Ver coleção <i>→</i></span>
      </span>
    </Link>
  )
}
