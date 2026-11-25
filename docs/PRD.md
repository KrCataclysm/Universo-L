# PRD.md

## 1. O produto
- Nome: **Universo Lay**
- Numa frase: vitrine online de três marcas de uma mesma loja (Lay.store, Ousada Delicada, Falou Bordei), com o pedido finalizado pelo WhatsApp.
- Plataforma: web, pensada primeiro para o celular. Site estático no GitHub Pages + Supabase para o catálogo.

## 2. O problema
A loja vende pelo Instagram e pelo WhatsApp. O cliente não tem um lugar único para ver todas as marcas, preços e fotos, e a dona repete a mesma conversa a cada pedido.

## 3. Para quem é
- **Dona da loja (Laianny):** cadastrar peças, fotos, preços e selos sozinha, pelo painel, sem tocar em código.
- **Cliente:** ver as peças, escolher cor/tamanho e mandar o pedido pronto no WhatsApp, sem criar conta.

## 4. O que entra (versão atual)
- [x] Vitrine das 3 marcas, página de produto, busca, favoritos, ordenar e filtrar por faixa de preço
- [x] Carrinho que vira mensagem de WhatsApp (itens, cor/tamanho, personalização, total)
- [x] "Solicitar orçamento" para peças com preço 0 (sob consulta) e para personalizados
- [x] Painel da loja: produtos, fotos, selos, banners, textos de pagamento/entrega, contatos
- [x] Páginas de informação (pagamento, entrega, prazos, trocas) e política de privacidade
- [x] Compartilhar produto com prévia (Open Graph) e SEO por página

## 5. O que NÃO entra
- Pagamento online, cálculo de frete, estoque por quantidade
- Conta ou login de cliente
- Avaliações, cupons e contagem regressiva (não há dado real para sustentar)
- Várias lojas na mesma conta
- Qualquer produto, preço, foto ou depoimento **inventado**
A IA não deve construir nada desta lista, mesmo que pareça fácil.

## 6. Percurso principal
1. A cliente abre o site e escolhe uma marca.
2. Vê as peças, filtra por preço e abre a que gostou (ou usa a visualização rápida).
3. Escolhe cor/tamanho e adiciona ao carrinho (aparece um aviso com "Ver carrinho").
4. Abre o carrinho e toca em "Finalizar no WhatsApp".
5. A mensagem sai pronta para o número da loja; pagamento e entrega são combinados na conversa.

## 7. Regras do negócio
- Preço `0` significa "Sob consulta": não vai ao carrinho com valor; leva a "Solicitar orçamento".
- Dinheiro sempre em centavos (inteiro). Mostra-se em R$ só na tela.
- Peça `esgotada` aparece com selo e não pode ser adicionada.
- Selos possíveis: Novidade, Pronta entrega, Sob encomenda (e "Personalizável", derivado do cadastro). No máximo 2 por cartão.
- Só aparecem para o público as peças com status `published`.
- Nomes de marca padronizados: **Lay.store**, **Ousada Delicada**, **Falou Bordei**.
- Contatos (WhatsApp, Instagram) e textos institucionais vêm da tabela `settings`, nunca do código.

## 8. Está pronto quando
- Uma cliente nova manda um pedido pelo WhatsApp em menos de 60 segundos.
- Tudo funciona em 375 px de largura, sem rolagem lateral.
- Testes unitários e e2e passam e o Lighthouse mobile fica ≥ 90 (acessibilidade, boas práticas e SEO em 100).
- A dona cadastra uma peça nova pelo painel sem ajuda.

## 9. Por decidir
- Domínio próprio (universolay.com.br) e quando migrar.
- Texto real de pagamento, entrega, prazos e trocas (hoje há texto genérico).
- Razão social, CNPJ e e-mail para a política de privacidade; revisão jurídica da política.
- Analytics e pixel (Meta/GA4): só com consentimento, e só se a loja quiser anunciar.
- Meta de LCP nas páginas internas (hoje 2,8–3,1 s; meta 2,5 s).
