import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BRANDS } from '../brand/brands'
import Monogram from '../brand/Monogram'
import Wordmark from '../brand/Wordmark'
import { useCart } from '../cart/cartStore'
import { useAsync } from '../data/CatalogProvider'
import { useFavs } from '../store/favStore'
import { useMagnetic } from '../fx/useMagnetic'

export default function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { data: cols } = useAsync((c) => c.listCollections(), [])
  const favCount = useFavs((s) => s.ids.length)
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const [bump, setBump] = useState(false)
  const cartRef = useMagnetic<HTMLButtonElement>(0.25)
  const path = pathname.replace(/\/+$/, '') || '/'
  const dark = BRANDS.some((b) => `/${b.slug}` === path)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    if (!count) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 520)
    return () => clearTimeout(t)
  }, [count])
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : '' }, [menu])
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <>
      <header className={`hdr ${dark || menu ? 'hdr--dark' : ''} ${scrolled && !menu ? 'is-scrolled' : ''}`} style={menu ? { color: 'var(--paper)' } : undefined}>
        <Link to="/" className="hdr__logo">
          <Monogram variant={(dark && !scrolled) || menu ? 'light' : 'bare'} size={30} decorative />
          <Wordmark className="wm" />
          <span className="sr-only"> — início</span>
        </Link>
        <nav className="hdr__nav" aria-label="Principal">
          {BRANDS.map((b) => <NavLink key={b.slug} to={`/${b.slug}`} className={({ isActive }) => (isActive ? 'active' : '')}>{b.name}</NavLink>)}
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/contato">Contato</NavLink>
        </nav>
        <div className="hdr__actions">
          <Link to="/busca" className="hdr__cart hdr__search" aria-label="Buscar produtos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4" /></svg>
          </Link>
          <Link to="/favoritos" className="hdr__cart hdr__fav" aria-label={`Favoritos (${favCount})`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.7 5 6.8 5c1.9 0 3.5 1 5.2 3 1.7-2 3.3-3 5.2-3 3.1 0 5.1 2.8 4 6.1-1.7 4.8-9.2 9.4-9.2 9.4Z" /></svg>
            {favCount > 0 && <span className="hdr__badge">{favCount}</span>}
          </Link>
          <button ref={cartRef} className="hdr__cart" onClick={() => useCart.getState().setOpen(true)} onPointerEnter={() => void import('./CartDrawer')} onFocus={() => void import('./CartDrawer')} aria-label={`Abrir carrinho (${count} itens)`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {count > 0 && <span className={`hdr__badge ${bump ? 'bump' : ''}`}>{count}</span>}
          </button>
          <button className={`hdr__burger ${menu ? 'open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}><i /><i /></button>
        </div>
      </header>
      <div className={`menu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        <small>Marcas</small>
        {BRANDS.map((b, i) => <Link key={b.slug} to={`/${b.slug}`} style={{ ['--i' as string]: i }} tabIndex={menu ? 0 : -1}>{b.name}</Link>)}
        <small>Universo</small>
        <Link to="/busca" style={{ ['--i' as string]: 3 }} tabIndex={menu ? 0 : -1}>Buscar produtos</Link>
        {!!cols?.length && <Link to="/colecoes" style={{ ['--i' as string]: 4 }} tabIndex={menu ? 0 : -1}>Coleções</Link>}
        <Link to="/favoritos" style={{ ['--i' as string]: 4 }} tabIndex={menu ? 0 : -1}>Favoritos</Link>
        <Link to="/sobre" style={{ ['--i' as string]: 4 }} tabIndex={menu ? 0 : -1}>Sobre</Link>
        <Link to="/contato" style={{ ['--i' as string]: 5 }} tabIndex={menu ? 0 : -1}>Contato</Link>
      </div>
    </>
  )
}
