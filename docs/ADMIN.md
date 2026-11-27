# Painel admin — como liberar o acesso

O painel fica em `/admin`. Só entra quem estiver na tabela `admin_users`.

1. **Criar a conta:** Supabase → *Authentication → Users → Add user → Create new user* (e-mail e uma senha provisória, marque *Auto Confirm User*). Passe a senha provisória só por mensagem privada. **Não use "Invite user"**: o painel não tem tela para definir senha a partir do convite.
2. **Liberar como admin:** *SQL Editor*:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'EMAIL-DA-ADMINISTRADORA';
   ```
3. Acessar `https://<site>/admin` e entrar.
4. **Trocar a senha:** no menu lateral, *Trocar minha senha* (mínimo 8 caracteres, letras e números). A administradora deve fazer isso no primeiro acesso.

## Segurança recomendada
- *Authentication → Providers → Email*: desligar **Allow new users to sign up** (cadastro público não dá acesso ao painel, mas é desnecessário).
- *Authentication → Password security*: ligar **Leaked password protection** (se o plano permitir).
- Remover contas de teste.

## O que o painel faz
Produtos (criar, editar, publicar/ocultar, destaque, fotos, opções, personalização), categorias, configurações (WhatsApp e Instagram), "Remover exemplos" e o modo **Ver rascunhos no site**.
