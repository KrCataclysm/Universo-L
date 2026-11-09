import { Link } from 'react-router-dom'
import { BRANDS, SLOGAN } from '../brand/brands'
import Monogram from '../brand/Monogram'
import { useAsync } from '../data/CatalogProvider'

export default function Footer() {
  const { data: settings } = useAsync((c) => c.getSettings(), [])
  const insta = [
    ['Lay.Store', settings?.instagram_lay_store],
    ['Ousada Delicada', settings?.instagram_ousada_delicada],
    ['Falou, Bordei', settings?.instagram_falou_bordei],
  ].filter(([, v]) => v)
  return (
    <footer className="ftr grain">
      <div className="ftr__grid">
        <div>
          <Monogram variant="light" size={56} />
          <p className="ftr__big">{SLOGAN}</p>
        </div>
        <div>
          <h4>Marcas</h4>
          <ul>{BRANDS.map((b) => <li key={b.slug}><Link to={`/${b.slug}`}>{b.name}</Link></li>)}</ul>
        </div>
        <div>
          <h4>Universo</h4>
          <ul>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/contato">Contato</Link></li>
            {insta.map(([n, v]) => <li key={n}><a href={String(v)} target="_blank" rel="noreferrer">Instagram · {n}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="ftr__legal"><span>© {new Date().getFullYear()} Universo Lay</span><span>Moda · estilo · delicadeza · peças personalizadas</span></div>
    </footer>
  )
}
