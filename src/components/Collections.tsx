import { categories, products, site } from '../content'
import { isPlainClick } from '../features/navigation'
import { collectionCover } from '../features/editorial'

export function Collections({ choose }: { choose: (slug: string) => void }) {
  return <section className="section collections" id="colecciones">
    <div className="section-head"><div><p className="eyebrow">01 / Colecciones</p><h2>Mundos distintos,<br /><em>un mismo trazo.</em></h2></div><p>Recorre las obras por territorio, relato o técnica. Cada colección abre una mirada distinta al universo Newen.</p></div>
    {categories.length === 0 && <p className="empty">Estamos preparando nuevas colecciones.</p>}
    <div className="collection-grid">{categories.map((category, index) => {
      const works = products.filter(product => product.category === category.slug)
      return <a href="/catalogo/" className="collection-card" key={category.slug} onClick={event => { if (isPlainClick(event)) choose(category.slug) }}>
        <img src={collectionCover(category, works, site.heroLandscape)} alt="" loading="lazy" />
        <span className="collection-shade" aria-hidden="true" />
        <span className="collection-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="collection-caption"><strong>{category.name}</strong><small>{works.length} {works.length === 1 ? 'obra' : 'obras'}</small></span><span className="collection-arrow" aria-hidden>↗</span>
      </a>
    })}</div>
  </section>
}
