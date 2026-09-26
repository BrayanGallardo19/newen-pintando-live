import { site } from '../content'

export function Footer() {
  return <footer className="footer" id="como-comprar"><div className="footer-inner">
    <p className="eyebrow">04 / Cómo comprar y conectar</p><h2>De la galería <em>a tus manos.</em></h2><p>Explora las obras y conversemos sobre tu selección.</p>
    <div className="footer-grid"><ol><li><span>01</span><div><h3>Explora</h3><p>Recorre las colecciones y abre cada obra para ver imágenes y videos.</p></div></li><li><span>02</span><div><h3>Elige</h3><p>Reúne hasta diez obras y escoge la variante que te interese.</p></div></li><li><span>03</span><div><h3>Conversemos</h3><p>Envía tu selección por WhatsApp para confirmar disponibilidad y precio.</p></div></li></ol><div className="footer-contact" id="contacto"><h3>¿Una obra te encontró a ti?</h3><p>Escríbenos o sigue el proceso creativo de Newen Pintando.</p><a className="button light" href={'https://wa.me/' + site.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram {site.instagramLabel} ↗</a></div></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span><a href="https://zpages.cl/" target="_blank" rel="noopener noreferrer">Página creada por ZPages ↗</a><a href="/">Volver arriba ↑</a></div></footer>
}
