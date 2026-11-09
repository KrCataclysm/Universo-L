import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const BrandPage = lazy(() => import('./pages/Brand'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ProductPage = lazy(() => import('./pages/ProductPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<main className="page" aria-busy />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/:brand" element={<BrandPage />} />
        <Route path="/:brand/:slug" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
