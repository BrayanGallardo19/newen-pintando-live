import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterCatalog, toggleSelection, quoteMessage, paginateCatalog } from '../src/features/catalog.ts'
import { carouselOffset, carouselPosition, dragCarouselPhase } from '../src/features/carousel.ts'

const works = [
  { id: 1, name: 'Mew Adventures 1', category: 'mew-adventures', description: 'Chiloé', options: [], price: 'Precio por confirmar' },
  { id: 2, name: 'Gyarados rojo', category: 'chile-ilustrado', description: 'Valdivia', options: [{ label: 'Carta', price: 'Precio por confirmar' }], price: 'Precio por confirmar' },
]

test('combina búsqueda sin acentos con categoría y conserva orden', () => {
  assert.deepEqual(filterCatalog(works, 'chile-ilustrado', 'valdivia').map(x => x.id), [2])
  assert.deepEqual(filterCatalog(works, 'Todos', 'CHILOE').map(x => x.id), [1])
})

test('rechaza una undécima obra sin perder la selección', () => {
  const selected = Array.from({ length: 10 }, (_, i) => i + 1)
  assert.deepEqual(toggleSelection(selected, 11), { ids: selected, limitReached: true })
  assert.deepEqual(toggleSelection(selected, 3).ids, selected.filter(id => id !== 3))
})

test('cotización identifica obra, variante y precio sin datos personales', () => {
  const message = quoteMessage([works[1]], { 2: 0 })
  assert.match(message, /Gyarados rojo/)
  assert.match(message, /Carta/)
  assert.match(message, /Precio por confirmar/)
})

test('catálogo reparte 35 obras en páginas de 16 en escritorio y 12 en móvil', () => {
  const entries = Array.from({ length: 35 }, (_, index) => index + 1)
  assert.deepEqual(paginateCatalog(entries, 1, false), { items: entries.slice(0, 16), page: 1, pages: 3 })
  assert.deepEqual(paginateCatalog(entries, 2, false).items, entries.slice(16, 32))
  assert.deepEqual(paginateCatalog(entries, 3, true), { items: entries.slice(24), page: 3, pages: 3 })
  assert.deepEqual(paginateCatalog(entries.slice(0, 2), 3, true), { items: entries.slice(0, 2), page: 1, pages: 1 })
  assert.deepEqual(paginateCatalog([], 5, false), { items: [], page: 1, pages: 0 })
})

test('carrusel continuo mantiene vecinas al cruzar el final y da profundidad a la central', () => {
  assert.ok(Math.abs(carouselOffset(0, 34.8, 35) - 0.2) < 0.001)
  assert.ok(Math.abs(carouselOffset(34, 0.2, 35) + 1.2) < 0.001)
  assert.equal(carouselPosition(0).scale, 1)
  assert.ok(carouselPosition(1).scale < 1)
  assert.ok(carouselPosition(1).rotation < 0)
})

test('arrastrar desplaza la posición de forma proporcional y cruza el final sin saltar', () => {
  assert.equal(dragCarouselPhase(0, 200, 105, 500, 35), 1)
  assert.equal(dragCarouselPhase(0, 200, 152.5, 500, 35), 0.5)
  assert.ok(Math.abs(carouselOffset(0, dragCarouselPhase(34.8, 200, 152.5, 500, 35), 35) + 0.3) < 0.001)
  assert.ok(Math.abs(dragCarouselPhase(0.2, 100, 147.5, 500, 35) - 34.7) < 0.001)
})

test('el selector compacto de videos recorre una tarjeta por cada espacio entre centros', () => {
  assert.equal(dragCarouselPhase(2, 200, 100, 1000, 9, .10), 3)
  assert.ok(Math.abs(dragCarouselPhase(8.75, 200, 183, 100, 9, .17) - .75) < .001)
})
