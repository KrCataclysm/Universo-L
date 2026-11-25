import { useRef } from 'react'
import { DocNav } from '../components/DocNav'
import { useToc } from '../lib/useToc'
import { useAsync } from '../data/CatalogProvider'
import { formatPhone } from '../lib/format'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Privacy() {
  useDocumentTitle('Política de privacidade')
  const { data: s } = useAsync((c) => c.getSettings(), [])
  const wa = (s?.whatsapp_number ?? '').replace(/\D/g, '')
  const body = useRef<HTMLDivElement>(null)
  const toc = useToc(body, [s])
  return (
    <main className="page about">
      <div className="container">
        <header className="phead">
          <p className="eyebrow">Privacidade</p>
          <h1>Política de privacidade</h1>
          <p className="phead__lead">Como o site do Universo Lay trata os seus dados, de acordo com a LGPD (Lei 13.709/2018). Atualizada em novembro de 2026.</p>
        </header>
        <div className="doc">
          <DocNav items={toc} />
          <div className="doc__body prose" ref={body}>
        <section className="panel"><h2>Quem é responsável</h2>
          <p>{s?.loja_razao_social ? `${s.loja_razao_social}${s.loja_cnpj ? ` · CNPJ ${s.loja_cnpj}` : ''}` : 'Universo Lay (lojas Lay.store, Ousada Delicada e Falou Bordei).'}</p>
          <p>Canal para assuntos de privacidade: {s?.loja_email ? <a href={`mailto:${s.loja_email}`}>{s.loja_email}</a> : null}{s?.loja_email && wa ? ' ou ' : ''}{wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">WhatsApp {formatPhone(wa)}</a> : (!s?.loja_email ? 'o atendimento da loja.' : null)}</p></section>
        <section className="panel"><h2>Quais dados usamos e onde ficam</h2>
          <ul>
            <li><b>Carrinho, favoritos e peças vistas recentemente:</b> ficam salvos só no seu aparelho (armazenamento local do navegador). Não enviamos isso para nenhum servidor.</li>
            <li><b>Nome (opcional):</b> se você digitar o nome no carrinho, ele vai apenas dentro da mensagem do pedido.</li>
            <li><b>Pedido e lista de favoritos:</b> só saem do seu aparelho quando você toca em “Finalizar no WhatsApp” ou “Enviar lista pelo WhatsApp”. Aí é você quem envia a mensagem para a loja, e a conversa passa a seguir a política do WhatsApp.</li>
            <li><b>Dados de acesso:</b> ao abrir o site, os serviços de hospedagem recebem, como em qualquer site, informações técnicas da conexão (como o endereço IP) para entregar as páginas.</li>
          </ul></section>
        <section className="panel"><h2>Para que usamos</h2><p>Para montar o seu pedido, guardar o que você escolheu e atender você. Não vendemos seus dados nem os compartilhamos para publicidade.</p></section>
        <section className="panel"><h2>Por quanto tempo ficam</h2><p>Os dados guardados no aparelho ficam até você limpá-los: remova os itens do carrinho e dos favoritos pelo site, ou apague os dados do navegador. As conversas de WhatsApp ficam conforme a política do WhatsApp e o atendimento da loja.</p></section>
        <section className="panel"><h2>Com quem compartilhamos</h2>
          <ul>
            <li><b>GitHub Pages:</b> hospeda as páginas do site.</li>
            <li><b>Supabase:</b> guarda o catálogo (produtos, fotos e textos) e o acesso da loja ao painel. Não recebe dados pessoais de clientes.</li>
            <li><b>WhatsApp (Meta):</b> recebe a mensagem que você decide enviar.</li>
          </ul></section>
        <section className="panel"><h2>Transferência para outros países</h2><p>A hospedagem das páginas (GitHub) e o WhatsApp podem tratar dados em servidores fora do Brasil, e cada um segue a sua própria política de privacidade e as garantias previstas na LGPD. O banco do catálogo (Supabase) fica na região de São Paulo.</p></section>
        <section className="panel"><h2>Cookies e armazenamento no aparelho</h2><p>O site não usa cookies de publicidade nem ferramentas de análise de visitas. Usa apenas o armazenamento local do navegador para lembrar do seu carrinho, dos seus favoritos e das peças que você viu. Se um dia isso mudar, avisaremos aqui e pediremos a sua escolha antes.</p></section>
        <section className="panel"><h2>Seus direitos</h2><p>Você pode pedir confirmação de tratamento, acesso, correção, eliminação e informações sobre o uso dos seus dados (art. 18 da LGPD), sem custo, pelo canal acima. Como quase tudo fica só no seu aparelho, a forma mais rápida de apagar é limpar os dados do navegador.</p></section>
        <section className="panel"><h2>Crianças e adolescentes</h2><p>O site é voltado a compradoras adultas e não coleta dados de crianças de propósito.</p></section>
        <section className="panel"><h2>Alterações</h2><p>Se o site passar a coletar outros dados, esta política será atualizada antes e a data acima mudará.</p></section>
          </div>
        </div>
      </div>
    </main>
  )
}
