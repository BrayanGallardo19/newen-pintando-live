import assert from 'node:assert/strict'
import {render} from '../.ssr/entry-server.js'
const server=render('/').html
try {
 globalThis.window={matchMedia:()=>({matches:true})}
 const mobile=render('/').html
 assert.equal((mobile.match(/class="product-card"/g)||[]).length,(server.match(/class="product-card"/g)||[]).length,'El primer render móvil debe coincidir con el HTML del servidor antes de aplicar la paginación responsive')
 assert.equal(mobile,server,'El HTML inicial no debe depender del viewport')
} finally {delete globalThis.window}
console.log('HTML inicial coherente entre servidor y navegador móvil.')
