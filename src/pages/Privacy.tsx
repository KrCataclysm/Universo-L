import { useAsync } from '../data/CatalogProvider'
import { formatPhone } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Privacy() {
  useDocumentTitle('Política de privacidade')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const wa = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  return (
    <main className="page about">
      <div className="container prose">
        <p className="eyebrow">Privacidade</p>
        <h1>Política de privacidade</h1>
        <p>Esta página explica, de forma simples, como o site do Universo Lay trata os seus dados, de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018). Atualizada em novembro de 2026.</p>
        <section><h2>Quem é responsável</h2>
          <p>{s?.loja_razao_social ? `${s.loja_razao_social}${s.loja_cnpj ? ` · CNPJ ${s.loja_cnpj}` : ''}` : 'Universo Lay (lojas Lay.store, Ousada Delicada e Falou Bordei).'}</p>
          <p>Contato para assuntos de privacidade: {s?.loja_email ? <a href={`mailto:${s.loja_email}`}>{s.loja_email}</a> : null}{s?.loja_email && wa ? ' ou ' : ''}{wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp {formatPhone(wa)}</a> : (!s?.loja_email ? 'pelo canal de atendimento da loja.' : null)}</p></section>
        <section><h2>Quais dados usamos</h2>
          <ul>
            <li><b>Carrinho:</b> as peças que você escolhe ficam salvas só no seu aparelho (armazenamento local do navegador). Não enviamos isso para nenhum servidor.</li>
            <li><b>Nome (opcional):</b> se você digitar o nome no carrinho, ele vai apenas dentro da mensagem do pedido.</li>
            <li><b>Pedido:</b> ao tocar em “Finalizar no WhatsApp”, você mesma envia a mensagem para a loja. A conversa passa a ser regida pela política do WhatsApp.</li>
            <li><b>Cookies e rastreamento:</b> hoje o site não usa cookies de publicidade nem ferramentas de análise. Se isso mudar, esta página e um aviso de cookies serão atualizados antes.</li>
          </ul></section>
        <section><h2>Para que usamos</h2><p>Para montar o seu pedido e atender você. Não vendemos nem compartilhamos seus dados com terceiros para publicidade.</p></section>
        <section><h2>Quem armazena o catálogo</h2><p>Os produtos e fotos ficam em serviços de hospedagem e banco de dados contratados pela loja (GitHub Pages e Supabase). Eles não recebem dados pessoais de clientes.</p></section>
        <section><h2>Seus direitos</h2><p>Você pode pedir confirmação de tratamento, acesso, correção, eliminação e informações sobre o uso dos seus dados (art. 18 da LGPD), sem custo, pelo contato acima.</p></section>
        <section><h2>Alterações</h2><p>Se o site passar a coletar outros dados (por exemplo, análises de visitas), esta política será atualizada antes e a data acima mudará.</p></section>
      </div>
    </main>
  )
}
