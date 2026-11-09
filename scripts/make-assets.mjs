// Gera ícones e imagem de compartilhamento (og.png) a partir da identidade. Uso: node scripts/make-assets.mjs
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const face = (w) => `@font-face{font-family:'Cormorant Garamond';font-weight:${w};src:url(data:font/woff2;base64,${readFileSync(`public/fonts/cormorant-garamond-latin-${w}-normal.woff2`).toString('base64')}) format('woff2')}`
const css = `
${[300, 400, 500].map(face).join('\n')}
*{margin:0;box-sizing:border-box}body{font-family:'Cormorant Garamond',serif}`

const monogram = (size) => `<html><style>${css}body{width:${size}px;height:${size}px;background:#28272B;display:grid;place-items:center}
.m{position:relative;width:${size}px;height:${size}px;color:#F7F5F2;font-weight:500;font-size:${size * 0.54}px;line-height:1}
.m span{position:absolute}.u{left:${size * 0.22}px;top:${size * 0.14}px}.l{left:${size * 0.5}px;top:${size * 0.33}px}</style>
<div class="m"><span class="u">U</span><span class="l">L</span></div></html>`

const og = `<html><style>${css}body{width:1200px;height:630px;background:#F7F5F2;display:grid;place-items:center;text-align:center;color:#28272B}
h1{font-weight:400;font-size:150px;line-height:.95;letter-spacing:.01em}h1 b{display:block;font-weight:300;color:#A38A9E}
hr{width:150px;border:0;border-top:3px solid #28272B;margin:34px auto}p{font-size:34px;letter-spacing:.09em;text-transform:uppercase;font-weight:400}</style>
<div><h1>UNIVERSO<b>LAY</b></h1><hr><p>Todas as suas marcas em um só lugar.</p></div></html>`

const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM ?? '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
const shot = async (html, w, h, out) => {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300)
  await p.screenshot({ path: out }); await p.close()
}
await shot(monogram(180), 180, 180, 'public/apple-touch-icon.png')
await shot(monogram(192), 192, 192, 'public/icon-192.png')
await shot(monogram(512), 512, 512, 'public/icon-512.png')
await shot(og, 1200, 630, 'public/og.png')
await b.close()
console.log('assets gerados')
