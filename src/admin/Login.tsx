import { useState } from 'react'
import Monogram from '../brand/Monogram'
import { useAuth } from './AuthProvider'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null)
    setErr(await signIn(email, password)); setBusy(false)
  }
  return (
    <main className="adm-login">
      <form onSubmit={submit} className="adm-card">
        <Monogram variant="ink" size={72} />
        <h1>Painel Universo Lay</h1>
        <label className="field"><span>E-mail</span><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="field"><span>Senha</span><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {err && <p className="adm-err" role="alert">{err}</p>}
        <button className="btn btn--ink" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </main>
  )
}
