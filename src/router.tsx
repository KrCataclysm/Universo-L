import { Route, Routes } from 'react-router-dom'
import About from './pages/About'
import BrandPage from './pages/Brand'
import Contact from './pages/Contact'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductPage from './pages/ProductPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/:brand" element={<BrandPage />} />
      <Route path="/:brand/:slug" element={<ProductPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
