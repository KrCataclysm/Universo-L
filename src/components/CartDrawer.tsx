import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { itemKey, useCart } from '../cart/cartStore'
import { formatBRL } from '../cart/money'
import { buildWhatsAppUrl } from '../cart/whatsapp'
import { useAsync } from '../data/CatalogProvider'

export default function CartDrawer() {
  const { items, open, notice, setOpen, setQty, remove, setNotice } = useCart()
  const total = useCart((s) => s.totalCents())
  const [name, setName] = useState('')
  const { data: settings } = useAsync((c) => c.getSettings(), [])
  const res = buildWhatsAppUrl({ phone: settings?.whatsapp_number, customerName: name, items })
  const preview = res.reason === 'no-phone' && items.length ? decodeURIComponent(buildWhatsAppUrl({ phone: '0', customerName: name, items }).url!.split('?text=')[1]) : null
  const hint = res.reason === 'no-phone' ? 'O número de WhatsApp da loja ainda não foi configurado.' : res.reason === 'empty' ? '' : res.truncated ? 'Seu pedido é grande: enviamos um resumo e você confirma o restante pela conversa.' : ''
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="drawer__veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrinho"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
            <header className="drawer__head">
              <h2>Seu carrinho</h2>
              <button onClick={() => setOpen(false)} aria-label="Fechar carrinho">✕</button>
            </header>
            {notice && <p className="drawer__notice" role="status">{notice} <button onClick={() => setNotice(null)}>ok</button></p>}
            <div className="drawer__list">
              {!items.length && <p className="drawer__empty">Seu carrinho está vazio.<br />Escolha uma peça e ela aparece aqui.</p>}
              <AnimatePresence initial={false}>
                {items.map((i) => {
                  const k = itemKey(i)
                  return (
                    <motion.div layout key={k} className="citem" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 40 }}>
                      <div>
                        <strong>{i.name}</strong>
                        {i.variantLabel && <small>Tamanho/opção: {i.variantLabel}</small>}
                        {i.custom && Object.entries(i.custom).filter(([, v]) => v).map(([lk, v]) => <small key={lk}>{lk}: {v}</small>)}
                        <div className="qty">
                          <button onClick={() => setQty(k, i.qty - 1)} aria-label="Diminuir">−</button>
                          <span>{i.qty}</span>
                          <button onClick={() => setQty(k, i.qty + 1)} aria-label="Aumentar">+</button>
                          <button className="citem__rm" onClick={() => remove(k)}>remover</button>
                        </div>
                      </div>
                      <span>{formatBRL(i.unitPriceCents * i.qty)}</span>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <footer className="drawer__foot">
              <label className="field"><span>Seu nome (opcional)</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></label>
              <div className="drawer__total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
              {hint && <p className="drawer__hint">{hint}</p>}
              {preview && <details className="drawer__preview"><summary>Ver prévia da mensagem do pedido</summary><pre>{preview}</pre></details>}
              {res.url
                ? <a className="btn btn--glow" href={res.url} target="_blank" rel="noreferrer">Finalizar no WhatsApp</a>
                : <button className="btn btn--glow" disabled>Finalizar no WhatsApp</button>}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
