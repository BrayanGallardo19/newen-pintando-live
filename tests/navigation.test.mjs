import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveRoute, createNavigation, sectionPaths, isPlainClick } from '../src/features/navigation.ts'
const products=[{slug:'dragonite',id:1}]
function setup(url='/') {
 const entries=[{url,state:{unrelated:7}}];let index=0,view,backs=0
 const moves=[]
 const port={url:()=>entries[index].url,state:()=>entries[index].state,scroll:()=>({x:0,y:950}),push:(state,url)=>{entries.splice(index+1);entries.push({state,url});index++},replace:(state,url)=>{entries[index]={state,url}},back:()=>{backs++},move:(...args)=>moves.push(args)}
 const nav=createNavigation(port,products,v=>view=v,'test')
 const go=n=>{index+=n;nav.sync()}
 return {nav,port,go,entries,moves,get view(){return view},get backs(){return backs}}
}
test('menú sin fragmentos resuelve secciones y mantiene enlaces antiguos',()=>{
 for(const [section,path] of Object.entries(sectionPaths)) assert.equal(resolveRoute(path,products).section,section)
 assert.equal(resolveRoute('/#catalogo',products).path,'/catalogo/')
 assert.equal(resolveRoute('/obras/dragonite/',products).product.id,1)
 assert.equal(resolveRoute('/obras/no-existe/',products).kind,'notFound')
})
test('visita directa abre obra; cerrar permanece en catálogo sin volver al sitio externo',()=>{
 const s=setup('/obras/dragonite/');s.nav.sync()
 assert.equal(s.view.product.id,1);assert.equal(s.moves.at(-1)[0],'catalogo')
 s.nav.close();assert.equal(s.port.url(),'/catalogo/');assert.equal(s.backs,0)
})
test('abrir desde catálogo conserva scroll, Atrás cierra y Adelante reabre',()=>{
 const s=setup('/catalogo/');s.nav.navigate('/obras/dragonite/')
 assert.equal(s.view.product.id,1);assert.equal(s.entries[0].state.unrelated,7)
 s.nav.close();s.nav.close();assert.equal(s.backs,1)
 s.go(-1);assert.equal(s.view.kind,'section');assert.deepEqual(s.moves.at(-1)[1],{x:0,y:950})
 s.go(1);assert.equal(s.view.product.id,1)
})
test('menú soporta Atrás/Adelante sin recargar ni duplicar una misma ruta',()=>{
 const s=setup();s.nav.navigate('/catalogo/');s.nav.navigate('/catalogo/');assert.equal(s.entries.length,2)
 s.nav.navigate('/en-movimiento/');s.go(-1);assert.equal(s.view.section,'catalogo')
 s.go(1);assert.equal(s.view.section,'movimiento')
})
test('recarga ignora origen de modal guardado por la instancia anterior',()=>{
 const s=setup('/obras/dragonite/');s.entries[0].state.navigation={session:'previous',modalReturn:true}
 s.nav.sync();s.nav.close();assert.equal(s.port.url(),'/catalogo/');assert.equal(s.backs,0)
})
test('clics modificados conservan apertura nativa en pestaña nueva',()=>{
 const e={button:0,ctrlKey:false,metaKey:false,shiftKey:false,altKey:false,defaultPrevented:false}
 assert.ok(isPlainClick(e));for(const key of ['ctrlKey','metaKey','shiftKey','altKey','defaultPrevented'])assert.ok(!isPlainClick({...e,[key]:true}))
 assert.ok(!isPlainClick({...e,button:1}))
})

test('pulsar la sección actual vuelve a su inicio sin restaurar un scroll antiguo',()=>{
 const s=setup('/catalogo/');s.nav.navigate('/obras/dragonite/');s.go(-1)
 s.nav.navigate('/catalogo/')
 assert.equal(s.moves.at(-1)[1],undefined)
})
test('un ancla de accesibilidad no provoca un desplazamiento a otra sección',()=>{
 const s=setup('/catalogo/#contenido');s.nav.sync()
 assert.equal(s.moves.length,0)
})
