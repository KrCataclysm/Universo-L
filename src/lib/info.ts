export interface InfoItem { key: string; setting: string; title: string; fallback: string }

/** Textos de pagamento/entrega/trocas: editáveis em Painel → Configurações; estes são os padrões até a loja preencher. */
export const INFO: InfoItem[] = [
  { key: 'pagamento', setting: 'info_pagamento', title: 'Pagamento', fallback: 'As formas de pagamento são combinadas com a loja no atendimento pelo WhatsApp.' },
  { key: 'entrega', setting: 'info_entrega', title: 'Entrega', fallback: 'A entrega é combinada na conversa, conforme o seu endereço.' },
  { key: 'prazos', setting: 'info_prazos', title: 'Prazos', fallback: 'Os prazos variam conforme a peça e a região. Combine com a loja ao finalizar o pedido pelo WhatsApp.' },
  { key: 'trocas', setting: 'info_trocas', title: 'Trocas e devoluções', fallback: 'Dúvidas sobre trocas e devoluções? Consulte a loja antes de comprar.' },
]

export function infoParagraphs(settings: Record<string, string> | undefined, item: InfoItem): string[] {
  const lines = (settings?.[item.setting] ?? '').split(/\n+/).map((l) => l.trim()).filter(Boolean)
  return lines.length ? lines : [item.fallback]
}
