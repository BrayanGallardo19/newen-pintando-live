import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as editorial from '../src/features/editorial.ts'
import { buildVideoPlaylist } from '../src/features/showcase.ts'

const work = { id: 1, order: 1, slug: 'uno', name: 'Uno', price: 'Precio por confirmar', category: 'arte', images: ['/assets/uno.webp'], options: [], videos: [{ src: '/assets/uno.mp4' }], description: 'Paisaje', detail: '' }

test('ocultar y restaurar una obra actualiza el catálogo, colecciones y videos', () => {
  const records = [work, { ...work, id: 2, slug: 'dos', archived: true, images: ['/assets/dos.webp'], videos: [{ src: '/assets/dos.mp4' }] }]
  const visible = editorial.visibleProducts(records)
  assert.deepEqual(visible.map(item => item.id), [1])
  assert.equal(visible.filter(item => item.category === 'arte').length, 1)
  assert.deepEqual(buildVideoPlaylist([], visible).map(item => item.src), ['/assets/uno.mp4'])
  assert.equal(editorial.visibleProducts(records.map(item => ({ ...item, archived: false }))).length, 2)
})

test('el carrusel omite imágenes de obras ocultas y conserva prioridades y repetidos compartidos', () => {
  const records = [work, { ...work, id: 2, archived: true, images: ['/assets/dos.webp'] }]
  assert.deepEqual(editorial.heroSlides(['/assets/dos.webp', '/assets/paisaje.webp'], records).map(item => item.src), ['/assets/paisaje.webp', '/assets/uno.webp'])
  assert.deepEqual(editorial.heroSlides([], [{ ...work, archived: true }]), [])
  assert.deepEqual(editorial.heroSlides(['/assets/uno.webp'], [work, { ...work, archived: true }]).map(item => item.src), ['/assets/uno.webp'])
})

test('la portada editorial de una colección tiene respaldo al vaciarse o no tener obras', () => {
  assert.equal(editorial.collectionCover({ slug: 'arte', cover: '/assets/cover.webp' }, [work], '/assets/fallback.webp'), '/assets/cover.webp')
  assert.equal(editorial.collectionCover({ slug: 'arte', cover: '' }, [work], '/assets/fallback.webp'), '/assets/uno.webp')
  assert.equal(editorial.collectionCover({ slug: 'otra' }, [work], '/assets/fallback.webp'), '/assets/fallback.webp')
})

test('ocultar una obra también retira las imágenes exclusivas de sus variantes del carrusel', () => {
  const hidden = { ...work, archived: true, options: [{ label: 'Carta', price: '$5.000', image: '/assets/carta.webp' }] }
  assert.deepEqual(editorial.heroSlides(['/assets/carta.webp'], [hidden]), [])
})
