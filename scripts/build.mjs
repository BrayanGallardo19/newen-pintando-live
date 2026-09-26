import { spawnSync } from 'node:child_process'
import { build } from 'vite'
import { readFile,writeFile,mkdir } from 'node:fs/promises'
import { resolve,join } from 'node:path'
import { pathToFileURL } from 'node:url'
for(const file of ['scripts/validate-content.mjs','node_modules/typescript/bin/tsc']) {
 const result=spawnSync(process.execPath,[file,...(file.includes('tsc') ? ['--noEmit'] : [])],{stdio:'inherit'})
 if(result.status!==0)process.exit(result.status || 1)
}
await build()
await build({publicDir:false,build:{ssr:'src/entry-server.tsx',outDir:'.ssr',emptyOutDir:true}})
const {routes,canonicalRoutes,render}=await import(pathToFileURL(resolve('.ssr/entry-server.js')))
const template=await readFile('dist/index.html','utf8')
if(!template.includes('<!--seo-head-->') || !template.includes('<!--app-html-->'))throw new Error('Faltan marcadores HTML')
for(const path of [...routes,'/404.html']) {
 const {html,head}=render(path)
 const output=path==='/404.html' ? 'dist/404.html' : join('dist',path,'index.html')
 await mkdir(resolve(output,'..'),{recursive:true})
 await writeFile(output,template.replace('<!--seo-head-->',()=>head).replace('<!--app-html-->',()=>html))
}
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://newenpintando.cl/sitemap.xml\n')
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+canonicalRoutes.map(path=>`<url><loc>https://newenpintando.cl${path}</loc></url>`).join('\n')+'\n</urlset>\n')
await writeFile('dist/_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n/404.html\n  X-Robots-Tag: noindex\n')
await writeFile('dist/_redirects','/inicio / 301\n/inicio/ / 301\n')
console.log(`Producción: ${routes.length} rutas + 404; ${canonicalRoutes.length} URLs canónicas.`)
