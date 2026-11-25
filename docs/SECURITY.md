# SECURITY.md

## 1. Contas
- Só a **loja** tem login (Supabase Auth). Cliente não tem conta.
- O painel só funciona para quem está em `admin_users`; a checagem é do **banco** (`private.is_admin()`), não da tela.
- Nunca confiar num id, e-mail ou papel enviado pelo navegador.

## 2. Permissões
- Esconder um botão não é segurança: a regra mora no RLS.
- Testar sempre: um visitante anônimo não lê rascunho e não escreve (`tests/rls/`).

## 3. Chaves
- Só a chave pública (anon) está no repositório (`.env.production`). Ela é pública por desenho.
- **Nunca** colocar `service_role`, senha ou token em arquivo, issue, commit ou mensagem.
- Tudo com prefixo `VITE_` vai para o navegador.
- Chave exposta por engano: trocá-la; apagar o commit não basta.
- Não pedir login/senha de ninguém (nem do registro.br) em conversa: o DNS é feito pelo dono.

## 4. Dados que entram
- Painel: validação no cliente e **restrições no banco** (`check`, `not null`).
- Upload de foto: reduzida e convertida para WebP no navegador; escrita só administrador.
- Consultas sempre parametrizadas pelo PostgREST; nada de SQL colado.
- Textos vindos do banco são exibidos como texto (React escapa); JSON no HTML do build é escapado (`<`).

## 5. Política de segurança do navegador
Sem cabeçalhos no GitHub Pages: `Content-Security-Policy` por `<meta>` em `index.html` (só o próprio site e o Supabase). Atualizar se um novo serviço for usado.

## 6. Dados pessoais
- O site **não** grava dado de cliente no servidor. Carrinho, favoritos e vistos ficam no `localStorage`.
- Pedido só sai quando a cliente envia a mensagem no WhatsApp.
- Política de privacidade em `/privacidade` (**minuta, precisa de revisão jurídica**).
- Sem cookies de publicidade nem análise. Se for adotar, antes: aviso de cookies com consentimento e atualizar a política.

## 7. Erros
A cliente vê uma mensagem simples. Nunca mostrar chaves, consultas ou detalhes do Supabase.

## 8. Antes de publicar (conferir)
- [x] RLS ligado em todas as tabelas; testes de RLS passam
- [x] Nenhuma chave secreta no código nem no histórico
- [ ] **Remover o usuário temporário** `tmp-e2e-admin@example.invalid` (Supabase → Authentication → Users)
- [ ] **Desligar o cadastro público** de usuários e ligar a proteção contra senhas vazadas
- [ ] Criar o administrador real da loja (senha definida por ela, fora do chat)
- [ ] Revisão jurídica da política de privacidade
- [ ] Testar recuperação de backup

## 9. Regras para a IA
- Nunca desligar RLS, autenticação ou teste para resolver um erro.
- Nunca inventar credenciais nem pedir senhas.
- Operação destrutiva no Supabase (apagar usuário/dados): pedir aprovação; não contornar o bloqueio.
- Parar e perguntar se um pedido contradisser este arquivo.
