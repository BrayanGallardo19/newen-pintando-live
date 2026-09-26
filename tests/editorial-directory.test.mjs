import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, truncateSync, rmSync, renameSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validateDirectory } from '../scripts/validate-content.mjs'

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'newen-cms-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  for (const dir of ['src/content/categories', 'src/content/products', 'public/assets']) mkdirSync(join(root, dir), { recursive: true })
  const write = (path, value) => writeFileSync(join(root, path), JSON.stringify(value))
  write('src/content/site.json', { name: 'Newen', tagline: 'Arte', heroTitle: 'Arte', whatsapp: '56911111111', instagram: 'https://instagram.com/newen', logo: '/assets/a.png', heroLandscape: '/assets/a.png' })
  write('src/content/categories/arte.json', { slug: 'arte', name: 'Arte', order: 0 })
  write('src/content/products/uno.json', { id: 1, slug: 'uno', name: 'Uno', price: '$5.000', order: 0, category: 'arte', images: ['/assets/a.png'] })
  writeFileSync(join(root, 'public/assets/a.png'), Buffer.from('89504e470d0a1a0a', 'hex'))
  return root
}

test('un JSON dañado indica el archivo que el administrador debe corregir', t => {
  const root = fixture(t)
  assert.deepEqual(validateDirectory(root), [])
  writeFileSync(join(root, 'src/content/products/uno.json'), '{')
  assert.match(validateDirectory(root).join(' '), /uno\.json.*JSON/i)
})

test('un archivo demasiado pesado bloquea la publicación aunque aún no se use', t => {
  const root = fixture(t)
  const file = join(root, 'public/assets/nuevo.mp4')
  writeFileSync(file, '')
  truncateSync(file, 25 * 1024 * 1024 + 1)
  assert.match(validateDirectory(root).join(' '), /nuevo\.mp4.*25 MiB/i)
})

test('borrar una categoría o cambiar un nombre de archivo detecta las referencias pendientes', t => {
  const root = fixture(t)
  renameSync(join(root, 'src/content/products/uno.json'), join(root, 'src/content/products/otro.json'))
  rmSync(join(root, 'src/content/categories/arte.json'))
  const errors = validateDirectory(root).join(' ')
  assert.match(errors, /categoría inexistente/)
  assert.match(errors, /otro\.json.*identificador/)
})

test('un catálogo vacío es válido aunque Git no conserve las carpetas vacías', t => {
  const root = fixture(t)
  rmSync(join(root, 'src/content/categories'), { recursive: true })
  rmSync(join(root, 'src/content/products'), { recursive: true })
  assert.deepEqual(validateDirectory(root), [])
})
