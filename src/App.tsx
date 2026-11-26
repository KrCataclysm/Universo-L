import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from './cart/cartStore'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import Header from './components/Header'
import { appCatalog } from './data/appCatalog'
import { CatalogProvider, useCatalog } from './data/CatalogProvider'
import PageTransition from './fx/PageTransition'
import SmoothScroll from './fx/SmoothScroll'
import AppRoutes from './router'
import Toaster from './ui/Toaster'
import BackToTop from './components/BackToTop'
import { useQuick } from './store/quick'
import { toast } from './ui/toast'

const CartDrawer = lazy(() => import('./components/CartDrawer'))

function PruneCart() {
  const catalog = useCatalog()
  useEffect(() => {
    catalog.listProducts({}).then((ps) => {
      const removed = useCart.getState().prune(new Set(ps.map((p) => p.id)))
      if (removed) toast({ tone: 'warn', title: removed === 1 ? 'Um item saiu do catálogo' : `${removed} itens saíram do catálogo`, text: 'Já foi removido do seu carrinho.', ms: 6500 })
    }).catch(() => {})
  }, [catalog])
  return null
}

const QuickView = lazy(() => import('./components/QuickView'))
function LazyQuick() {
  const ever = useQuick((s) => s.ever)
  return ever ? <Suspense fallback={null}><QuickView /></Suspense> : null
}

function LazyDrawer() {
  const open = useCart((s) => s.open)
  const [ever, setEver] = useState(false)
  useEffect(() => { if (open) setEver(true) }, [open])
  return ever ? <Suspense fallback={null}><CartDrawer /></Suspense> : null
}

function Site() {
  return (
    <CatalogProvider catalog={appCatalog}>
      <SmoothScroll>
        <a className="skip" href="#main">Pular para o conteúdo</a>
        <div className="topbar" role="note">Escolha suas peças e finalize o pedido pelo WhatsApp</div>
        <Header />
        <PageTransition><div id="main" tabIndex={-1} className="main-anchor"><AppRoutes /></div></PageTransition>
        <Footer />
        <WhatsAppFab />
        <LazyQuick />
        <BackToTop />
        <Toaster />
        <LazyDrawer />
        <PruneCart />
      </SmoothScroll>
    </CatalogProvider>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const admin = pathname === '/admin' || pathname.startsWith('/admin/')
  return admin ? <CatalogProvider catalog={appCatalog}><AppRoutes /></CatalogProvider> : <Site />
}
