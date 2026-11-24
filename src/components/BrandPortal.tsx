import { Link } from 'react-router-dom'
import type { Brand } from '../brand/brands'
import NeonFrames from '../fx/NeonFrames'
import { useTilt } from '../fx/useTilt'
import { asset } from '../lib/env'

export default function BrandPortal({ brand }: { brand: Brand }) {
  const tilt = useTilt(4)
  return (
    <Link to={`/${brand.slug}`} className="portal" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }} {...tilt}>
      <span className="portal__photo" style={{ backgroundImage: `url(${asset(`produtos/${brand.cover}-800.webp`)})` }} aria-hidden />
      <NeonFrames from={brand.accentFrom} to={brand.accentTo} layers={2} animate={false} className="portal__art" />
      <div className="portal__body">
        <span className="eyebrow">{brand.category}</span>
        <h3>{brand.name}</h3>
        <span className="portal__go">Ver coleção <i>→</i></span>
      </div>
    </Link>
  )
}
