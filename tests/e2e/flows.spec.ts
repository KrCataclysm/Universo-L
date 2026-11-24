import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ul-intro', '1'))
})

test('home mostra slogan e as 3 marcas e navega para cada uma', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Todas as suas marcas em um só lugar.')
  for (const name of ['Lay.Store', 'Ousada Delicada', 'Falou Bordei']) {
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
  await expect(page.getByRole('heading', { name: 'Mais de Lay.Store' })).toBeVisible()
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

test('bordado sob consulta: mostra "Sob consulta" e total a combinar', async ({ page }) => {
  await page.goto('/falou-bordei/jesus-vidrilho-dourado')
  await expect(page.getByText('Sob consulta').first()).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  const drawer = page.getByRole('dialog', { name: 'Carrinho' })
  await expect(drawer).toContainText('A combinar')
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
