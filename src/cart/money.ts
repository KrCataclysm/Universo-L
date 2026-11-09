const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatBRL = (cents: number): string => fmt.format(cents / 100)

/** "19,90" | "19,9" | "1.234,50" | "20" → centavos inteiros; inválido/negativo → null */
export function parsePriceToCents(input: string): number | null {
  let s = input.replace(/R\$|\s/g, '')
  if (!s) return null
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null
  return Math.round(parseFloat(s) * 100)
}
