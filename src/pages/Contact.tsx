import { useAsync } from '../data/CatalogProvider'
import Reveal from '../fx/Reveal'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Contato')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const digits = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  const wa = digits ? `https://wa.me/${digits}` : null
  const insta: [string, string | undefined][] = [['Lay.Store', s?.instagram_lay_store], ['Ousada Delicada', s?.instagram_ousada_delicada], ['Falou, Bordei', s?.instagram_falou_bordei]]
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
          {wa && <a className="btn btn--ink" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>}
          {insta.filter(([, v]) => v).map(([n, v]) => <a key={n} className="btn btn--ghost" href={v} target="_blank" rel="noreferrer">Instagram · {n}</a>)}
        </div>
      </div>
    </main>
  )
}
