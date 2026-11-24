import { useEffect, useState } from 'react'
import { loadSettings, saveSetting } from './adminApi'
import { normalizeInstagram, normalizeWhatsApp } from './validators'

const TXT = [['info_pagamento', 'Pagamento (formas aceitas)'], ['info_entrega', 'Entrega'], ['info_prazos', 'Prazos'], ['info_trocas', 'Trocas e devoluções']] as const
const LOJA = [['loja_razao_social', 'Razão social (política de privacidade)'], ['loja_cnpj', 'CNPJ'], ['loja_email', 'E-mail da loja']] as const
const IG = [['instagram_lay_store', 'Instagram — Lay.Store'], ['instagram_ousada_delicada', 'Instagram — Ousada Delicada'], ['instagram_falou_bordei', 'Instagram — Falou Bordei']] as const

export default function Settings() {
  const [v, setV] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  useEffect(() => { loadSettings().then(setV).catch((e) => setMsg({ ok: false, text: e.message })) }, [])
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null)
    const wa = (v.whatsapp_number ?? '').trim() ? normalizeWhatsApp(v.whatsapp_number) : ''
    if (wa === null) return setMsg({ ok: false, text: 'WhatsApp inválido. Use DDD + número, ex.: (11) 99999-9999.' })
    const igs: [string, string][] = []
    for (const [k, label] of IG) {
      const n = normalizeInstagram(v[k] ?? '')
      if (n === null) return setMsg({ ok: false, text: `${label}: use @usuario ou o link do perfil.` })
      igs.push([k, n])
    }
    try {
      await saveSetting('whatsapp_number', wa)
      for (const [k] of [...TXT, ...LOJA]) await saveSetting(k, (v[k] ?? '').trim())
      for (const [k, n] of igs) await saveSetting(k, n)
      setV((s) => ({ ...s, whatsapp_number: wa, ...Object.fromEntries(igs) }))
      setMsg({ ok: true, text: 'Configurações salvas!' })
    } catch (er) { setMsg({ ok: false, text: (er as Error).message }) }
  }
  return (
    <>
      <header className="adm-head"><h1>Configurações</h1></header>
      <form className="adm-card" onSubmit={save}>
        <label className="field"><span>WhatsApp da loja (recebe os pedidos)</span><input inputMode="tel" value={v.whatsapp_number ?? ''} onChange={(e) => setV((s) => ({ ...s, whatsapp_number: e.target.value }))} placeholder="(11) 99999-9999" /></label>
        {IG.map(([k, label]) => <label className="field" key={k}><span>{label}</span><input value={v[k] ?? ''} onChange={(e) => setV((s) => ({ ...s, [k]: e.target.value }))} placeholder="@usuario" /></label>)}
        <h2>Pagamento, entrega e trocas</h2>
        <p className="adm-note">Aparecem na página inicial, em “Pagamento, entrega e trocas” e no rodapé. Uma linha por parágrafo. Vazio = texto padrão.</p>
        {TXT.map(([k, label]) => <label className="field" key={k}><span>{label}</span><textarea rows={3} value={v[k] ?? ''} onChange={(e) => setV((s) => ({ ...s, [k]: e.target.value }))} /></label>)}
        <h2>Dados da loja (política de privacidade)</h2>
        {LOJA.map(([k, label]) => <label className="field" key={k}><span>{label}</span><input value={v[k] ?? ''} onChange={(e) => setV((s) => ({ ...s, [k]: e.target.value }))} /></label>)}
        {msg && <p className={msg.ok ? 'adm-ok' : 'adm-err'} role={msg.ok ? 'status' : 'alert'}>{msg.text}</p>}
        <button className="btn btn--ink">Salvar</button>
      </form>
    </>
  )
}
