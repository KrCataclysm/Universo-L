import { expect, test } from '@playwright/test'

test('home mostra slogan e as 3 marcas e navega para cada uma', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Todas as suas marcas em um só lugar.')
  for (const name of ['Lay.store', 'Ousada Delicada', 'Falou Bordei']) {
    await expect(page.locator('.portal', { hasText: name })).toBeVisible()
  }
  await page.locator('.portal', { hasText: 'Ousada Delicada' }).click()
  await expect(page).toHaveURL(/\/ousada-delicada$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Ousada Delicada')
})

test('produto com opção de cor: exige escolher e entra no carrinho', async ({ page }) => {
  await page.goto('/lay-store/bermuda-ciclista')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByText('Escolha uma opção.')).toBeVisible()
  await page.getByRole('radio', { name: 'Preta' }).click()
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  const drawer = page.getByRole('dialog', { name: 'Carrinho' })
  await expect(drawer).toContainText('Bermuda ciclista')
  await expect(drawer).toContainText('Preta')
  const fin = drawer.getByRole('link', { name: 'Finalizar no WhatsApp' })
  await expect(fin).toBeVisible()
  const href = decodeURIComponent((await fin.getAttribute('href')) ?? '')
  expect(href).toContain('https://wa.me/558699463019?text=')
  expect(href).toContain('Bermuda ciclista')
  expect(href).toContain('Cor: Preta')
  expect(href).toContain('R$')
})

test('página do produto: mais da marca, compartilhar e botão flutuante de WhatsApp', async ({ page }) => {
  await page.goto('/lay-store/bermuda-ciclista')
  await expect(page.getByRole('heading', { name: 'Mais de Lay.store' })).toBeVisible()
  await expect(page.locator('.pdp__more .pcard')).toHaveCount(3)
  await expect(page.getByRole('button', { name: /Compartilhar/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Falar com a loja no WhatsApp' })).toHaveAttribute('href', /wa\.me\/558699463019/)
})

test('sem violações de CSP no console', async ({ page }) => {
  const msgs: string[] = []
  page.on('console', (m) => { if (/Content Security Policy|Refused to/i.test(m.text())) msgs.push(m.text()) })
  for (const r of ['/', '/falou-bordei', '/falou-bordei/jesus-vidrilho-dourado', '/sobre', '/contato', '/admin']) { await page.goto(r); await page.waitForTimeout(900) }
  expect(msgs).toEqual([])
})

test('bordado sob consulta: "Solicitar orçamento" abre o WhatsApp com a peça e as observações', async ({ page }) => {
  await page.goto('/falou-bordei/jesus-vidrilho-dourado')
  await expect(page.getByText('Sob consulta').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Adicionar ao carrinho' })).toHaveCount(0)
  await page.getByLabel(/Observações/).fill('Letras douradas, tamanho P')
  const link = page.locator('.pdp__buy').getByRole('link', { name: 'Solicitar orçamento' })
  const href = decodeURIComponent((await link.getAttribute('href')) ?? '')
  expect(href).toContain('https://wa.me/558699463019?text=')
  expect(href).toContain('Jesus em vidrilho dourado')
  expect(href).toContain('Letras douradas, tamanho P')
})

test('home na ordem pedida e sem numeração nos cartões das marcas', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Siga no Instagram' })).toBeAttached()
  const titles = await page.locator('main h2').evaluateAll((els) => els.map((e) => e.textContent?.trim()))
  expect(titles).toEqual(['Escolha seu universo', 'Novidades e lançamentos', 'Produtos em destaque', 'Como comprar', 'Pagamento e entrega', 'Siga no Instagram'])
  await expect(page.locator('.portal__n')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Ver coleção/ })).toHaveCount(3)
  await expect(page.getByRole('link', { name: 'Conheça nossas marcas' })).toBeVisible()
  await expect(page.getByText('Moda fitness, moda íntima e peças personalizadas para vestir, encantar e presentear.')).toBeVisible()
})

test('cartão de produto: marca, selos, "Ver detalhes" e "Solicitar orçamento"', async ({ page }) => {
  await page.goto('/falou-bordei')
  const card = page.locator('.pcard', { hasText: 'Jesus em vidrilho dourado' })
  await expect(card.locator('.pcard__brand')).toHaveText('Falou Bordei')
  await expect(card).toContainText('Solicitar orçamento')
  await expect(card).toContainText('Sob encomenda')
  await expect(card).toContainText('Personalizável')
  await page.goto('/lay-store')
  const lay = page.locator('.pcard', { hasText: 'Short duplo' })
  await expect(lay).toContainText('Ver detalhes')
  await expect(lay).toContainText('Novidade')
})

test('busca de produtos pelo ícone do cabeçalho', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Buscar produtos' }).click()
  await expect(page).toHaveURL(/\/busca/)
  await page.getByRole('searchbox').fill('sutia')
  await expect(page.getByText('Sutiã coringa').first()).toBeVisible()
  await expect(page.locator('.pcard')).toHaveCount(1)
  await page.getByRole('searchbox').fill('xyzzy')
  await expect(page.getByText('Nada encontrado')).toBeVisible()
})

test('páginas de informação e privacidade existem e o rodapé leva até elas', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Trocas e devoluções' }).first().click()
  await expect(page).toHaveURL(/informacoes/)
  await expect(page.getByRole('heading', { name: 'Trocas e devoluções' })).toBeVisible()
  await page.goto('/privacidade')
  await expect(page.getByRole('heading', { name: 'Política de privacidade' })).toBeVisible()
})

test('celular: 2 produtos por linha, cartões alinhados e botão de WhatsApp pequeno', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/lay-store')
  await page.waitForTimeout(1500)
  const xs = await page.locator('.pcard').evaluateAll((els) => els.slice(0, 4).map((e) => Math.round(e.getBoundingClientRect().left)))
  expect(new Set(xs).size).toBe(2)
  const prices = await page.locator('.pcard').evaluateAll((els) => els.slice(0, 2).map((e) => Math.round(e.querySelector('.pcard__price')!.getBoundingClientRect().top)))
  expect(Math.abs(prices[0] - prices[1])).toBeLessThanOrEqual(1)
  const w = await page.locator('.wafab').evaluate((e) => e.getBoundingClientRect().width)
  expect(w).toBeLessThanOrEqual(44)
})

test('marca exibe as fotos reais dos produtos', async ({ page }) => {
  await page.goto('/ousada-delicada')
  await expect(page.getByRole('heading', { name: 'Sutiã coringa' })).toBeVisible()
  const ok = await page.locator('.pcard__img').first().evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)
  expect(ok).toBe(true)
})

test('rota inexistente mostra 404 temático', async ({ page }) => {
  await page.goto('/marca-que-nao-existe')
  await expect(page.getByText('Essa estrela saiu da órbita')).toBeVisible()
  await page.goto('/lay-store/produto-que-nao-existe')
  await expect(page.getByText('Essa estrela saiu da órbita')).toBeVisible()
})

test('painel: visitante cai na tela de login e não vê dados', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Painel Universo Lay' })).toBeVisible()
  await expect(page.getByLabel('E-mail')).toBeVisible()
  await page.getByLabel('E-mail').fill('ninguem@exemplo.invalid')
  await page.getByLabel('Senha').fill('senha-errada-123')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible()
})

test('carrinho acessível: foco vai pra dentro, Tab não escapa e Esc fecha devolvendo o foco', async ({ page }) => {
  await page.goto('/lay-store/bermuda-ciclista')
  await page.getByRole('radio', { name: 'Preta' }).click()
  const add = page.getByRole('button', { name: 'Adicionar ao carrinho' })
  await add.click()
  const dialog = page.getByRole('dialog', { name: 'Carrinho' })
  await expect(dialog).toBeVisible()
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true)
  for (let i = 0; i < 14; i++) await page.keyboard.press('Tab')
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(add).toBeFocused()
})

test('menu do celular fecha com Esc', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
})

test('novidades fecha com cartão "Ver todas as peças" que leva à busca', async ({ page }) => {
  await page.goto('/')
  const more = page.getByRole('link', { name: /Ver todas as peças/ })
  await expect(more).toBeVisible()
  await more.click()
  await expect(page).toHaveURL(/\/busca$/)
  await expect(page.getByRole('heading', { name: 'Buscar produtos' })).toBeVisible()
})

test('desktop: topo com colagem de fotos reais das marcas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.hero__collage img')).toHaveCount(3)
  await expect(page.locator('.hero__collage img').first()).toBeVisible()
})
