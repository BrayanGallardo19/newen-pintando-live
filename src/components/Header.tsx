import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Site } from '../content/types'

export function Header({ site, count, onQuote, hasVideos }: { site: Site; count: number; onQuote: () => void; hasVideos: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const element = headerRef.current
    if (!element) return
    const measure = () => document.documentElement.style.setProperty('--header-height', `${element.getBoundingClientRect().height}px`)
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => { observer.disconnect(); document.documentElement.style.removeProperty('--header-height') }
    }
    window.addEventListener('resize', measure)
    return () => { window.removeEventListener('resize', measure); document.documentElement.style.removeProperty('--header-height') }
  }, [])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <header ref={headerRef} className={'header' + (scrolled ? ' scrolled' : '')}>
    <a className="brand" href="/" onClick={() => setMenu(false)} aria-label={site.name + ', ir al inicio'}>
      <img src={site.logo} alt="" /><span><strong>{site.name}</strong><small title={site.tagline}>{site.tagline}</small></span>
    </a>
    <button className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(!menu)}>{menu ? 'Cerrar' : 'Menú'} <span aria-hidden>☰</span></button>
    <nav id="main-nav" className={menu ? 'open' : ''} aria-label="Principal" onClick={() => setMenu(false)}>
      <a href="/colecciones/">Colecciones</a><a href="/catalogo/">Catálogo</a>{hasVideos && <a href="/en-movimiento/">En movimiento</a>}<a href="/como-comprar/">Cómo comprar</a>
    </nav>
    <button className="header-quote" onClick={onQuote} aria-label={'Ver mi selección, ' + count + ' obras'}>Mi selección <span>{count}</span></button>
  </header>
}
