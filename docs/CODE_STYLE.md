# CODE_STYLE.md

## 1. Princípios
- Simples antes de esperto. Seguir o que o projeto já faz.
- Alterar só o que o pedido precisa. Sem abstração para um caso só.
- Mudou comportamento? O teste muda junto.

## 2. Nomes
- Componentes e arquivos de componente: `PascalCase` (`ProductCard.tsx`).
- Funções e variáveis: `camelCase`; constantes: `UPPER_SNAKE_CASE`.
- Booleanos leem-se como pergunta: `isOn`, `hasAccess`, `soldOut`.
- Código em inglês; **textos da interface em português do Brasil**.
- CSS: classes estilo BEM (`pcard__price`, `show__tabs`); cores e tamanhos por token (`var(--ink)`), não valor solto quando houver token.

## 3. TypeScript
- `strict` ligado. Sem `any`; se for inevitável, comentar o porquê.
- Tipos do domínio em `src/data/catalog.ts`.

## 4. Componentes
- Um componente, uma responsabilidade; acima de ~200 linhas, dividir.
- Sem `fetch` dentro de componente visual: usar `useAsync`/`useProducts` (`CatalogProvider`).
- Tratar sempre: carregando, vazio, erro.
- Interativo precisa de rótulo acessível e foco visível. Diálogos usam `<dialog>`.

## 5. Funções
- Nome com verbo (`applyTools`, `buildWhatsAppUrl`). Até 3 parâmetros; mais que isso, objeto.
- Sair cedo em vez de `if` aninhado.

## 6. Comentários
Explicam o **porquê**, não o quê. Ex.: `// preço 0 = sob consulta: não declara oferta (o Google exige preço real)`.

## 7. Erros
- Sem `catch` vazio sem motivo escrito (armazenamento bloqueado é um motivo válido).
- Falha de rede: mensagem simples + "Tentar de novo".

## 8. Testes
- Obrigatórios em regra de negócio, dinheiro, permissões e fluxos da cliente.
- Bug corrigido ganha um teste que o apanhe.
- Teste que lê estilo/estado em transição usa `expect.poll`.
- Vitest (`tests/`), Playwright (`tests/e2e/`), RLS (`tests/rls/`).

## 9. Antes de acabar
- [ ] `npm run build` (tipos + build) e `npm test` passam
- [ ] `npm run e2e` passa (rodar 2×; o servidor local é construído pelo próprio Playwright)
- [ ] sem `console.log` esquecido nem código morto
- [ ] sem arquivos mexidos que não tinham a ver com o pedido
- [ ] telas alteradas conferidas a 375 px e a 1280 px
