export interface RibbonGeometry { positions: Float32Array; vertexCount: number }

/** Linhas horizontais (rows+1) com `cols` segmentos cada, em x∈[-6,6], y∈[-3,3]. Sem índices: pares (x,y). */
export function buildRibbonGeometry(rows: number, cols: number): RibbonGeometry {
  if (!(rows > 0) || !(cols > 0)) throw new Error('rows e cols devem ser > 0')
  const vertexCount = (rows + 1) * cols * 2
  const positions = new Float32Array(vertexCount * 2)
  let o = 0
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows - 0.5) * 6
    for (let c = 0; c < cols; c++) {
      positions[o++] = (c / cols - 0.5) * 12; positions[o++] = y
      positions[o++] = ((c + 1) / cols - 0.5) * 12; positions[o++] = y
    }
  }
  return { positions, vertexCount }
}
