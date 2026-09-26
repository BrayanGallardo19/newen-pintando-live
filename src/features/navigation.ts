import type { Product } from '../content/types'
export const sectionPaths = { inicio: '/', colecciones: '/colecciones/', catalogo: '/catalogo/', movimiento: '/en-movimiento/', 'como-comprar': '/como-comprar/' } as const
export type Section = keyof typeof sectionPaths
export type Route = { path: string; section: Section; kind: 'section' | 'product' | 'notFound'; product?: Product }
export const productPath = (product: Pick<Product,'slug'>) => '/obras/' + product.slug + '/'
export function resolveRoute(url: string, products: Product[]): Route {
  const parsed = new URL(url,'https://newenpintando.cl')
  let path = parsed.pathname.replace(/\/+$/,'') + '/'
  const legacy = parsed.hash.slice(1) as Section
  if (path === '/' && Object.hasOwn(sectionPaths,legacy)) path = sectionPaths[legacy]
  const section = (Object.entries(sectionPaths).find(([,value]) => value === path)?.[0]) as Section | undefined
  if (section) return { path, section, kind: 'section' }
  const product = products.find(product => !product.archived && productPath(product) === path)
  return product ? { path, section:'catalogo',kind:'product',product } : { path, section:'inicio',kind:'notFound' }
}
export function isPlainClick(event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean }) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.defaultPrevented
}
type Position = { x: number; y: number }
type Marker = { session: string; modalReturn: boolean; position?: Position }
type Port = { url(): string; state(): unknown; scroll(): Position; push(state: unknown,url: string): void; replace(state: unknown,url: string): void; back(): void; move(section: Section,position?: Position,smooth?: boolean): void }
export function createNavigation(port: Port, products: Product[], change: (route: Route) => void, session: string) {
  let closing = false
  const state = () => { const current=port.state();return current && typeof current==='object' ? current as Record<string,unknown> : {} }
  const marker = () => { const value=state().navigation as Marker | undefined;return value?.session===session ? value : undefined }
  const show = (smooth=false, preserve=false) => {
    const route=resolveRoute(port.url(),products)
    change(route)
    if (!preserve) port.move(route.section,marker()?.position,smooth)
  }
  const navigate = (url: string,replace=false) => {
    if (closing) return
    const next=resolveRoute(url,products),current=resolveRoute(port.url(),products)
    if (next.kind==='notFound') return
    if (next.path===current.path) { change(next);port.move(next.section,undefined,true);return }
    if (!replace) port.replace({...state(),navigation:{...marker(),session,modalReturn:marker()?.modalReturn ?? false,position:port.scroll()}},port.url())
    const nextState={...state(),navigation:{session,modalReturn:next.kind==='product' && !replace && current.kind!=='product'} satisfies Marker}
    if (replace) port.replace(nextState,next.path)
    else port.push(nextState,next.path)
    show(next.kind!=='product',next.kind==='product')
  }
  return {
    navigate,
    close() {
      if (closing || resolveRoute(port.url(),products).kind!=='product') return
      if (marker()?.modalReturn) { closing=true;port.back() }
      else navigate('/catalogo/',true)
    },
    sync() {
      closing=false
      const route=resolveRoute(port.url(),products)
      // Normalize legacy section fragments without creating another history entry.
      if (port.url().includes('#') && route.kind==='section' && Object.hasOwn(sectionPaths,port.url().split('#')[1])) port.replace(state(),route.path)
      const hash=new URL(port.url(),'https://newenpintando.cl').hash
      show(false,!!hash && !Object.hasOwn(sectionPaths,hash.slice(1)))
    },
  }
}
