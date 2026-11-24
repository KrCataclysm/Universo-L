# Universo Lay — como usar e como editar

## 1. O dia a dia da loja (sem mexer em código): o painel
Endereço: **https://universolay.com.br/admin** (entra com e-mail e senha da administradora).

| Quero… | Onde |
|---|---|
| **Cadastrar produto novo** | Produtos → "+ Novo produto…" → escolher a marca → preencher nome, descrição, preço, fotos → situação **Publicado** → Salvar |
| **Marcar como esgotado** | Produto → marcar **Esgotado** → Salvar (aparece com selo e não pode ser comprado) |
| **Tirar do site sem apagar** | Na lista, trocar a situação para **Oculto** (ou **Rascunho**) |
| **Esgotar só uma cor/tamanho** | Produto → em "Opções", clicar no valor (ex.: "Preta") para marcar esgotado |
| **Mudar preço, nome, fotos** | Abrir o produto → editar → Salvar |
| **Preço "Sob consulta"** | Deixar o preço em `0` (aparece "Sob consulta" e o valor é combinado no WhatsApp) |
| **Produto em destaque na página inicial** | Marcar "Mostrar nos destaques" |
| **Trocar o WhatsApp / Instagram** | Configurações |
| **Ver rascunhos como cliente** | Menu lateral → "Ver rascunhos no site" |

Fotos: pode enviar direto do celular; o painel reduz e otimiza sozinho (primeira foto = capa).

## 2. Pegar o código e editar você mesmo
O código fica no GitHub: **https://github.com/KrCataclysm/Universo-L** (público).

```bash
git clone https://github.com/KrCataclysm/Universo-L.git
cd Universo-L
npm install
npm run dev        # abre o site local para ver as mudanças ao vivo
```
Precisa do Node.js 22+. Para publicar: faça as alterações em uma branch, abra um Pull Request e faça o *merge* na `main` — o site atualiza sozinho em ~2 minutos.

**Onde mexer em cada coisa**
- Textos/identidade: `src/brand/brands.ts` (nomes, cores, slogan), `src/pages/*`
- Cores e fontes: `src/styles/tokens.css`
- Fotos fixas dos produtos iniciais: `public/produtos/`
- Banco de dados (produtos, preços…): pelo painel; estrutura em `supabase/migrations/`

**Passar o projeto para a cliente (ou outra pessoa)**
- *GitHub*: Settings → *Transfer ownership* (ou adicionar como colaboradora em *Collaborators*).
- *Supabase* (banco e fotos): painel do Supabase → *Settings → Transfer project* (ou convidar por e-mail em *Team*).
- *Domínio*: fica no Registro.br, em nome dela.

## 3. Segurança e cuidados
- Crie a conta da administradora em Supabase → *Authentication → Users* e libere em `admin_users` (veja `docs/ADMIN.md`).
- Desligue o cadastro público em *Authentication → Providers → Email*.
- Não compartilhe a senha do painel; troque se mudar de pessoa.
- Política de Privacidade (LGPD): o site guarda só o carrinho no navegador, mas convém publicar uma política com razão social/CNPJ e contato da loja (precisa dos dados dela).
