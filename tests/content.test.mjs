import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeProduct, normalizeSite } from '../src/content/normalize.ts'
import { filterCatalog } from '../src/features/catalog.ts'

test('los campos opcionales vacíos del CMS permiten buscar y abrir una obra', () => {
  const product = normalizeProduct({ id: 1, order: 1, slug: 'uno', name: 'Uno', price: 'Por confirmar', category: 'arte', images: ['/assets/a.webp'], detail: 'Paisaje de Chiloé', description: null, options: null })
  assert.deepEqual(product.options, [])
  assert.deepEqual(product.videos, [])
  assert.equal(filterCatalog([product], 'Todos', 'chiloe').length, 1)
  const site = normalizeSite({ name: 'Newen', heroImages: null, showcaseVideos: null })
  assert.deepEqual(site.heroImages, [])
  assert.deepEqual(site.showcaseVideos, [])
})
