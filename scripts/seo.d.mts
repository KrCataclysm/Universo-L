export function esc(s: unknown): string
export function seoBlock(o: { title: string; description: string; url: string; image: string | null }): string
export function injectSeo(html: string, block: string): string
export function buildSitemap(origin: string, paths: string[]): string
