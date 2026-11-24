import { Link } from 'react-router-dom'
import type { Brand } from '../brand/brands'
import NeonFrames from '../fx/NeonFrames'
import { asset } from '../lib/env'
import { useTilt } from '../fx/useTilt'

export default function BrandPortal({ brand, index }: { brand: Brand; index: number }) {
  const tilt = useTilt(5)
  return (
    <Link to={`/${brand.slug}`} className="portal" style={{ ['--a' as string]: brand.accentFrom, ['--b' as string]: brand.accentTo }} {...tilt}>
      <span className="portal__photo" style={{ backgroundImage: `url(${asset(`produtos/${brand.slug}-1.webp`)})` }} aria-hidden />
      <NeonFrames from={brand.accentFrom} to={brand.accentTo} layers={5} animate={false} className="portal__art" />
      <span className="portal__n">0{index + 1}</span>
      <div className="portal__body">
        <span className="eyebrow">{brand.category}</span>
        <h3>{brand.name}</h3>
        <span className="portal__go">Entrar <i>→</i></span>
      </div>
    </Link>
  )
}
