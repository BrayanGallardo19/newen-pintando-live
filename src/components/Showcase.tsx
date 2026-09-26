import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { showcaseItems as videos, site } from '../content'
import { dragSelectorPhase, nextVideoIndex, selectorLayout, selectorSlots, VIDEO_GAP_MS } from '../features/showcase'

export function Showcase() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [selectorPhase, setSelectorPhase] = useState(0)
  const [selectorDragging, setSelectorDragging] = useState(false)
  const [selectorWidth, setSelectorWidth] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const selectorRef = useRef<HTMLDivElement>(null)
  const selectorPhaseRef = useRef(selectorPhase)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragRef = useRef<{ x: number; y: number; phase: number; step: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)

  useLayoutEffect(() => { selectorPhaseRef.current = selectorPhase }, [selectorPhase])

  useLayoutEffect(() => {
    const element = selectorRef.current
    if (!element) return
    const measure = () => setSelectorWidth(element.getBoundingClientRect().width)
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const cancelGap = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = null
    setWaiting(false)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!visible || !tabVisible || reducedMotion) {
      cancelGap()
      video.pause()
      return
    }
    video.muted = true
    void video.play().catch(() => { /* Los controles permiten iniciar el video si el navegador bloquea la reproducción. */ })
    return () => video.pause()
  }, [index, visible, tabVisible, reducedMotion, cancelGap])

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    if (!visible || !tabVisible || reducedMotion || selectorDragging || !videos.length) return
    let previous: number | undefined
    let frame = 0
    const animate = (now: number) => {
      if (previous !== undefined) {
        const elapsed = Math.min(now - previous, 64)
        setSelectorPhase(current => current + elapsed / 3600)
      }
      previous = now
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [visible, tabVisible, reducedMotion, selectorDragging])

  if (!videos.length) return null
  const selected = videos[index]
  const layout = selectorLayout(selectorWidth)
  const slots = selectorSlots(selectorPhase, videos.length, layout.sideCount)
  const nearest = new Map<number, number>()
  for (const slot of [...slots].filter(item => item.visible).sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset))) {
    if (!nearest.has(slot.index)) nearest.set(slot.index, slot.slot)
  }

  const select = (next: number) => {
    cancelGap()
    const nextIndex = (next + videos.length) % videos.length
    setIndex(nextIndex)
    if (nextIndex === index && videoRef.current?.paused) {
      if (videoRef.current.ended) videoRef.current.currentTime = 0
      void videoRef.current.play().catch(() => {})
    }
  }

  const handleEnded = () => {
    if (videos.length < 2 || !visible || !tabVisible || reducedMotion) return
    cancelGap()
    setWaiting(true)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setWaiting(false)
      setIndex(current => nextVideoIndex(current, videos.length))
    }, VIDEO_GAP_MS)
  }

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    dragRef.current = { x: event.clientX, y: event.clientY, phase: selectorPhaseRef.current, step: layout.step, moved: false }
    suppressClickRef.current = false
    setSelectorDragging(true)
  }

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragRef.current
    if (!start) return
    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    if (!start.moved && Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
      start.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (start.moved) {
      setSelectorPhase(dragSelectorPhase(start.phase, start.x, event.clientX, start.step))
      event.preventDefault()
    }
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    suppressClickRef.current = dragRef.current.moved
    dragRef.current = null
    setSelectorDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    window.setTimeout(() => { suppressClickRef.current = false }, 0)
  }

  return <section ref={sectionRef} className="section showcase" id="movimiento">
    <div className="section-head"><div><p className="eyebrow">03 / En movimiento</p><h2>Las obras <em>cobran vida.</em></h2></div><p>Descubre los detalles de cada pieza desde otra perspectiva.</p></div>
    <div className="showcase-stage">
      <video key={selected.src} ref={videoRef} controls muted playsInline preload="metadata" poster={selected.poster} aria-label={selected.name} onEnded={handleEnded} onPlay={cancelGap}>
        <source src={selected.src} type="video/mp4" />
      </video>
      <div className="showcase-story">
        <span>{String(index + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
        <h3>{selected.name}</h3><p>{selected.description}</p>
        <p className="showcase-status" role="status" aria-live="polite">{waiting ? 'Siguiente video en 2,5 segundos…' : '\u00a0'}</p>
        <div className="carousel-controls"><button onClick={() => select(index - 1)} aria-label="Video anterior">←</button><button onClick={() => select(index + 1)} aria-label="Video siguiente">→</button></div>
      </div>
    </div>
    <div className="showcase-navigation">
      <button className="showcase-strip-arrow" onClick={() => select(index - 1)} aria-label="Seleccionar video anterior">←</button>
      <div ref={selectorRef} className="video-strip showcase-carousel" role="group" aria-label="Elegir video" onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={event => { dragRef.current = null; setSelectorDragging(false); if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onPointerLeave={event => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) { dragRef.current = null; setSelectorDragging(false) } }} onClickCapture={event => {
        if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); suppressClickRef.current = false }
      }}>
        {slots.map(({ slot, index: i, offset, visible: shown }) => {
          const item = videos[i]
          const distance = Math.min(Math.abs(offset), 4.5)
          const accessible = shown && nearest.get(i) === slot
          const style = {
            '--selector-x': `${offset * layout.step}px`,
            '--selector-y': `${-2 + distance * 1.5}%`,
            '--selector-scale': Math.max(.68, 1 - distance * .075),
            '--selector-turn': `${-Math.tanh(offset * .45) * 29}deg`,
            '--selector-opacity': Math.max(.62, 1 - distance * .08),
            '--selector-depth': `${55 - distance * 24}px`,
            '--selector-order': 20 - Math.round(distance * 2),
          } as CSSProperties
          return <button key={slot} className="showcase-carousel-card" data-visible={shown} style={style} aria-hidden={!accessible} tabIndex={accessible ? 0 : -1} aria-pressed={i === index} onClick={() => select(i)} aria-label={'Ver video: ' + item.name}>
            <img src={item.poster || site.heroImages[0] || site.heroLandscape} alt="" loading="lazy" draggable={false} /><span>{item.name}</span>
          </button>
        })}
      </div>
      <button className="showcase-strip-arrow" onClick={() => select(index + 1)} aria-label="Seleccionar video siguiente">→</button>
    </div>
  </section>
}
