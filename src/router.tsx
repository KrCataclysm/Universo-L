import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const About = lazy(() => import('./pages/About'))
const BrandPage = lazy(() => import('./pages/Brand'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const Search = lazy(() => import('./pages/Search'))
const Info = lazy(() => import('./pages/Info'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ProductPage = lazy(() => import('./pages/ProductPage'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<main className="page" aria-busy />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/busca" element={<Search />} />
        <Route path="/informacoes" element={<Info />} />
        <Route path="/privacidade" element={<Privacy />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/:brand" element={<BrandPage />} />
        <Route path="/:brand/:slug" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
