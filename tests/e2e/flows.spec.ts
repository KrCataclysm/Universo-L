import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ul-intro', '1'))
})

test('home mostra slogan e as 3 marcas e navega para cada uma', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Todas as suas marcas em um só lugar.')
  for (const name of ['Lay.Store', 'Ousada Delicada', 'Falou, Bordei']) {
    await expect(page.locator('.portal', { hasText: name })).toBeVisible()
  }
  await page.locator('.portal', { hasText: 'Ousada Delicada' }).click()
  await expect(page).toHaveURL(/\/ousada-delicada$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Ousada Delicada')
})

test('produto personalizável: campos obrigatórios bloqueiam e depois adicionam ao carrinho', async ({ page }) => {
  await page.goto('/falou-bordei/toalha-bordada')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByText('Campo obrigatório.').first()).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Carrinho' })).toHaveCount(0)
  await page.getByLabel(/Nome ou texto a bordar/).fill('Maria & José')
  await page.getByLabel(/Cor da linha/).selectOption('Lilás')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  const drawer = page.getByRole('dialog', { name: 'Carrinho' })
  await expect(drawer).toBeVisible()
  await expect(drawer).toContainText('Maria & José')
  await expect(drawer.getByRole('button', { name: 'Finalizar no WhatsApp' })).toBeDisabled()
  await expect(drawer).toContainText('ainda não foi configurado')
})

test('variação é obrigatória quando existe', async ({ page }) => {
  await page.goto('/lay-store/legging-cintura-alta')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByText('Escolha uma opção.')).toBeVisible()
  await page.getByRole('radio', { name: 'M' }).click()
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByRole('dialog', { name: 'Carrinho' })).toContainText('Tamanho/opção: M')
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
