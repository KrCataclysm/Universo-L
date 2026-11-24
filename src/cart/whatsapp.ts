import { formatBRL } from './money'
import type { CartItem } from './cartStore'

export const MAX_URL = 1900

export interface WhatsAppResult { url: string | null; truncated: boolean; reason?: 'empty' | 'no-phone' }

const lineFor = (i: CartItem, n: number): string => {
  const price = i.unitPriceCents > 0 ? formatBRL(i.unitPriceCents * i.qty) : 'sob consulta'
  const head = `${n}. ${i.qty}x ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ''} — ${price}`
  const extra = i.custom ? Object.entries(i.custom).filter(([, v]) => v.trim()).map(([k, v]) => `   ${k}: ${v}`) : []
  return [head, ...extra].join('\n')
}

export function buildWhatsAppUrl(args: { phone: string | undefined; customerName?: string; items: CartItem[] }): WhatsAppResult {
  const digits = (args.phone ?? '').replace(/\D/g, '')
  if (!digits) return { url: null, truncated: false, reason: 'no-phone' }
  if (!args.items.length) return { url: null, truncated: false, reason: 'empty' }

  const total = args.items.reduce((s, i) => s + i.unitPriceCents * i.qty, 0)
  const name = args.customerName?.trim()
  const header = `Olá! Quero fazer um pedido no Universo Lay${name ? ` (${name})` : ''}:\n\n`
  const quoted = args.items.filter((i) => i.unitPriceCents === 0).length
  const totalLine = quoted === 0 ? `Total: ${formatBRL(total)}` : quoted === args.items.length ? 'Valor: a combinar' : `Total dos itens com preço: ${formatBRL(total)} (itens sob consulta a combinar)`
  const footer = `\n\n${totalLine}${name ? `\nNome: ${name}` : ''}`
  const lines = args.items.map((i, k) => lineFor(i, k + 1))
  const mk = (msg: string) => `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`

  const full = mk(header + lines.join('\n\n') + footer)
  if (full.length <= MAX_URL) return { url: full, truncated: false }

  for (let keep = lines.length - 1; keep >= 0; keep--) {
    const rest = lines.length - keep
    const note = `… e mais ${rest} ${rest === 1 ? 'item' : 'itens'} (lista resumida — envio o restante por aqui)`
    const msg = header + [...lines.slice(0, keep), note].join('\n\n') + footer
    const url = mk(msg)
    if (url.length <= MAX_URL) return { url, truncated: true }
  }
  return { url: mk(`Olá! Quero fazer um pedido no Universo Lay. ${totalLine} (lista resumida)`), truncated: true }
}
