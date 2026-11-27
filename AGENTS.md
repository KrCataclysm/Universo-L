# AGENTS.md

Regras para qualquer IA que mexa neste projeto (Universo Lay).

## 1. Antes de escrever código
Ler só o que interessa à tarefa:
- Funcionalidade nova: `docs/PRD.md` e `docs/ARCHITECTURE.md`
- Telas: `docs/DESIGN_SYSTEM.md` (e `docs/MARCA.md`)
- Dados: `docs/DATABASE.md` e `docs/SECURITY.md`
- Chamadas externas: `docs/API.md` e `docs/SECURITY.md`
- Sempre: `docs/CODE_STYLE.md`
Depois ver como o projeto já resolve algo parecido.

## 2. Como trabalhar
1. Dizer em poucas linhas o que vai mudar e em quais arquivos.
2. Se mexer em dados do Supabase, contas ou DNS, esperar o ok.
3. Fazer a menor alteração que resolve o pedido.
4. Rodar as verificações do item 5.
5. Dizer o que mudou, o que foi testado e o que ficou por testar. **Relatório sincero**: se um teste falhou ou algo foi pulado, dizer.

## 3. Nunca
- Inventar produto, preço, foto, depoimento ou funcionalidade fora do `PRD.md`.
- **Mergear com teste falhando.** Encadear comandos de modo que o merge só ocorra se testes e e2e passarem.
- Apagar ou esvaziar tabelas do Supabase (o projeto é único e é a produção). Teste que escreve no banco desfaz só o que criou.
- Tocar no projeto `lirio-app` do Supabase.
- Desligar teste, validação, RLS ou autenticação para algo funcionar.
- Escrever chave, senha ou token em arquivo ou chat; pedir senha de terceiros.
- Contornar bloqueio de operação destrutiva do Supabase.
- Instalar pacote sem dizer quais e por quê.
- Dizer "pronto" sem ter rodado as verificações.

## 4. Perguntar quando
- O pedido contradiz um destes arquivos.
- Há duas formas razoáveis e a escolha muda o produto (ex.: "toasts" podem ser avisos ou blocos).
- Falta uma regra do negócio ou um dado que só a loja tem (textos de pagamento, CNPJ…).

## 5. Verificações
- `npm run build` (tipos + build + páginas estáticas)
- `npm test` (unitários)
- `npm run e2e` (Playwright; rodar 2×)
- Abrir a tela alterada a 375 px e a 1280 px
- Lighthouse mobile quando mexer em desempenho ou acessibilidade

## 6. Comandos
- Instalar: `npm install`
- Rodar local: `npm run dev`
- Nova migração: criar `supabase/migrations/00NN_nome.sql` e aplicar no Supabase (conferir avisos de segurança)
- Publicar: PR → merge na `main` → GitHub Actions publica (Pages)

## 7. Manter a documentação viva
Se a alteração mudar dados, chamadas ou arquitetura, atualizar o arquivo certo em `docs/` na mesma tarefa.

## 8. Contexto que já custou caro
- Número de WhatsApp com 9 dígitos após o DDD: `5586999463019`.
- A base do site é `/Universo-L/` enquanto não houver domínio próprio (`BASE_PATH`); com domínio, usar `/` e `public/CNAME`.
- Valores iniciais de `settings` estão nas migrações 0007, 0008 e 0012.
- Página sem versão estática no build abre com status 404 no GitHub Pages: criar a entrada em `scripts/postbuild.mjs`.
