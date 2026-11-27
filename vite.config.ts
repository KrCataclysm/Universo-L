import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// identificador desta publicação: o site compara com /version.json para se atualizar sozinho
const BUILD_ID = (process.env.GITHUB_SHA ?? '').slice(0, 10) || Date.now().toString(36)

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    react(),
    { name: 'version-json', generateBundle() { this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) }) } },
  ],
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    css: false,
  },
})
