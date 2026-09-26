# Newen Pintando · versión de producción

Sitio estático de React, TypeScript y Vite. Contiene las 35 obras del proyecto de referencia, sus imágenes, variantes, categorías y nueve videos (ocho asociados a fichas y uno general). Los precios pendientes se muestran como **Precio por confirmar**. No hay cuentas de visitantes, pagos ni formularios de datos personales; la selección de hasta diez obras se convierte en un enlace de WhatsApp.

El catálogo muestra hasta **16 obras por página y cuatro columnas en escritorio**, o **12 obras por página y dos columnas en móvil** (hasta 760 px). La búsqueda y los filtros se aplican antes de paginar. El carrusel de portada conserva tarjetas verticales de proporción 3:4 y desplazamiento continuo; no se detiene al pasar el mouse. Un clic en el carrusel lo pausa o reanuda y arrastrar sobre las ilustraciones las desplaza de forma continua. Las flechas permiten avanzar y retroceder.

Las fichas de obra se abren en un modal de tamaño fijo según la pantalla. Título, descripción, variantes y acción tienen áreas definidas: los textos más largos se pueden desplazar dentro del modal sin recortarlos ni alterar el tamaño de la ventana. No hace falta acortar el contenido existente. Las nuevas ediciones tienen límites de texto en el CMS y en la compilación; consulta `GUIA-CLIENTE-CMS.md`.

La sección **En movimiento** mantiene un marco de tamaño fijo en escritorio y tamaños fijos adaptados al ancho en móvil, con independencia de la proporción del video. Reproduce los videos en orden cuando entra en pantalla. Al terminar cada video espera **2,5 segundos** y pasa al siguiente. Su selector de miniaturas distribuye las tarjetas a lo largo del espacio entre las flechas, repite visualmente los videos si hay pocos y conserva el movimiento circular y la profundidad de la portada. Se puede arrastrar sin saltos y un clic elige el video; al soltar o hacer clic, el selector continúa avanzando. La reproducción del video se pausa fuera de la sección o si la pestaña está oculta. Con la opción de movimiento reducido del sistema no avanza automáticamente; siguen disponibles los controles.

## Estructura

- `src/content/site.json`: portada, logo, leyenda bajo el logo, contacto y video general.
- `src/content/categories/*.json`: categorías editables, una por archivo. «Todos» existe solo como filtro.
- `src/content/products/*.json`: obras, una por archivo; `id` y `slug` son identificadores únicos; `order` controla el orden visible.
- `public/assets/`: imágenes y videos. Conservar las rutas utilizadas por las fichas.
- `src/components/`: interfaz pública; `src/features/catalog.ts`: filtros, selección y texto de cotización.
- `.pages.yml`: interfaz editorial de Pages CMS; `scripts/validate-content.mjs`: controles obligatorios previos a la compilación.
- `scripts/original-videos.json`: ruta y huella Git SHA-1 exacta de los nueve videos heredados. Cambiar los bytes de uno hace que se considere nuevo.

## Poner el proyecto en GitHub

Cuando recuperes el acceso a GitHub, **descomprime el ZIP y sube el contenido de la carpeta `newen-pintando-final` a la raíz** de `BrayanGallardo19/newen-pintando-production`. Incluye `.pages.yml`, `.gitignore`, todos los JSON, imágenes, videos y `package-lock.json`. No subas `node_modules`, `dist` ni `.ssr`. El repositorio de referencia `newen-pintando` no se modifica.

También puedes hacerlo desde una terminal autenticada:

```bash
git clone https://github.com/BrayanGallardo19/newen-pintando-production.git
cd newen-pintando-production
# Copia aquí el contenido descomprimido del ZIP, incluidos los archivos ocultos.
git add .
git commit -m "Reconstruir sitio de producción de Newen Pintando"
git push origin main
```

Si la rama predeterminada tiene otro nombre, usa esa rama en el último comando. Revisa los cambios antes del commit si ya había archivos en el destino.

## Ejecutar y verificar

Requiere Node.js 22.18 o posterior de la rama 22, o Node.js 24 o superior. Recomendado: Node.js 24 LTS.

```bash
npm ci
npm run dev
npm test
npm run validate
npm run build
```

`npm run build` ejecuta la validación del contenido, comprueba los tipos y crea `dist/`. Configuración de Cloudflare Pages: conectar el repositorio de producción y su rama de publicación; comando `npm ci && npm run build`, directorio de salida `dist`, Node.js 24 LTS. Cada cambio editorial en esa rama inicia otra compilación; si la validación falla, la publicación nueva queda bloqueada hasta corregir el contenido.

## Editar con Pages CMS

1. Una vez subido el proyecto, entra en [app.pagescms.org](https://app.pagescms.org/) con la cuenta de GitHub que administra el repositorio e instala la aplicación **solo para el repositorio de producción**. Ya existe `.pages.yml`: usa esa configuración.
2. Abre **Portada y contacto** para cambiar textos, paisaje, obras del carrusel, nombre del sitio, leyenda bajo el logo (hasta 60 caracteres), logo, videos generales, usuario de Instagram y número de WhatsApp (código de país, sin `+`). La leyenda también se muestra en móvil. Comprueba esos datos con el cliente antes de publicar.
3. En **Colecciones y categorías**, crea o edita el nombre visible, identificador y orden. Conserva el identificador después de crearla; para cambiar el texto visible edita el nombre. Antes de borrar una categoría, reasigna **todas** sus obras, incluidas las ocultas. Si todavía está en uso, la compilación señalará las fichas pendientes. Puedes elegir una portada por colección; vacía, usa la primera obra visible o el paisaje de portada. «Todos» no se crea aquí.
4. En **Obras**, edita títulos, descripciones, precio, orden, imágenes, hasta tres variantes y un video por ficha; crea una ficha nueva, ocúltala temporalmente o elimina una existente. Ocultar retira la URL de la obra al recompilar; no elimina los archivos multimedia ni restringe sus enlaces directos. Mantén un `id` numérico y un `slug` únicos. Para precios desconocidos usa exactamente «Precio por confirmar». Las obras Mew Adventures deben incluir el nombre de la serie y su número.
5. Guarda los cambios. Pages CMS los escribe en GitHub. Si falla la compilación en Cloudflare, lee el error de `validate` en los registros y corrige la ficha indicada antes de esperar una publicación nueva. Una edición aprobada por el CMS aún puede fallar por reglas que afectan varias fichas.

Límites: máximo **50 obras** (incluidas las ocultas), **6 imágenes**, **3 variantes** y **1 video** por obra. Imágenes hasta **5 MiB** y cualquier archivo hasta **25 MiB**; hay hasta 12 prioridades del carrusel y 6 videos generales. Los videos nuevos o reemplazados deben ser MP4 de **45 segundos o menos**. Los videos legados quedan exentos del límite de tiempo únicamente si la ruta **y la huella exacta del archivo** coinciden con el manifiesto; cambiar el contenido de un archivo legado elimina la excepción. La validación bloquea también IDs/identificadores repetidos, categorías que no existen y recursos ausentes. Pages CMS limita las listas de variantes y videos en el editor; el límite global y la duración se comprueban en la compilación.

### Acceso del cliente

Hay dos caminos, según el acceso que le quieras dar:

- **Colaborador de Pages CMS invitado por correo** (si esa función está disponible en la instancia que usarás): puede editar contenido y medios desde el CMS sin una cuenta GitHub propia; la aplicación realiza los commits. Debes configurar su invitación en Pages CMS.
- **Usuario GitHub con permiso de escritura** en `newen-pintando-production`: puede editar desde Pages CMS, pero ese permiso **también le da acceso al repositorio y su código**. La interfaz editorial no restringe sus permisos de GitHub. Ocultar la página de ajustes y desactivar el renombrado en el CMS tampoco cambia esos permisos. Concédele acceso únicamente al repositorio de producción, nunca al de referencia.

En ambos casos el administrador debe instalar y autorizar la GitHub App para el repositorio de producción. No se ponen tokens ni contraseñas en el sitio o en su código cliente. Configura protección de rama o revisión de cambios si quieres aprobar ediciones antes de publicarlas; esto requiere ajustar el flujo de publicación y permisos según el plan GitHub disponible.

## Falta para salir a producción

- Recuperar el acceso a GitHub y subir el ZIP a `newen-pintando-production`.
- Confirmar con el cliente el número WhatsApp, el perfil Instagram, los precios pendientes y los textos importados.
- Conectar ese repositorio a Cloudflare Pages, comprobar la primera compilación y probar el sitio publicado en móvil y escritorio.
- Vincular el dominio en Cloudflare Pages y ajustar sus registros DNS; estos datos dependen de la cuenta y del dominio definitivo.
- Instalar Pages CMS, invitar al editor y verificar una edición real y su publicación. La interfaz del CMS y la publicación alojada requieren esas conexiones externas; el código y el validador se pueden probar localmente antes.

## Revisión final

Consulta `REVISION-FINAL.md` para ver los ajustes, las verificaciones realizadas y las comprobaciones pendientes en el sitio publicado.

## Edición guiada del cliente

Entrega `GUIA-CLIENTE-CMS.md` al editor. Consulta `REVISION-CMS.md` para conocer los cambios de esta revisión y los límites de protección. Los formularios incluyen ayudas, límites de texto y listas; las comprobaciones entre fichas se realizan al compilar. Las nuevas cargas reciben nombres generados; conserva los archivos originales para mantener las excepciones de duración.


## Versión final: rutas y modales

Esta entrega parte del proyecto original. Conserva sus contenidos, CMS, carruseles, catálogo, paginación, cotizador y estilos. No incorpora las páginas editoriales ni las vistas alternativas de la copia SEO.

| Destino | Ruta |
| --- | --- |
| Inicio | `/` |
| Colecciones | `/colecciones/` |
| Catálogo | `/catalogo/` |
| En movimiento | `/en-movimiento/` |
| Cómo comprar | `/como-comprar/` |
| Ilustración | `/obras/<slug>/` |

Los enlaces del menú desplazan la misma página sin recargarla y cambian su dirección. Funcionan también al abrirlos directamente, recargar y usar Atrás/Adelante. Los antiguos fragmentos de sección siguen siendo compatibles; el enlace de accesibilidad «Saltar al contenido» conserva su ancla interna.

Abrir una ilustración desde el catálogo muestra el modal original con URL propia. Cerrar, pulsar Escape o usar Atrás recupera el catálogo y su estado; Adelante reabre el modal. Al entrar directamente o recargar una URL de obra, se abre ese mismo modal y se sitúa el catálogo detrás. Cerrar una entrada directa reemplaza la dirección por `/catalogo/`, sin regresar al sitio externo.

La compilación genera HTML de cada obra con el modal abierto y su contenido; no requiere un clic para que su título, descripción e imagen estén en el documento. Título, descripción, canónico e imagen social se generan desde el contenido existente. No hay campos CMS adicionales. Mantén estable el `slug`: cambiarlo rompe el enlace anterior; requiere una redirección si ya fue compartido o indexado.

Las cinco rutas del menú muestran la misma página y declaran `/` como canónica. Cada ilustración tiene su propio canónico. El sitemap incluye inicio y obras visibles (36 URLs actuales). Los identificadores inexistentes y las obras ocultas o eliminadas producen 404 tras reconstruir y publicar.

### Compilar y probar esta entrega

```bash
npm ci
npm test
npm run build
npm run test:routes
npm run preview
```

Abre `http://127.0.0.1:4174/` para probar la compilación real y las entradas directas. El servidor local incluye noindex en sus respuestas para pruebas; los archivos de `dist` son de producción e indexables. No publiques una copia de ensayo indexable en otro dominio.

Para Cloudflare Pages: comando `npm run build`, carpeta de salida `dist`, Node.js 24. El dominio previsto es `newenpintando.cl`. La redirección de `www.newenpintando.cl` al dominio principal debe configurarse en las reglas del dominio de Cloudflare; no se incluye en `_redirects` porque Workers no admite orígenes con dominio en ese archivo. No agregues una regla general `/* /index.html 200`: ocultaría los errores 404. Si sustituyes el proyecto anterior, elimina su salida de compilación antes de publicar; el build de Vite ya limpia `dist`.

Comprueba en el dominio publicado la entrada directa de una obra, su cierre, recarga, Atrás/Adelante, rutas del menú y vista móvil. Revisa `REVISION-RUTAS.md` para conocer las verificaciones realizadas y la limitación del navegador de este entorno.


## Revisión previa al dominio (26 de septiembre de 2026)

Consulta `REVISION-PREPUBLICACION.md` para los hallazgos corregidos y las verificaciones. Esta entrega se distribuye en tres ZIP independientes: extrae los tres en la misma carpeta padre para reunir `newen-pintando-final`. No uses el antiguo ZIP único dañado. Los videos no se modificaron en esta revisión.

Si usas Cloudflare **Workers con Static Assets**, se incluye `wrangler.jsonc`: compila con `npm run build` y configura el despliegue de `dist` con ese archivo. Su nombre es `newen-pintando-live`; ajústalo solo si tu Worker tiene otro nombre. Usa `404-page`, no el modo `single-page-application`, para conservar las respuestas 404. El dominio se conecta desde el panel de Cloudflare; no hay credenciales ni identificadores de cuenta incluidos.

Si usas **Pages**, mantén `npm run build` y salida `dist`; no necesita Wrangler para la integración Git. En ambos casos conecta `newenpintando.cl` y, si usarás www, configura también ese dominio. Las cabeceras generadas deshabilitan la detección ambigua de tipos de archivo y la inclusión en marcos de otros sitios. Si necesitas incrustar la web en un iframe, habrá que revisar `X-Frame-Options` expresamente.

Documentación utilizada para revisar el CMS y el alojamiento:
- https://pagescms.org/docs/configuration/content/fields/
- https://pagescms.org/docs/configuration/fields/image/
- https://developers.cloudflare.com/pages/configuration/headers/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/


### Corrección del despliegue en Workers

El Worker conectado en Cloudflare se llama `newen-pintando-live`; el repositorio puede seguir llamándose `newen-pintando-production`. Son nombres independientes. Mantén el comando de compilación `npm run build` y el de despliegue `npx wrangler deploy`.

El archivo generado `dist/_redirects` contiene únicamente:

```text
/inicio / 301
/inicio/ / 301
```

Workers Static Assets exige rutas de origen relativas. No pongas una URL como `https://www.newenpintando.cl/*` en la primera columna de ese archivo. La prueba `npm run test:routes` ahora detecta este error antes de publicar.

Para configurar www al conectar el dominio: en las reglas de redirección del dominio `newenpintando.cl`, crea una regla con condición `http.host eq "www.newenpintando.cl"`, destino dinámico `concat("https://newenpintando.cl", http.request.uri.path)`, estado **301** y opción de **conservar la cadena de consulta** activada. El registro DNS de www debe pasar por el proxy de Cloudflare. Esta regla se configura en el panel del dominio; no se ha creado desde este proyecto.

La advertencia de esbuild en el registro no fue la causa del fallo mostrado: Vite y la generación de las 40 rutas terminaron correctamente. El fallo bloqueante era el formato de `_redirects`.

Referencia: https://developers.cloudflare.com/workers/static-assets/redirects/
