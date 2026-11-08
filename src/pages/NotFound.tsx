import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NeonFrames from '../fx/NeonFrames'

export default function NotFound() {
  useEffect(() => {
    document.documentElement.classList.add('tone-dark')
    return () => document.documentElement.classList.remove('tone-dark')
  }, [])
  return (
    <main className="page nf404 grain">
      <NeonFrames layers={6} className="nf404__art" />
      <div className="nf404__txt">
        <p className="eyebrow">Erro 404</p>
        <h1>Essa estrela saiu da órbita</h1>
        <p>A página que você procura não existe ou foi movida.</p>
        <Link className="btn btn--glow" to="/">Voltar ao universo</Link>
      </div>
    </main>
  )
}
