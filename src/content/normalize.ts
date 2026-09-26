import type { Product, Site } from './types'

type EditorialProduct = Omit<Product, 'description' | 'detail' | 'options' | 'videos'> & {
  description?: string | null; detail?: string | null
  options?: Product['options'] | null; videos?: Product['videos'] | null
}
type EditorialSite = Omit<Site, 'heroImages' | 'showcaseVideos' | 'heroText' | 'heroAccent' | 'instagramLabel'> & {
  heroImages?: Site['heroImages'] | null; showcaseVideos?: Site['showcaseVideos'] | null
  heroText?: string | null; heroAccent?: string | null; instagramLabel?: string | null
}

export function normalizeProduct(product: EditorialProduct): Product {
  return { ...product, detail: product.detail ?? '', description: product.description?.trim() ? product.description : product.detail ?? '', options: product.options ?? [], videos: product.videos ?? [] }
}

export function normalizeSite(site: EditorialSite): Site {
  return { ...site, heroImages: site.heroImages ?? [], showcaseVideos: site.showcaseVideos ?? [], heroText: site.heroText ?? '', heroAccent: site.heroAccent ?? '', instagramLabel: site.instagramLabel ?? '' }
}
