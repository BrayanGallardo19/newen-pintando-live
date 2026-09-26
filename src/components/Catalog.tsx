import { useEffect, useRef, useState } from 'react'
import { categories, categoryName, products } from '../content'
import { filterCatalog, paginateCatalog } from '../features/catalog'
import { productPath } from '../features/navigation'

export function Catalog({ collectionRequest, category, setCategory, selected, toggle }: {
  collectionRequest: number; category: string; setCategory: (value: string) => void; selected: number[]
  toggle: (id: number) => void
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [mobile, setMobile] = useState(false)
  const catalogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => setPage(1), [category])
  useEffect(() => { setQuery(''); setPage(1) }, [collectionRequest])
  const filtered = filterCatalog(products, category, query)
  const { items: visible, page: currentPage, pages } = paginateCatalog(filtered, page, mobile)
  const changePage = (next: number) => {
    setPage(next)
    catalogRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  return <section ref={catalogRef} className="section catalog" id="catalogo">
    <div className="section-head"><div><p className="eyebrow">02 / El catálogo</p><h2>Explora a <em>tu ritmo.</em></h2></div><p>Busca un paisaje, un personaje o una técnica. Abre cada obra para mirar sus detalles, variantes y videos.</p></div>
    <div className="catalog-tools"><label className="search"><span>Buscar obras</span><input type="search" placeholder="Título, lugar o personaje…" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} /></label>
      <div className="filters" role="group" aria-label="Filtrar por colección">{[{ slug: 'Todos', name: 'Todos' }, ...categories].map(item => <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => { setCategory(item.slug); setPage(1) }}>{item.name}</button>)}</div>
    </div>
    <p className="catalog-count" role="status">{filtered.length} {filtered.length === 1 ? 'obra' : 'obras'}</p>
    {filtered.length === 0 ? <p className="empty">{products.length === 0 ? 'Estamos preparando nuevas obras. Vuelve pronto.' : 'No encontramos obras con esos filtros. Prueba otra búsqueda.'}</p> : <div className="product-grid">{visible.map(product => <article className="product-card" key={product.id}>
      <a className="product-open" href={productPath(product)} aria-label={'Ver detalles de ' + product.name}>
        <span className="product-image"><img src={product.images[0]} alt={product.name} loading="lazy" /></span>
        <span className="product-meta"><small>{categoryName(product.category)}</small><strong title={product.name}>{product.name}</strong><span>{product.price}</span></span>
      </a>
      <div className="product-actions"><span>{product.options.length ? product.options.length + ' variantes' : 'Ilustración'}{product.videos.length ? ' · Video' : ''}</span><button type="button" onClick={() => toggle(product.id)} aria-label={(selected.includes(product.id) ? 'Quitar ' : 'Agregar ') + product.name + (selected.includes(product.id) ? ' de' : ' a') + ' mi selección'} aria-pressed={selected.includes(product.id)}>{selected.includes(product.id) ? '✓' : '+'}</button></div>
    </article>)}</div>}
    {pages > 1 && <nav className="catalog-pagination" aria-label="Páginas del catálogo">
      <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} aria-label="Página anterior">‹</button>
      {Array.from({ length: pages }, (_, index) => <button key={index} type="button" aria-label={'Página ' + (index + 1)} aria-current={currentPage === index + 1 ? 'page' : undefined} onClick={() => changePage(index + 1)}>{index + 1}</button>)}
      <button type="button" disabled={currentPage === pages} onClick={() => changePage(currentPage + 1)} aria-label="Página siguiente">›</button>
    </nav>}

  </section>
}
