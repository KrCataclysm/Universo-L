# DESIGN_SYSTEM.md

## 1. Direção
- Deve parecer: **editorial, de revista de moda**: papel quente, serifa leve, filetes finos, foto fundida ao fundo.
- Não deve parecer: template com gradiente neon, cantos arredondados de app, efeito por efeito.
- Referência travada: vitrine em que a cor do produto vira a cor da cena (adaptada em "Vitrine em destaque").

## 2. Cores (usar o nome do token, nunca o código solto)
| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#F7F5F2` | fundo |
| `--sand` | `#ECE5DF` | fundo de foto e faixas |
| `--ink` | `#28272B` | texto e botão principal |
| `--lilac` / `--lilac-text` | `#A38A9E` / `#76607A` | marca / texto pequeno (contraste AA) |
| `--void` | `#0B0A0D` | rodapé e topo das marcas |
| `--line` | `rgba(40,39,43,.14)` | filetes |
Marcas: Lay.store `#9FB8FF`, Ousada Delicada `#F2A7C8`, Falou Bordei `#D9B98A` (cada uma com `→ #A38A9E`).
Contraste do texto: mínimo 4,5:1 (Lighthouse acessibilidade deve ficar em 100).

## 3. Letra
- Títulos: **Cormorant Garamond**, 400–500; itálico só na ênfase da frase principal.
- Interface: **Manrope**, 400–700.
- Corpo 16 px (17 px no desktop), altura de linha 1,6. Rótulos em caixa-alta: **12,5 px**, peso 600, espaçamento ~.13em.
- Nunca abaixo de 12 px em texto corrido; etiquetas ("Novidade") 10,5 px é o piso.
- Nome de produto: Cormorant 500, 21–25 px.

## 4. Espaços
- Escala 4/8/12/16/24/32/48/72 (`--s1…--s8`); seção: `--sec-y` (36–64 px).
- Margem lateral: `--gutter` (16 px no celular).

## 5. Forma
- **Cantos retos** (raio 0) em botões, cartões, campos, fotos.
- Redondo só em ícones (carrinho, busca), chips do seletor de vitrine e menu em pílula de vidro.
- Sombra só em itens que flutuam (toast, janela, vitrine).

## 6. Componentes
- Botão: `btn--ink` (principal), `btn--ghost` (secundário), `btn--glass` (sobre cor). Um principal por bloco. Altura ≥ 44 px.
- Cartão de produto: marca, nome, preço, selos (máx. 2), "Ver detalhes" / "Solicitar orçamento".
- Painel (`.panel`): fundo branco, filete, linha colorida no hover. Faixas alternam papel / branco / areia.
- Estado **selecionado**: preenchido de `--ink` + ✓ + anel (variantes, faixas de preço, categorias).
- Aviso (toast): topo, escuro, com barra de tempo; ações "Ver carrinho", "Desfazer".
Antes de criar um componente, ver se já existe em `src/components`.

## 7. Estados obrigatórios
Toda tela que carrega dados tem: carregando (esqueleto), vazio (com próxima ação), erro (com "Tentar de novo") e com dados.

## 8. Telas
- Desenhar primeiro para 375 px, depois 768 e 1280+. Nada rola para o lado.
- Foto: proporção 4:5, `object-fit: cover`, `mix-blend-mode: multiply` sobre `--sand`.

## 9. Movimento
- Microinteração 150–250 ms, só `transform`/`opacity`. Entrada de seção ≤ 900 ms.
- Tudo respeita `prefers-reduced-motion`. Sem efeito que atrase o LCP (nada de `Reveal` acima da dobra na página de produto).

## 10. Tom dos textos
- Português do Brasil, tratando por "você".
- Botões dizem a ação: "Adicionar ao carrinho", "Solicitar orçamento" (não "Enviar").
- Nada de promessa que a loja não confirmou (prazo, frete, desconto).
