import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BRANDS } from '../brand/brands'
import Monogram from '../brand/Monogram'
import Wordmark from '../brand/Wordmark'
import { useCart } from '../cart/cartStore'
import { useMagnetic } from '../fx/useMagnetic'

export default function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const [bump, setBump] = useState(false)
  const cartRef = useMagnetic<HTMLButtonElement>(0.25)
  const dark = pathname === '/' || BRANDS.some((b) => `/${b.slug}` === pathname)

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

  return (
    <>
      <header className={`hdr ${dark || menu ? 'hdr--dark' : ''} ${scrolled && !menu ? 'is-scrolled' : ''}`} style={menu ? { color: 'var(--paper)' } : undefined}>
        <Link to="/" className="hdr__logo" aria-label="Universo Lay — início">
          <Monogram variant={(dark && !scrolled) || menu ? 'light' : 'bare'} size={40} />
          <Wordmark className="wm" />
        </Link>
        <nav className="hdr__nav" aria-label="Principal">
          {BRANDS.map((b) => <NavLink key={b.slug} to={`/${b.slug}`} className={({ isActive }) => (isActive ? 'active' : '')}>{b.name}</NavLink>)}
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/contato">Contato</NavLink>
        </nav>
        <div className="hdr__actions">
          <button ref={cartRef} className="hdr__cart" onClick={() => useCart.getState().setOpen(true)} aria-label={`Abrir carrinho (${count} itens)`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>
            {count > 0 && <span className={`hdr__badge ${bump ? 'bump' : ''}`}>{count}</span>}
          </button>
          <button className={`hdr__burger ${menu ? 'open' : ''}`} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}><i /><i /></button>
        </div>
      </header>
      <div className={`menu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        <small>Marcas</small>
        {BRANDS.map((b, i) => <Link key={b.slug} to={`/${b.slug}`} style={{ ['--i' as string]: i }} tabIndex={menu ? 0 : -1}>{b.name}</Link>)}
        <small>Universo</small>
        <Link to="/sobre" style={{ ['--i' as string]: 3 }} tabIndex={menu ? 0 : -1}>Sobre</Link>
        <Link to="/contato" style={{ ['--i' as string]: 4 }} tabIndex={menu ? 0 : -1}>Contato</Link>
      </div>
    </>
  )
}
