import { lazy, Suspense, useEffect, useState } from 'react'
import { useCart } from './cart/cartStore'
import Footer from './components/Footer'
import Header from './components/Header'
import { appCatalog } from './data/appCatalog'
import { CatalogProvider, useCatalog } from './data/CatalogProvider'
import Cursor from './fx/Cursor'
import Intro from './fx/Intro'
import PageTransition from './fx/PageTransition'
import SmoothScroll from './fx/SmoothScroll'
import AppRoutes from './router'

const CartDrawer = lazy(() => import('./components/CartDrawer'))

function PruneCart() {
  const catalog = useCatalog()
  useEffect(() => {
    catalog.listProducts({}).then((ps) => {
      const removed = useCart.getState().prune(new Set(ps.map((p) => p.id)))
      if (removed) useCart.getState().setNotice(`${removed} ${removed === 1 ? 'item saiu' : 'itens saíram'} do catálogo e foi removido do carrinho.`)
    }).catch(() => {})
  }, [catalog])
  return null
}

function LazyDrawer() {
  const open = useCart((s) => s.open)
  const [ever, setEver] = useState(false)
  useEffect(() => { if (open) setEver(true) }, [open])
  return ever ? <Suspense fallback={null}><CartDrawer /></Suspense> : null
}

export default function App() {
  const [intro, setIntro] = useState<'on' | 'leaving' | 'off'>('on')
  const done = () => { setIntro('leaving'); setTimeout(() => setIntro('off'), 750) }
  return (
    <CatalogProvider catalog={appCatalog}>
      <SmoothScroll>
        {intro !== 'off' && <div className={`intro-wrap ${intro === 'leaving' ? 'out' : ''}`}><Intro onDone={done} /></div>}
        <Header />
        <PageTransition><AppRoutes /></PageTransition>
        <Footer />
        <LazyDrawer />
        <PruneCart />
        <Cursor />
      </SmoothScroll>
    </CatalogProvider>
  )
}
