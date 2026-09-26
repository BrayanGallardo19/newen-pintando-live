import type { Category, Product } from '../content/types'

export function visibleProducts<T extends { archived?: boolean | null }>(works: T[]): T[] {
  return works.filter(work => work.archived !== true)
}

export function heroSlides(priority: string[], works: Product[]) {
  const visible = visibleProducts(works)
  const images = (work: Product) => [...work.images, ...work.options.flatMap(option => option.image ? [option.image] : [])]
  const visibleImages = new Set(visible.flatMap(images))
  const hiddenImages = new Set(works.filter(work => work.archived).flatMap(images))
  return [...new Set([...priority, ...visible.map(work => work.images[0])])]
    .filter(src => !hiddenImages.has(src) || visibleImages.has(src))
    .map(src => ({ src, name: visible.find(work => work.images.includes(src))?.name ?? 'Ilustración destacada' }))
}

export function collectionCover(category: Pick<Category, 'slug' | 'cover'>, works: Product[], fallback: string): string {
  return category.cover || visibleProducts(works).find(work => work.category === category.slug)?.images[0] || fallback
}
