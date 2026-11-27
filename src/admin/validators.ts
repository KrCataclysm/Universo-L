/** Número do WhatsApp → só dígitos com DDI 55; inválido → null. */
export function normalizeWhatsApp(input: string): string | null {
  const d = input.replace(/\D/g, '')
  if ((d.length === 12 || d.length === 13) && d.startsWith('55')) return d
  if (d.length === 10 || d.length === 11) return `55${d}`
  return null
}

/** Usuário/@/link do Instagram → URL canônica; vazio → '' (remover); inválido → null. */
export function normalizeInstagram(input: string): string | null {
  const v = input.trim()
  if (!v) return ''
  const url = v.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/i)
  if (url) return `https://instagram.com/${url[1]}`
  const handle = v.match(/^@?([A-Za-z0-9._]{1,30})$/)
  return handle ? `https://instagram.com/${handle[1]}` : null
}

/** Valida a nova senha do painel. Devolve a mensagem de erro, ou null se estiver ok. */
export function validateNewPassword(pw: string, confirm: string): string | null {
  if (pw.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
  if (!/[A-Za-zÀ-ÿ]/.test(pw) || !/\d/.test(pw)) return 'Use letras e números na senha.'
  if (pw !== confirm) return 'As duas senhas não são iguais.'
  return null
}
