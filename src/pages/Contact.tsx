import { BRANDS } from '../brand/brands'
import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import { formatPhone, igHandle } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Contato')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const digits = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  const wa = digits ? `https://wa.me/${digits}?text=${encodeURIComponent('Olá! Vim pelo site do Universo Lay.')}` : null
  const insta = BRANDS.map((b) => ({ name: b.name, url: s?.[`instagram_${b.slug.replace(/-/g, '_')}`] })).filter((x) => igHandle(x.url))
  return (
    <main className="page about">
      <div className="container">
        <Reveal><p className="eyebrow">Contato</p></Reveal>
        <Reveal delay={80}><h1>Vamos conversar</h1></Reveal>
        <Reveal delay={160}>
          {wa ? <p className="about__lead">Pedidos, dúvidas e personalizações: chame a gente no WhatsApp.</p>
              : <p className="about__lead">Nossos canais de atendimento serão publicados aqui em breve.</p>}
        </Reveal>
        <div className="contact__links">
          {wa && <a className="btn btn--glow" href={wa} target="_blank" rel="noreferrer">Chamar no WhatsApp · {formatPhone(digits)}</a>}
        </div>
        {!!insta.length && (
          <div className="contact__ig">
            <p className="eyebrow">Instagram</p>
            <div className="contact__links">
              {insta.map((x) => <a key={x.name} className="btn btn--ghost" href={x.url} target="_blank" rel="noreferrer">{igHandle(x.url)} · {x.name}</a>)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
