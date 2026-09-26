import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { heroItems, site } from '../content'
import { carouselOffset, carouselPosition, dragCarouselPhase } from '../features/carousel'

const slides = heroItems.length ? heroItems : [{ src: site.heroLandscape, name: site.heroTitle }]

export function Hero() {
  const [phase, setPhase] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [reduced, setReduced] = useState(false)
  const dragOrigin = useRef<{ x: number; y: number; phase: number; moved: boolean } | null>(null)
  const phaseRef = useRef(phase)
  const ignoreClick = useRef(false)
  const active = slides.length ? Math.round(phase) % slides.length : 0

  useLayoutEffect(() => { phaseRef.current = phase }, [phase])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || dragging || reduced || slides.length < 2) return
    let last: number | undefined
    let frame = 0
    const animate = (now: number) => {
      if (last !== undefined && !document.hidden) {
        const elapsed = Math.min(now - last, 64)
        setPhase(current => (current + elapsed / 3600) % slides.length)
      }
      last = now
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [paused, dragging, reduced])

  const move = (direction: number) => {
    if (slides.length) setPhase(current => (Math.round(current) + direction + slides.length) % slides.length)
  }
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    dragOrigin.current = { x: event.clientX, y: event.clientY, phase: phaseRef.current, moved: false }
    ignoreClick.current = false
    setDragging(true)
  }
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragOrigin.current
    if (!start) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (!start.moved && Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
      start.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (start.moved) {
      setPhase(dragCarouselPhase(start.phase, start.x, event.clientX, window.innerWidth, slides.length))
      event.preventDefault()
    }
  }
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragOrigin.current?.moved) ignoreClick.current = true
    dragOrigin.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    window.setTimeout(() => { ignoreClick.current = false }, 0)
  }

  return <section id="inicio" className="hero" style={{ '--hero-image': `url("${site.heroLandscape}")` } as CSSProperties}>
    <div className="hero-inner">
      <div className="hero-copy">
        <p className="hero-kicker">Ilustración · paisaje · imaginación</p>
        <h1>{site.heroTitle}<em>{site.heroAccent}</em></h1>
        <p>{site.heroText}</p>
        <a className="button light" href="/catalogo/">Explorar las obras <span aria-hidden="true">↗</span></a>
      </div>
      <div className="hero-gallery" role="region" aria-label="Carrusel de obras destacadas">
        <div className="carousel-stage" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
          onPointerCancel={() => { dragOrigin.current = null; setDragging(false) }}
          onPointerLeave={event => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) { dragOrigin.current = null; setDragging(false) } }}
          onClickCapture={event => { if (ignoreClick.current) { event.preventDefault(); event.stopPropagation(); ignoreClick.current = false } }}
          onClick={event => { if (event.target instanceof Element && event.target.closest('.carousel-card')) setPaused(value => !value) }}>
          {slides.map((slide, index) => {
            const offset = carouselOffset(index, phase, slides.length)
            const geometry = carouselPosition(offset)
            const visible = Math.abs(offset) < 3
            const style = {
              '--carousel-x': `${geometry.x}vw`,
              '--carousel-y': `${geometry.y}%`,
              '--carousel-scale': geometry.scale,
              '--carousel-rotation': `${geometry.rotation}deg`,
              '--carousel-opacity': geometry.opacity,
              '--carousel-depth': `${geometry.depth}px`,
              '--carousel-order': geometry.order,
            } as CSSProperties
            return <button key={slide.src} type="button" className={'carousel-card' + (active === index ? ' is-active' : '')}
              style={style} aria-hidden={!visible} tabIndex={active === index ? 0 : -1}
              aria-label={(paused ? 'Reanudar carrusel: ' : 'Pausar carrusel: ') + slide.name}>
              <span className="carousel-frame"><img src={slide.src} alt={slide.name} draggable="false" loading={visible ? 'eager' : 'lazy'} /></span>
            </button>
          })}
        </div>
        {slides.length > 0 && <div className="carousel-caption" aria-live={paused || reduced ? 'polite' : 'off'}><strong>{slides[active].name}</strong>{paused && <span>En pausa · haz clic en las ilustraciones para reanudar</span>}</div>}
        {slides.length > 1 && <div className="carousel-controls">
          <button type="button" aria-label="Obra anterior" onClick={() => move(-1)}>‹</button>
          <button type="button" aria-label="Obra siguiente" onClick={() => move(1)}>›</button>
        </div>}
      </div>
      <a className="scroll-cue" href="/colecciones/">Descubre las colecciones <span aria-hidden="true">↓</span></a>
    </div>
  </section>
}
