import { BRANDS } from '../brand/brands'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import { formatPhone, igHandle } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { toast } from '../ui/toast'

export default function Contact() {
  useDocumentTitle('Contato')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const digits = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  const wa = digits ? `https://wa.me/${digits}?text=${encodeURIComponent('Olá! Vim pelo site do Universo Lay.')}` : null
  const insta = BRANDS.map((b) => ({ name: b.name, url: s?.[`instagram_${b.slug.replace(/-/g, '_')}`], a: b.accentFrom, b: b.accentTo })).filter((x) => igHandle(x.url))
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Contato</p>
          <h1>Vamos conversar</h1>
          <p className="phead__lead">{!s ? '\u00A0' : wa ? 'Pedidos, dúvidas e personalizações: chame a gente no WhatsApp.' : 'Nossos canais de atendimento serão publicados aqui em breve.'}</p>
        </header>
        <div className="cgrid">
          {wa && (
            <Reveal className="panel cwa">
              <p className="eyebrow">WhatsApp</p>
              <p className="cwa__num">{formatPhone(digits)}</p>
              <p className="cwa__txt">Peça, tire dúvidas sobre tamanho e cor ou combine uma peça personalizada.</p>
              <div className="cwa__btns">
                <a className="btn btn--ink btn--arrow" href={wa} target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
                <button type="button" className="btn btn--ghost" onClick={() => { void navigator.clipboard?.writeText(`+${digits}`).then(() => toast({ title: 'Número copiado', text: formatPhone(digits) })).catch(() => toast({ tone: 'error', title: 'Não foi possível copiar' })) }}>Copiar número</button>
              </div>
            </Reveal>
          )}
          {!!insta.length && (
            <Reveal delay={90} className="panel cig">
              <p className="eyebrow">Instagram</p>
              <ul>
                {insta.map((x) => (
                  <li key={x.name} style={{ ['--a' as string]: x.a, ['--b' as string]: x.b }}>
                    <a href={x.url} target="_blank" rel="noreferrer" aria-label={`${x.name} no Instagram, ${igHandle(x.url)}`}>
                      <span><b>{x.name}</b><small>{igHandle(x.url)}</small></span><i aria-hidden>↗</i>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </main>
  )
}
