# Revisión de la versión final con rutas

## Alcance

Base: proyecto original de producción. Cambios limitados a navegación del menú, URLs de ilustraciones, apertura automática del modal, HTML por ruta, metadatos y configuración de entrega. Sin páginas editoriales ni una segunda vista de ficha. CMS y contenido conservados.

## Verificación

- 37 pruebas automatizadas: validación CMS, catálogo, carruseles y ocho casos de navegación.
- Compilación TypeScript, cliente y HTML del servidor finalizadas.
- 40 rutas generadas: cinco secciones y 35 ilustraciones, más página 404.
- Cada ilustración contiene su modal abierto y sus textos en el HTML inicial.
- Sitemap con 36 URLs canónicas; rutas de sección canónicas a inicio, obras con canónico propio.
- Recursos de las páginas y respuestas HTTP 200, 301, 404 y 206 para video verificadas.
- Entrada directa/cierre, Atrás/Adelante, restauración de scroll, enlaces antiguos y clics modificados cubiertos por las pruebas del controlador.

## Límite de la comprobación

El navegador remoto devolvió `net::ERR_BLOCKED_BY_CLIENT` al intentar abrir la vista previa local. No se afirma una comprobación visual ni de hidratación en navegador real. Antes de publicar, probar escritorio y móvil con `npm run preview`: abrir desde catálogo, cerrar con botón y Escape, usar Atrás/Adelante, pegar una URL de obra, recargarla y recorrer las rutas del menú. Confirmar que filtros, página, selección y variantes se conservan al abrir/cerrar un modal.

El proyecto no se publicó ni se subió a GitHub. Queda pendiente conectar repositorio, alojamiento, dominio y CMS, y verificar las rutas en el dominio final. No se garantizan posiciones en Google.

## Ajuste visual del selector de videos

Se eliminaron las sombras exteriores de las miniaturas normales y seleccionadas, que al acumularse y recortarse producían una franja rectangular difuminada. El contenedor tiene fondo transparente. Se conserva el borde de selección, la geometría, las animaciones y el reproductor. Compilación y verificación de rutas repetidas tras el cambio. La limitación de revisión visual en navegador indicada arriba permanece.
