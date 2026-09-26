import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import originalVideos from './original-videos.json' with { type: 'json' }

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

export function gitBlobHash(buffer) {
  return createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex')
}

export function isOriginalVideo(path, hash) { return originalVideos[path] === hash }

// ISO BMFF movie header: duration uses movie timescale, not a video track's timescale.
export function mp4Duration(buffer) {
  const find = (start, end, type) => {
    for (let offset = start; offset + 8 <= end;) {
      let size = buffer.readUInt32BE(offset)
      const header = size === 1 ? 16 : 8
      if (size === 1) {
        if (offset + 16 > end) break
        const large = buffer.readBigUInt64BE(offset + 8)
        if (large > BigInt(Number.MAX_SAFE_INTEGER)) break
        size = Number(large)
      } else if (size === 0) size = end - offset
      if (size < header || offset + size > end) break
      if (buffer.toString('ascii', offset + 4, offset + 8) === type) return { start: offset + header, end: offset + size }
      offset += size
    }
    return null
  }
  const moov = find(0, buffer.length, 'moov')
  const mvhd = moov && find(moov.start, moov.end, 'mvhd')
  if (!mvhd) throw new Error('no contiene cabecera de duración MP4 válida')
  const version = buffer[mvhd.start]
  const index = mvhd.start + (version === 1 ? 20 : 12)
  if (version > 1 || index + (version === 1 ? 12 : 8) > mvhd.end) throw new Error('cabecera MP4 truncada')
  const scale = buffer.readUInt32BE(index)
  const duration = version === 1 ? Number(buffer.readBigUInt64BE(index + 4)) : buffer.readUInt32BE(index + 4)
  if (!scale || !Number.isSafeInteger(duration)) throw new Error('duración MP4 inválida')
  return duration / scale
}

export function validateRecords(site, categories, products, assets, inspectVideo = () => {}) {
  const errors = []
  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  const hasText = value => typeof value === 'string' && value.trim().length > 0
  const optionalText = (value, label) => { if (value != null && typeof value !== 'string') errors.push(`${label}: debe ser texto`) }
  const textLimit = (value, label, max) => {
    optionalText(value, label)
    if (typeof value === 'string' && value.length > max) errors.push(`${label}: máximo ${max} caracteres (hay ${value.length})`)
  }
  const list = (value, label, { required = false, max = Infinity, objects = false } = {}) => {
    if (value == null && !required) return []
    if (!Array.isArray(value)) { errors.push(`${label}: requiere una lista`); return [] }
    if (required && !value.length) errors.push(`${label}: requiere al menos un elemento`)
    if (value.length > max) errors.push(`${label}: máximo ${max} elementos`)
    if (!objects) return value
    return value.filter((item, index) => {
      if (isRecord(item)) return true
      errors.push(`${label}: elemento ${index + 1} inválido`)
      return false
    })
  }
  if (!isRecord(site)) { errors.push('Datos generales: formato inválido'); site = {} }
  categories = list(categories, 'Categorías', { objects: true })
  products = list(products, 'Obras', { objects: true })
  const checkAsset = (path, label, video = false) => {
    const extension = video ? /\.mp4$/i : /\.(png|jpe?g|webp)$/i
    if (typeof path !== 'string' || !/^\/assets\/[a-zA-Z0-9/_ .-]+$/.test(path) || !assets.has(path) || !extension.test(path)) {
      errors.push(`${label}: archivo inexistente o ruta/formato inválido: ${path}`)
    }
  }
  const checkVideo = (video, label) => {
    checkAsset(video.src, label, true)
    optionalAsset(video.poster, `${label}: portada`)
    textLimit(video.label, `${label}: descripción`, 100)
    if (assets.has(video.src) && /\.mp4$/i.test(video.src)) inspectVideo(video.src, errors)
  }
  const optionalAsset = (value, label) => { if (value != null && value !== '') checkAsset(value, label) }
  const seen = (items, prop, label) => {
    const values = new Set()
    for (const item of items) {
      const value = item[prop]
      const key = typeof value === 'string' ? value.trim().toLocaleLowerCase('es') : value
      if (value == null || key === '') errors.push(`${label}: falta ${prop}`)
      else if (values.has(key)) errors.push(`${label}: ${prop} duplicado: ${value}`)
      values.add(key)
    }
  }
  const slugValid = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  if (products.length > 50) errors.push('El catálogo excede el máximo de 50 ilustraciones')
  seen(categories, 'slug', 'categorías'); seen(categories, 'name', 'categorías')
  seen(products, 'id', 'obras'); seen(products, 'slug', 'obras')
  const slugs = new Set(categories.map(c => c.slug))
  for (const c of categories) {
    if (!slugValid(c.slug) || !hasText(c.name) || c.name?.trim().toLowerCase() === 'todos' || c.slug === 'todos') errors.push(`Categoría inválida: ${c.slug}`)
    if (!Number.isSafeInteger(c.order) || c.order < 0) errors.push(`Categoría ${c.slug}: orden inválido (usa un número entero desde 0)`)
    textLimit(c.name, `Categoría ${c.slug}: nombre`, 60)
    textLimit(c.slug, `Categoría ${c.slug}: identificador`, 100)
    optionalAsset(c.cover, `Categoría ${c.slug}: portada`)
  }
  for (const p of products) {
    const label = `Obra ${p.slug}`
    if (!Number.isSafeInteger(p.id) || p.id < 1 || !Number.isSafeInteger(p.order) || p.order < 0) errors.push(`${label}: id u orden inválido (usa números enteros, ID desde 1 y orden desde 0)`)
    if (p.archived != null && typeof p.archived !== 'boolean') errors.push(`${label}: ocultar obra debe ser verdadero o falso`)
    if (!slugValid(p.slug)) errors.push(`${label}: slug inválido`)
    if (!slugs.has(p.category)) errors.push(`${label}: categoría inexistente: ${p.category}`)
    if (!hasText(p.name) || !hasText(p.price)) errors.push(`${label}: nombre o precio vacío/inválido`)
    if (p.category === 'mew-adventures' && !/Mew Adventures\s+\d+/i.test(p.name)) errors.push(`${label}: falta nombre y número de Mew Adventures`)
    textLimit(p.slug, `${label}: identificador`, 100)
    textLimit(p.name, `${label}: título`, 80)
    textLimit(p.price, `${label}: precio`, 40)
    textLimit(p.description, `${label}: descripción`, 1200)
    textLimit(p.detail, `${label}: resumen`, 240)
    for (const path of list(p.images, `${label}: imágenes`, { required: true, max: 6 })) checkAsset(path, label)
    const options = list(p.options, `${label}: variantes`, { max: 3, objects: true })
    seen(options, 'label', `${label}: variantes`)
    for (const option of options) {
      if (!hasText(option.label) || !hasText(option.price)) errors.push(`${label}: variante incompleta`)
      textLimit(option.label, `${label}: nombre de variante`, 60)
      textLimit(option.price, `${label}: precio de variante`, 40)
      optionalAsset(option.image, `${label}: imagen de variante`)
    }
    for (const video of list(p.videos, `${label}: videos`, { max: 1, objects: true })) checkVideo(video, label)
  }
  if (!hasText(site.name) || typeof site.whatsapp !== 'string' || !/^\d{8,15}$/.test(site.whatsapp)) errors.push('Datos generales: nombre o WhatsApp inválido')
  if (!hasText(site.tagline) || site.tagline.length > 60) errors.push('Datos generales: leyenda bajo el logo obligatoria (máximo 60 caracteres)')
  if (!hasText(site.heroTitle)) errors.push('Datos generales: título principal obligatorio')
  for (const [key, max] of Object.entries({ name: 40, heroTitle: 60, heroText: 320, heroAccent: 40, instagramLabel: 40 })) textLimit(site[key], `Datos generales: ${key}`, max)
  try {
    const instagram = new URL(site.instagram)
    if (instagram.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(instagram.hostname) || instagram.username || instagram.password) throw new Error()
  } catch { errors.push('Datos generales: Instagram inválido') }
  checkAsset(site.logo, 'Logo')
  checkAsset(site.heroLandscape, 'Paisaje de portada')
  for (const path of list(site.heroImages, 'Portada: obras destacadas', { max: 12 })) checkAsset(path, 'Portada')
  for (const video of list(site.showcaseVideos, 'Videos generales', { objects: true, max: 6 })) checkVideo(video, 'Video general')
  return errors
}

export function validateDirectory(base = root) {
  const content = join(base, 'src/content')
  const fileErrors = []
  const read = path => {
    try { return JSON.parse(readFileSync(path, 'utf8')) }
    catch { fileErrors.push(`${relative(base, path)}: no se pudo leer; revisa que exista y tenga formato JSON válido`); return null }
  }
  const files = folder => (existsSync(join(content, folder)) ? readdirSync(join(content, folder)) : []).filter(name => name.endsWith('.json')).map(name => ({ name, value: read(join(content, folder, name)) }))
  const categories = files('categories'), products = files('products')
  const assets = new Set()
  const walk = dir => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) { walk(full); continue }
      const path = '/' + relative(join(base, 'public'), full).replaceAll('\\', '/')
      assets.add(path)
      const size = statSync(full).size
      if (size > 25 * 1024 * 1024) fileErrors.push(`${path}: supera 25 MiB por archivo; comprímelo o retíralo antes de publicar`)
      else if (/\.(png|jpe?g|webp)$/i.test(path) && size > 5 * 1024 * 1024) fileErrors.push(`${path}: imagen supera 5 MiB; optimízala antes de publicar`)
    }
  }
  walk(join(base, 'public/assets'))
  const errors = validateRecords(read(join(content, 'site.json')), categories.map(c => c.value), products.map(p => p.value), assets, (path, errors) => {
    if (!/\.mp4$/i.test(path)) { errors.push(`${path}: video debe ser MP4`); return }
    const bytes = readFileSync(join(base, 'public', path.slice(1)))
    if (isOriginalVideo(path, gitBlobHash(bytes))) return
    try { if (mp4Duration(bytes) > 45) errors.push(`${path}: video nuevo supera 45 segundos`) } catch (e) { errors.push(`${path}: ${e.message}`) }
  })
  for (const { name, value } of [...categories, ...products]) if (name !== `${value?.slug}.json`) errors.push(`${name}: el nombre del archivo debe coincidir con su identificador`)
  return [...fileErrors, ...errors]
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = validateDirectory()
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 }
  else console.log('Contenido validado: obras, categorías, recursos y duración de videos.')
}
