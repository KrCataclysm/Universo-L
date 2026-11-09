import { lazy, Suspense } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { usePreview } from '../data/previewStore'
import { hasSupabase } from '../lib/env'
import { AuthProvider, useAuth } from './AuthProvider'
import Login from './Login'
import './admin.css'

const ProductList = lazy(() => import('./ProductList'))
const ProductEditor = lazy(() => import('./ProductEditor'))
const Categories = lazy(() => import('./Categories'))
const Settings = lazy(() => import('./Settings'))

function Shell() {
  const { loading, session, isAdmin, signOut } = useAuth()
  const preview = usePreview()
  if (loading) return <main className="adm-login"><p>Carregando…</p></main>
  if (!session) return <Login />
  if (!isAdmin) return (
    <main className="adm-login"><div className="adm-card">
      <h1>Sem acesso</h1>
      <p>Essa conta ainda não foi liberada como administradora do painel.</p>
      <button className="btn btn--ink" onClick={signOut}>Sair</button>
    </div></main>
  )
  return (
    <div className="adm">
      <aside className="adm-side">
        <Link to="/" className="adm-brand">Universo Lay</Link>
        <nav>
          <NavLink to="/admin" end>Produtos</NavLink>
          <NavLink to="/admin/categorias">Categorias</NavLink>
          <NavLink to="/admin/configuracoes">Configurações</NavLink>
        </nav>
        <label className="adm-toggle">
          <input type="checkbox" checked={preview.enabled} onChange={(e) => preview.setEnabled(e.target.checked)} />
          <span>Ver rascunhos no site<small>Só você enxerga. Desligado = como a cliente vê.</small></span>
        </label>
        <a className="adm-link" href="https://github.com/KrCataclysm/Universo-L/actions/workflows/pages.yml" target="_blank" rel="noreferrer">↻ Publicar alterações (compartilhamento)</a>
        <Link to="/" className="adm-link">← Ver o site</Link>
        <button className="adm-link" onClick={signOut}>Sair</button>
      </aside>
      <section className="adm-main">
        <Suspense fallback={<p>Carregando…</p>}>
          <Routes>
            <Route index element={<ProductList />} />
            <Route path="produtos/:id" element={<ProductEditor />} />
            <Route path="categorias" element={<Categories />} />
            <Route path="configuracoes" element={<Settings />} />
          </Routes>
        </Suspense>
      </section>
    </div>
  )
}

export default function AdminApp() {
  if (!hasSupabase) return <main className="adm-login"><div className="adm-card"><h1>Painel indisponível</h1><p>O banco de dados não está configurado neste ambiente.</p></div></main>
  return <AuthProvider><Shell /></AuthProvider>
}
