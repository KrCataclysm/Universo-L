import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from './cart/cartStore'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import { CatalogProvider, useCatalog } from './data/CatalogProvider'
import Cursor from './fx/Cursor'
import Intro from './fx/Intro'
import PageTransition from './fx/PageTransition'
import SmoothScroll from './fx/SmoothScroll'
import AppRoutes from './router'

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

export default function App() {
  const [intro, setIntro] = useState(true)
  return (
    <CatalogProvider>
      <SmoothScroll>
        <AnimatePresence>
          {intro && <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.7 }} style={{ position: 'fixed', inset: 0, zIndex: 10000 }}><Intro onDone={() => setIntro(false)} /></motion.div>}
        </AnimatePresence>
        <Header />
        <PageTransition><AppRoutes /></PageTransition>
        <Footer />
        <CartDrawer />
        <PruneCart />
        <Cursor />
      </SmoothScroll>
    </CatalogProvider>
  )
}
