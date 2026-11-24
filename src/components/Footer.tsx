import { Link } from 'react-router-dom'
import { SLOGAN } from '../brand/brands'
import Monogram from '../brand/Monogram'
import { useAsync } from '../data/CatalogProvider'
import { formatPhone } from '../lib/format'

export default function Footer() {
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const wa = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  return (
    <footer className="ftr">
      <div className="ftr__top">
        <Monogram variant="light" size={40} />
        <p className="ftr__slogan">{SLOGAN}</p>
      </div>
      <div className="ftr__grid">
        <nav aria-label="Informações">
          <h2 className="ftr__h">Informações</h2>
          <ul>
            <li><Link to="/informacoes#pagamento">Pagamento</Link></li>
            <li><Link to="/informacoes#entrega">Entrega e prazos</Link></li>
            <li><Link to="/informacoes#trocas">Trocas e devoluções</Link></li>
            <li><Link to="/privacidade">Política de privacidade</Link></li>
          </ul>
        </nav>
        <nav aria-label="Atendimento">
          <h2 className="ftr__h">Atendimento</h2>
          <ul>
            <li><Link to="/sobre">Sobre nós</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            {wa && <li><a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp<br /><small>{formatPhone(wa)}</small></a></li>}
          </ul>
        </nav>
      </div>
      <p className="ftr__legal">© {new Date().getFullYear()} Universo Lay</p>
    </footer>
  )
}
