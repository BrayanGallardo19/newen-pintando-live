import type { Site } from '../content/types'
import type { Route } from './navigation'
export const SITE_URL='https://newenpintando.cl'
const escape=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!))
export function headMarkup(route: Route,site: Site) {
  const product=route.product, missing=route.kind==='notFound'
  const title=missing ? 'Página no encontrada | '+site.name : product ? product.name+' | '+site.name : site.name+' · Arte que conecta con Chile'
  const description=product ? (product.description || product.detail || `${product.name}. Consulta sus formatos y disponibilidad en ${site.name}.`).replace(/\s+/g,' ').slice(0,180) : site.heroText || `${site.name}: ${site.tagline}. Explora las obras y consulta tu selección.`
  const canonical=SITE_URL+(product ? route.path : '/')
  const image=SITE_URL+(product?.images[0] || site.heroLandscape)
  const tags=[`<link rel="icon" href="${escape(site.logo)}">`,`<title>${escape(title)}</title>`,`<meta name="description" content="${escape(description)}">`,`<meta name="robots" content="${missing ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">`]
  if (!missing) tags.push(`<link rel="canonical" href="${escape(canonical)}">`,`<meta property="og:url" content="${escape(canonical)}">`)
  tags.push(`<meta property="og:title" content="${escape(title)}">`,`<meta property="og:description" content="${escape(description)}">`,`<meta property="og:image" content="${escape(image)}">`,`<meta property="og:image:alt" content="${escape(product?.name || site.name)}">`,'<meta property="og:type" content="website">','<meta property="og:locale" content="es_CL">','<meta name="twitter:card" content="summary_large_image">')
  return tags.map(tag=>tag.replace(/^<[^>]+/,opening=>opening+' data-newen-seo=""')).join('\n')
}
