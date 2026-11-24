/** 558699463019 → "+55 (86) 9946-3019"; formato desconhecido volta só com dígitos. */
export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, '')
  const m = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/)
  return m ? `+55 (${m[1]}) ${m[2]}-${m[3]}` : d
}

/** https://instagram.com/lay.store → "@lay.store"; inválido → "". */
export function igHandle(url: string | undefined): string {
  const m = (url ?? '').match(/^https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]+)\/?$/i)
  return m ? `@${m[1]}` : ''
}
