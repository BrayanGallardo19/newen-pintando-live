import type { Product } from '../content/types'

export const cleanText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()

export function filterCatalog<T extends Pick<Product, 'category' | 'name' | 'description'>>(works: T[], category: string, query: string): T[] {
  const words = cleanText(query).split(/\s+/).filter(Boolean)
  return works.filter(work => (category === 'Todos' || work.category === category) && words.every(word => cleanText(work.name + ' ' + work.description).includes(word)))
}

export function paginateCatalog<T>(works: T[], requestedPage: number, mobile: boolean): { items: T[]; page: number; pages: number } {
  const pageSize = mobile ? 12 : 16
  const pages = Math.ceil(works.length / pageSize)
  const page = Math.min(Math.max(1, Math.floor(requestedPage) || 1), Math.max(pages, 1))
  return { items: works.slice((page - 1) * pageSize, page * pageSize), page, pages }
}

export function toggleSelection(ids: number[], id: number): { ids: number[]; limitReached: boolean } {
  if (ids.includes(id)) return { ids: ids.filter(value => value !== id), limitReached: false }
  if (ids.length >= 10) return { ids, limitReached: true }
  return { ids: [...ids, id], limitReached: false }
}

export function quoteMessage(works: Pick<Product, 'id' | 'name' | 'price' | 'options'>[], variants: Record<number, number | undefined>): string {
  const lines = works.map((work, index) => {
    const variant = variants[work.id] === undefined ? undefined : work.options[variants[work.id]!]
    return `${index + 1}. ${work.name}${variant ? ` — ${variant.label}` : ''} · ${variant?.price || work.price}`
  })
  return ['Hola, me gustaría cotizar estas obras de Newen Pintando:', ...lines, '¿Me puedes confirmar disponibilidad y valores?'].join('\n')
}
