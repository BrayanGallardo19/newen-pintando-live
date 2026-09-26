import { useEffect, useRef, type ReactNode } from 'react'

export function Modal({ onClose, titleId, children, className = '', initiallyOpen = false }: { initiallyOpen?: boolean; onClose: () => void; titleId: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const dialog = ref.current
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (dialog?.open) dialog.removeAttribute('open')
    dialog?.showModal()
    return () => {
      mounted.current = false
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  return <dialog open={initiallyOpen || undefined} ref={ref} aria-labelledby={titleId} className={'modal ' + className} onClose={() => { if (mounted.current) onClose() }} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
  }}>
    <button className="close-button" aria-label="Cerrar" onClick={onClose}>×</button>
    {children}
  </dialog>
}
