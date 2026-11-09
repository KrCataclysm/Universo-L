import { expect, test } from '@playwright/test'

const sizes = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]
const routes = ['/', '/lay-store', '/ousada-delicada', '/falou-bordei', '/falou-bordei/toalha-bordada', '/sobre', '/contato', '/nada']

for (const s of sizes) {
  test(`sem rolagem horizontal em ${s.name}`, async ({ page }) => {
    await page.setViewportSize({ width: s.width, height: s.height })
    await page.addInitScript(() => sessionStorage.setItem('ul-intro', '1'))
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    for (const r of routes) {
      await page.goto(r)
      await page.waitForTimeout(600)
      const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth])
      expect(sw, `${r} em ${s.name}`).toBeLessThanOrEqual(iw)
    }
    expect(errors).toEqual([])
  })
}
