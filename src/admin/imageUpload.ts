export class ImageRejected extends Error {}

export const MAX_BYTES = 15 * 1024 * 1024

export function validateImageFile(f: { type: string; size: number }): void {
  if (!f.type.startsWith('image/')) throw new ImageRejected('Esse arquivo não é uma imagem.')
  if (f.size > MAX_BYTES) throw new ImageRejected('Imagem muito grande (máximo 15 MB).')
}

export function fitWithin(w: number, h: number, max: number): { w: number; h: number } {
  const k = Math.min(1, max / Math.max(w, h))
  return { w: Math.round(w * k), h: Math.round(h * k) }
}

/** Reduz para no máx. 1600 px e converte para WebP (JPEG se o navegador não suportar). */
export async function compressImage(file: File, opts: { maxSide?: number; quality?: number } = {}): Promise<Blob> {
  validateImageFile(file)
  let bmp: ImageBitmap
  try { bmp = await createImageBitmap(file) } catch { throw new ImageRejected('Não foi possível ler essa imagem.') }
  const { w, h } = fitWithin(bmp.width, bmp.height, opts.maxSide ?? 1600)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const q = opts.quality ?? 0.82
  const toBlob = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, q))
  return (await toBlob('image/webp')) ?? (await toBlob('image/jpeg')) ?? Promise.reject(new ImageRejected('Falha ao processar a imagem.'))
}
