# Revisión previa a publicación — 26/09/2026

## Correcciones realizadas

1. Catálogo móvil: el primer render ahora coincide con el HTML generado. La adaptación posterior mantiene 12 obras y dos columnas en móvil; escritorio conserva 16 y cuatro columnas. Se reprodujo la diferencia 12/16 y se agregó una comprobación que ahora pasa.
2. Navegación: pulsar la sección actual vuelve al inicio de esa sección, sin aplicar una posición antigua. Las anclas de accesibilidad no son interceptadas por el desplazamiento del menú. El enlace para saltar al contenido transfiere el foco al contenido.
3. Modales: el desmontaje utiliza el cierre nativo del diálogo, con protección frente a callbacks de cierre después del desmontaje. Se restaura el bloqueo de scroll y el foco anterior.
4. Compatibilidad: el identificador de la sesión de navegación tiene alternativa cuando `crypto.randomUUID` no está disponible, por ejemplo en pruebas HTTP desde otra máquina. No se utiliza como credencial.
5. Videos: un video general sin miniatura y con la lista de imágenes prioritarias vacía usa el paisaje de portada. Se conservan el reproductor, el selector transparente y sus animaciones.
6. Metadatos: los textos opcionales vacíos tienen una descripción de respaldo; se sigue escapando el texto editorial antes de generar etiquetas HTML.
7. CMS: ayudas actualizadas para explicar el vínculo entre identificador y URL y el efecto de ocultar una obra. La ocultación no vuelve privados los archivos multimedia.
8. Publicación: cabeceras `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `X-Frame-Options: DENY`. Configuración de Static Assets para Workers con 404 real, además de las instrucciones existentes para Pages.

## Evidencia

- 37 pruebas unitarias aprobadas.
- TypeScript, validación del contenido y compilación de producción aprobados.
- 40 rutas y 35 modales presentes en HTML; 36 URLs canónicas en sitemap.
- Prueba de coherencia del HTML inicial entre servidor y viewport móvil aprobada. No sustituye una prueba de hidratación en navegador real.
- Verificación de recursos y respuestas HTTP locales 200/301/404/206 aprobada.
- `npm audit --json`: 0 vulnerabilidades conocidas reportadas, incluidas dependencias de desarrollo. Esto no constituye garantía de ausencia de vulnerabilidades.
- YAML del CMS leído y cobertura de campos comprobada para los 40 JSON actuales (sitio, cuatro categorías y 35 obras).
- En una copia temporal aislada se creó una categoría y obra, se compilaron caracteres especiales y campos opcionales vacíos, se editó título/precio manteniendo la URL, se ocultó la obra y luego se eliminó junto con su categoría. Las cuatro compilaciones pasaron; la ocultación retiró el archivo generado y el sitemap, sin conservar salida obsoleta.
- Las obras, categorías, imágenes y videos originales no se modificaron. No se añadieron pagos, cuentas de visitantes ni formularios de datos personales. Enlaces externos abiertos en otra pestaña usan `noopener noreferrer`.

## Verificaciones en el entorno publicado

No se ha publicado ni conectado el dominio. El navegador remoto de este entorno bloquea el acceso a la vista previa local (`ERR_BLOCKED_BY_CLIENT`); no se afirma una inspección visual ni interacción real de escritorio/móvil.

Antes de anunciar la web:

1. Comprobar HTTPS, dominio principal y redirección www. Una URL inexistente debe responder 404.
2. En escritorio y teléfono: menú, apertura y cierre de obras, Escape, Atrás/Adelante, entrada directa y recarga de una URL, filtros, páginas, variantes, selección y mensaje de WhatsApp.
3. Revisar carruseles y reproducción de videos; los navegadores pueden bloquear autoplay y ofrecen controles manuales.
4. Confirmar con el cliente WhatsApp, Instagram y precios pendientes. Son datos comerciales que requieren su validación.
5. Conectar Pages CMS y probar una edición real con su compilación y publicación. La prueba local no valida permisos GitHub, instalación de la app ni despliegue automático.
6. Verificar que la web pública no tenga noindex y enviar el sitemap al configurar Search Console. Los resultados y el rendimiento real requieren medición en el dominio.

## Entrega

Tres ZIP independientes. Extraer los tres en la misma ubicación para formar una única carpeta `newen-pintando-final`. Parte 01 contiene código e imágenes; partes 02 y 03 contienen los nueve videos. El ZIP único anterior quedó descartado por estar truncado.


## Corrección posterior a la prueba en Cloudflare

El despliegue real detectó una incompatibilidad que no habían detectado las pruebas locales: Workers Static Assets rechaza dominios en la columna de origen de `_redirects`. Se retiró esa regla, se documentó su configuración como regla del dominio y se añadió una comprobación a `test:routes`. El nombre del Worker se ajustó a `newen-pintando-live`, según el registro de CI. La compilación local no equivale a un despliegue confirmado.
