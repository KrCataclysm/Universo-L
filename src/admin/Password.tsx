import { useState } from 'react'
import { getSupabase } from '../lib/supabase'
import PasswordField from './PasswordField'
import { validateNewPassword } from './validators'

export default function Password() {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null)
    const bad = validateNewPassword(pw, confirm)
    if (bad) return setMsg({ ok: false, text: bad })
    setBusy(true)
    const { error } = await getSupabase().auth.updateUser({ password: pw })
    setBusy(false)
    if (error) return setMsg({ ok: false, text: 'Não foi possível trocar a senha agora. Saia, entre de novo e tente outra vez.' })
    setPw(''); setConfirm('')
    setMsg({ ok: true, text: 'Senha trocada! Use a nova senha nos próximos acessos.' })
  }
  return (
    <>
      <header className="adm-head"><h1>Trocar minha senha</h1></header>
      <form className="adm-card" onSubmit={save}>
        <p className="adm-note">Escolha uma senha só sua, com pelo menos 8 caracteres, letras e números. Não compartilhe com ninguém.</p>
        <PasswordField label="Nova senha" autoComplete="new-password" value={pw} onChange={setPw} />
        <PasswordField label="Repita a nova senha" autoComplete="new-password" value={confirm} onChange={setConfirm} />
        {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
        <button className="btn btn--ink" disabled={busy}>{busy ? 'Salvando…' : 'Trocar senha'}</button>
      </form>
    </>
  )
}
