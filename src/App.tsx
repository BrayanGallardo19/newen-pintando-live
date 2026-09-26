import { useEffect, useState } from 'react'
import { products, site, showcaseItems } from './content'
import { toggleSelection, quoteMessage } from './features/catalog'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Collections } from './components/Collections'
import { Catalog } from './components/Catalog'
import { Showcase } from './components/Showcase'
import { Footer } from './components/Footer'
import { Modal } from './components/Modal'
import { ProductModal } from './components/ProductModal'
import { useNavigation } from './hooks/useNavigation'
import { isPlainClick, resolveRoute } from './features/navigation'
import { headMarkup } from './features/metadata'
import './styles.css'

export default function App({initialUrl='/'}: {initialUrl?: string}) {
  const navigation=useNavigation(initialUrl)
  const route=navigation.route
  useEffect(()=>{
    const template=document.createElement('template')
    template.innerHTML=headMarkup(route,site)
    document.head.querySelectorAll('[data-newen-seo]').forEach(element=>element.remove())
    document.head.append(template.content)
  },[route.path])
  const [category, setCategory] = useState('Todos')
  const [collectionRequest, setCollectionRequest] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [variants, setVariants] = useState<Record<number, number | undefined>>({})
  const [quote, setQuote] = useState(false)
  const [notice, setNotice] = useState('')
  const toggle = (id: number) => {
    const result = toggleSelection(selected, id)
    setSelected(result.ids)
    setNotice(result.limitReached ? 'Puedes elegir hasta 10 obras.' : '')
  }
  const chosen = selected.map(id => products.find(product => product.id === id)!).filter(Boolean)
  const message = quoteMessage(chosen, variants)
  return <div onClick={event=>{
    if (!isPlainClick(event)) return
    const anchor=(event.target as Element).closest('a')
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target!=='_self')) return
    const href=anchor.getAttribute('href')
    if (!href || !href.startsWith('/') || href.startsWith('//')) return
    if (resolveRoute(href,products).kind==='notFound') return
    event.preventDefault()
    navigation.navigate(href)
  }}>
    <a href="#contenido" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('contenido')?.focus() }}>Saltar al contenido</a>
    <Header site={site} count={selected.length} hasVideos={showcaseItems.length > 0} onQuote={() => setQuote(true)} />
    <main id="contenido" tabIndex={-1}>{route.kind==='notFound' ? <section className="section" style={{paddingTop:180,background:"var(--forest)",color:"var(--paper)"}}><h1>Esta página no está disponible.</h1><p>La ilustración puede haber cambiado o dejado de estar visible.</p><a className="button dark" href="/catalogo/">Volver al catálogo</a></section> : <><Hero /><Collections choose={slug => { setCategory(slug); setCollectionRequest(value => value + 1) }} /><Catalog collectionRequest={collectionRequest} category={category} setCategory={setCategory} selected={selected} toggle={toggle} /><Showcase /></>}</main>
    <Footer />
    {route.product && <ProductModal key={route.product.slug} product={route.product} onClose={navigation.close} selected={selected} toggle={toggle} variants={variants} setVariant={(id,value)=>setVariants(current=>({...current,[id]:value}))} />}
    {selected.length > 0 && <button className="floating-quote" onClick={() => setQuote(true)}>Mi selección <span>{selected.length}</span></button>}
    <p className="notice" role="status" aria-live="polite">{notice}</p>
    {quote && <Modal titleId="quote-title" className="quote-modal" onClose={() => setQuote(false)}>
      <p className="eyebrow">Tu selección</p><h2 id="quote-title">Cotiza tus obras</h2>
      {chosen.length === 0 ? <p>Agrega obras desde el catálogo para preparar tu consulta.</p> : <>
        <ol>{chosen.map(product => <li key={product.id}><div><strong>{product.name}</strong><small>{variants[product.id] === undefined ? 'Obra original' : product.options[variants[product.id]!]?.label} · {variants[product.id] === undefined ? product.price : product.options[variants[product.id]!]?.price}</small></div><button onClick={() => toggle(product.id)} aria-label={'Quitar ' + product.name}>Quitar</button></li>)}</ol>
        <a className="button dark" href={'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(message)} target="_blank" rel="noopener noreferrer">Enviar solicitud por WhatsApp ↗</a>
      </>}
    </Modal>}
  </div>
}
