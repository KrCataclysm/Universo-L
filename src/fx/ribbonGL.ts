import { buildRibbonGeometry } from './ribbonGeometry'

const VERT = `
attribute vec2 aPos;
uniform float uTime; uniform vec2 uMouse; uniform float uAspect;
varying float vGlow; varying float vMix;
void main() {
  vec3 p = vec3(aPos, 0.0);
  float t = uTime * 0.28;
  float w = sin(p.x * 0.85 + t + p.y * 0.55) * 0.62
          + sin(p.x * 1.65 - t * 1.25 + p.y * 1.05) * 0.30
          + sin(p.y * 1.9 + t * 0.8) * 0.18;
  p.z = w * 1.35;
  p.y += sin(p.x * 0.55 + t) * 0.7 + uMouse.y * 0.45;
  p.x += uMouse.x * 0.35 * (p.y * 0.15);
  vGlow = 0.18 + smoothstep(-1.2, 1.4, w) * 0.82;
  vMix = (aPos.x + 6.0) / 12.0;
  vec3 r = vec3(-0.35 + uMouse.y * 0.1, uMouse.x * 0.18, 0.12);
  float cz = cos(r.z), sz = sin(r.z); p.xy = vec2(p.x * cz - p.y * sz, p.x * sz + p.y * cz);
  float cy = cos(r.y), sy = sin(r.y); p.xz = vec2(p.x * cy + p.z * sy, -p.x * sy + p.z * cy);
  float cx = cos(r.x), sx = sin(r.x); p.yz = vec2(p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  gl_Position = vec4(p.x * 2.1445 / uAspect, p.y * 2.1445, 0.0, 7.5 - p.z);
}`

const FRAG = `
precision mediump float;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying float vGlow; varying float vMix;
void main() {
  vec3 col = mix(mix(uA, uB, smoothstep(0.0, 0.55, vMix)), uC, smoothstep(0.45, 1.0, vMix));
  gl_FragColor = vec4(col * (0.55 + vGlow * 0.9), vGlow * 0.85);
}`

/** hex sRGB → linear (mantém as cores densas e saturadas, como o design aprovado) */
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16)
  const lin = (v: number) => Math.pow(v / 255, 2.2)
  return [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255)]
}

export interface RibbonOptions { accent: [string, string]; low: boolean; onFail: () => void }

/** Fita holográfica em WebGL puro (sem three.js). Retorna a função de limpeza. */
export function startRibbon(canvas: HTMLCanvasElement, { accent, low, onFail }: RibbonOptions): () => void {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: !low, premultipliedAlpha: true, powerPreference: 'high-performance' })
  if (!gl) { onFail(); return () => {} }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src); gl.compileShader(s)
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
  }
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG)
  const prog = gl.createProgram()!
  if (!vs || !fs) { onFail(); return () => {} }
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onFail(); return () => {} }
  gl.useProgram(prog)

  const geo = buildRibbonGeometry(low ? 38 : 96, low ? 90 : 220)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, geo.positions, gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const u = (n: string) => gl.getUniformLocation(prog, n)
  const uTime = u('uTime'), uMouse = u('uMouse'), uAspect = u('uAspect')
  gl.uniform3fv(u('uA'), rgb(accent[0])); gl.uniform3fv(u('uB'), rgb(accent[1])); gl.uniform3fv(u('uC'), rgb('#9FB8FF'))
  gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE)
  gl.clearColor(0, 0, 0, 0)

  const dpr = () => (low ? 0.75 : Math.min(window.devicePixelRatio || 1, 1.5))
  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr())), h = Math.max(1, Math.round(canvas.clientHeight * dpr()))
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
    gl.viewport(0, 0, w, h)
    gl.uniform1f(uAspect, w / h)
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }
  const onMove = (e: PointerEvent) => { target.x = (e.clientX / window.innerWidth) * 2 - 1; target.y = -((e.clientY / window.innerHeight) * 2 - 1) }
  window.addEventListener('pointermove', onMove, { passive: true })

  let raf = 0, last = 0, onScreen = true, tabOn = document.visibilityState === 'visible', dead = false
  const minDelta = low ? 1000 / 40 : 0
  const t0 = performance.now()
  const frame = (now: number) => {
    raf = 0
    if (dead || !onScreen || !tabOn) return
    raf = requestAnimationFrame(frame)
    if (now - last < minDelta) return
    last = now
    cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05
    gl.uniform1f(uTime, (now - t0) / 1000)
    gl.uniform2f(uMouse, cur.x, cur.y)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.LINES, 0, geo.vertexCount)
  }
  const kick = () => { if (!raf && !dead && onScreen && tabOn) raf = requestAnimationFrame(frame) }

  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; kick() }, { threshold: 0.01 })
  io.observe(canvas)
  const vis = () => { tabOn = document.visibilityState === 'visible'; kick() }
  document.addEventListener('visibilitychange', vis)
  const lost = (e: Event) => { e.preventDefault(); onFail() }
  canvas.addEventListener('webglcontextlost', lost)
  kick()

  return () => {
    dead = true
    if (raf) cancelAnimationFrame(raf)
    io.disconnect(); ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('visibilitychange', vis)
    canvas.removeEventListener('webglcontextlost', lost)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
