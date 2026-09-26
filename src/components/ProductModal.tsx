import { useState } from 'react'
import { categoryName } from '../content'
import type { Product } from '../content/types'
import { Modal } from './Modal'
export function ProductModal({ product: active, onClose, selected, toggle, variants, setVariant }: {
 product: Product; onClose: () => void; selected: number[]; toggle: (id: number) => void
 variants: Record<number,number | undefined>; setVariant: (id:number,value:number | undefined) => void
}) {
 const [media,setMedia]=useState(0)
 const images=[...new Set([...active.images,...active.options.flatMap(option=>option.image ? [option.image] : [])])]
 const video=active.videos[media-images.length]
  return <Modal titleId="detail-title" className="detail-modal" onClose={onClose} initiallyOpen>
      <div className="detail-layout"><div className="detail-visual">
        {video ? <video key={video.src} controls playsInline preload="metadata" poster={video.poster} aria-label={video.label ?? 'Video de ' + active.name}><source src={video.src} type="video/mp4" /></video> : <img src={images[media]} alt={active.name} />}
        <div className="detail-thumbs">{images.map((src, i) => <button key={src} aria-label={'Ver imagen ' + (i + 1)} aria-pressed={media === i} onClick={() => setMedia(i)}><img src={src} alt="" /></button>)}{active.videos.map((item, i) => <button key={item.src} aria-label="Ver video" aria-pressed={media === images.length + i} onClick={() => setMedia(images.length + i)}>{item.poster && <img src={item.poster} alt="" />}<span aria-hidden>▶</span></button>)}</div>
      </div><div className="detail-copy"><p className="eyebrow" title={categoryName(active.category)}>{categoryName(active.category)}</p><h2 id="detail-title">{active.name}</h2><p className="detail-price">{variants[active.id] === undefined ? active.price : active.options[variants[active.id]!]?.price}</p><p className="detail-description">{active.description || active.detail}</p>
        <div className="detail-options">{active.options.length > 0 ? <fieldset className="variants"><legend>Variante para cotizar</legend><label><input type="radio" name="variant" checked={variants[active.id] === undefined} onChange={() => { setVariant(active.id, undefined); setMedia(0) }} /> Obra original · {active.price}</label>{active.options.map((option, index) => <label key={option.label}><input type="radio" name="variant" checked={variants[active.id] === index} onChange={() => { setVariant(active.id, index); setMedia(option.image ? images.indexOf(option.image) : 0) }} /> {option.label} · {option.price}</label>)}</fieldset> : <p className="detail-no-variants">Ilustración sin variantes adicionales.</p>}</div>
        <button className="button dark detail-action" disabled={selected.length >= 10 && !selected.includes(active.id)} onClick={() => toggle(active.id)}>{selected.includes(active.id) ? 'Quitar de mi selección' : selected.length >= 10 ? 'Límite de 10 obras alcanzado' : 'Agregar a mi selección'}</button>
      </div></div>
    </Modal>
}
