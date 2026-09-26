import assert from 'node:assert/strict'
import {readFile,stat} from 'node:fs/promises'
import {join} from 'node:path'
import {once} from 'node:events'
import {routes,canonicalRoutes} from '../.ssr/entry-server.js'
import {createPreviewServer} from './preview.mjs'
const products=[]
for(const path of routes) {
 const html=await readFile(join('dist',path,'index.html'),'utf8')
 assert.ok(html.includes('<main') && !html.includes('<!--app-html-->'),path)
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1,path)
 assert.ok(!html.includes('content="noindex'),path)
 const isProduct=path.startsWith('/obras/')
 const canonical='https://newenpintando.cl'+(isProduct ? path : '/')
 assert.ok(html.includes(`href="${canonical}"`),path)
 for(const href of ['/','/colecciones/','/catalogo/','/en-movimiento/','/como-comprar/'])assert.ok(html.includes(`href="${href}"`),path)
 assert.ok(!/href="#(?:inicio|catalogo|colecciones|movimiento|como-comprar)"/.test(html))
 if(isProduct) {
  assert.ok(/<dialog[^>]*open=""/.test(html),path)
  assert.ok(html.includes('id="detail-title"') && html.includes('detail-description'),path)
  const name=html.match(/<h2 id="detail-title">(.*?)<\/h2>/s)?.[1]
  assert.ok(name && html.includes(`<title data-newen-seo="">${name}`),path)
  products.push(name)
 } else assert.ok(!html.includes('detail-title'),path)
 for(const [,resource] of html.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g))assert.ok(await stat('dist'+resource),resource)
}
assert.equal(new Set(products).size,products.length)
const sitemap=await readFile('dist/sitemap.xml','utf8')
assert.equal((sitemap.match(/<loc>/g)||[]).length,canonicalRoutes.length)
assert.ok(!sitemap.includes('/catalogo/'))
const missing=await readFile('dist/404.html','utf8');assert.ok(missing.includes('noindex') && !missing.includes('rel="canonical"'))
const server=createPreviewServer();server.listen(0,'127.0.0.1');await once(server,'listening')
try {
 const base=`http://127.0.0.1:${server.address().port}`
 for(const path of ['/catalogo/',routes.find(path=>path.startsWith('/obras/'))]) {
  const response=await fetch(base+path);assert.equal(response.status,200);assert.ok((await response.text()).includes('<main'))
 }
 assert.equal((await fetch(base+'/no-existe/')).status,404)
 assert.equal((await fetch(base+'/catalogo',{redirect:'manual'})).status,301)
 const video=await fetch(base+'/assets/video/muestra-general.mp4',{headers:{Range:'bytes=0-15'}})
 assert.equal(video.status,206);assert.equal((await video.arrayBuffer()).byteLength,16)
} finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve))}
console.log(`Verificadas ${routes.length} rutas, ${products.length} modales en HTML, sitemap de ${canonicalRoutes.length} URLs, recursos y HTTP 200/301/404/206.`)
