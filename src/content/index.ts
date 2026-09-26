import type { Category, Product, Site } from './types'
import siteData from './site.json'
import { normalizeProduct, normalizeSite } from './normalize'
import { visibleProducts, heroSlides } from '../features/editorial'
import { buildVideoPlaylist } from '../features/showcase'

const productModules = import.meta.glob('./products/*.json', { eager: true, import: 'default' }) as Record<string, Product>
const categoryModules = import.meta.glob('./categories/*.json', { eager: true, import: 'default' }) as Record<string, Category>
export const site = normalizeSite(siteData as Site)
const allProducts = Object.values(productModules).map(normalizeProduct).sort((a, b) => a.order - b.order || a.id - b.id)
export const products = visibleProducts(allProducts)
export const heroItems = heroSlides(site.heroImages, allProducts)
export const showcaseItems = buildVideoPlaylist(site.showcaseVideos, products)
export const categories = Object.values(categoryModules).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'es'))
export const categoryName = (slug: string) => categories.find(category => category.slug === slug)?.name ?? slug
