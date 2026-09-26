import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateRecords, isOriginalVideo, mp4Duration } from '../scripts/validate-content.mjs'

const config = { name: 'Newen', tagline: 'Ilustración desde el sur', whatsapp: '56911111111', instagram: 'https://instagram.com/example', logo: '/assets/logo.png', heroTitle: 'Arte', heroLandscape: '/assets/a.webp', heroImages: ['/assets/a.webp'], showcaseVideos: [] }
const one = { id: 1, order: 1, slug: 'uno', name: 'Uno', price: 'Precio por confirmar', category: 'arte', images: ['/assets/a.webp'], options: [], videos: [] }
const assets = new Set(['/assets/logo.png', '/assets/a.webp', '/assets/old.mp4'])

test('acepta contenido válido y permite vaciar campos opcionales desde el CMS', () => {
  const categories = [{ slug: 'arte', name: 'Arte', order: 1 }]
  assert.deepEqual(validateRecords(config, categories, [one], assets), [])
  assert.deepEqual(validateRecords({ ...config, heroImages: null, showcaseVideos: null }, categories, [{ ...one, options: null, videos: undefined }], assets), [])
})

test('reporta formatos editoriales incorrectos sin interrumpir la validación', () => {
  const errors = validateRecords({ ...config, name: 10, heroTitle: '' }, [{ slug: 'arte', name: null, order: 1 }], [{ ...one, name: 5, options: 'error', videos: [null] }], assets)
  assert.ok(errors.length >= 5)
  assert.match(errors.join(' '), /título principal/i)
})

test('bloquea categorías inexistentes y duplicados', () => {
  assert.match(validateRecords(config, [{ slug: 'arte', name: 'Arte', order: 1 }], [one, { ...one, category: 'fantasma' }], assets).join(' '), /duplicado|inexistente/i)
})

test('bloquea límite de obras, variantes, videos y medios ausentes', () => {
  const overflowing = { ...one, images: ['/assets/missing.webp'], options: Array(4).fill({ label: 'A', price: 'Precio por confirmar' }), videos: Array(2).fill({ src: '/assets/old.mp4' }) }
  const errors = validateRecords(config, [{ slug: 'arte', name: 'Arte', order: 1 }], Array(51).fill(overflowing).map((w, i) => ({ ...w, id: i + 1, slug: `obra-${i + 1}` })), assets).join(' ')
  for (const word of ['50', '3', '1', 'missing']) assert.match(errors, new RegExp(word))
})

test('solo el hash del video original permite exceder 45 segundos', () => {
  assert.equal(isOriginalVideo('/assets/video/old.mp4', 'changed-hash'), false)
})

test('la portada requiere un paisaje que exista en los recursos', () => {
  const errors = validateRecords({ ...config, heroLandscape: '/assets/ausente.webp' }, [{ slug: 'arte', name: 'Arte', order: 1 }], [one], assets)
  assert.match(errors.join(' '), /portada.*ausente\.webp/i)
})

test('exige una leyenda de marca personalizable y legible en el encabezado', () => {
  const categories = [{ slug: 'arte', name: 'Arte', order: 1 }]
  assert.match(validateRecords({ ...config, tagline: ' ' }, categories, [one], assets).join(' '), /leyenda/i)
  assert.match(validateRecords({ ...config, tagline: 'A'.repeat(61) }, categories, [one], assets).join(' '), /leyenda/i)
})

test('la duración MP4 detecta cuando un video nuevo supera 45 segundos', () => {
  const movie = Buffer.alloc(36)
  movie.writeUInt32BE(36, 0); movie.write('moov', 4)
  movie.writeUInt32BE(28, 8); movie.write('mvhd', 12)
  movie.writeUInt32BE(1000, 28); movie.writeUInt32BE(46000, 32)
  assert.equal(mp4Duration(movie), 46)
  assert.ok(mp4Duration(movie) > 45)
})

test('limita textos y listas editoriales sin recortar el contenido guardado', () => {
  const errors = validateRecords({ ...config, heroTitle: 'A'.repeat(61), heroImages: Array(13).fill('/assets/a.webp') }, [{ slug: 'arte', name: 'Arte', order: 1 }], [{ ...one, name: 'A'.repeat(81), description: 'A'.repeat(1201), images: Array(7).fill('/assets/a.webp') }], assets).join(' ')
  for (const limit of ['60', '12', '80', '1200', '6']) assert.match(errors, new RegExp(limit))
})

test('rechaza variantes con nombres repetidos que vuelven ambigua la cotización', () => {
  const errors = validateRecords(config, [{ slug: 'arte', name: 'Arte', order: 1 }], [{ ...one, options: [{ label: 'Carta', price: '$5.000' }, { label: ' carta ', price: '$6.000' }] }], assets)
  assert.match(errors.join(' '), /variante.*duplicado/i)
})

test('valida la portada de colección y el estado de ocultación', () => {
  const errors = validateRecords(config, [{ slug: 'arte', name: 'Arte', order: 1, cover: '/assets/missing.webp' }], [{ ...one, archived: 'false', options: [{ label: 'Carta', price: '$5.000', image: false }] }], assets).join(' ')
  assert.match(errors, /portada.*missing/i)
  assert.match(errors, /ocultar/i)
  assert.match(errors, /false/)
})
