# Editar Newen Pintando con Pages CMS

El administrador debe conectar primero el repositorio de producción con Pages CMS y el alojamiento. Esta guía describe la configuración incluida en el proyecto; la conexión y una publicación real todavía deben comprobarse.

## Cambiar una obra

1. Entra en **Obras** y abre la ficha.
2. Cambia el título, el precio, la descripción o la categoría.
3. Guarda y espera a que termine la publicación. Guardar en el editor no significa que el cambio ya esté en la web.
4. Comprueba la ficha en el sitio publicado.

**No cambies Número interno único ni Identificador estable después de crear una ficha.** Para cambiar el nombre visible usa **Título de la obra**. El orden es un campo separado: el número menor aparece primero.

El precio es texto: puedes usar `$15.000`, `Desde $15.000` o `Precio por confirmar`. No se cobra desde la web; se envía una consulta por WhatsApp. Revisa por separado los precios de las variantes.

La descripción aparece en el modal y junto al video de la obra. Si está vacía se usa el resumen alternativo. Escribe texto simple, sin HTML.

## Agregar una obra

1. Comprueba que haya menos de 50 fichas, contando también las ocultas.
2. Crea la categoría primero si todavía no existe.
3. Crea una ficha con un número interno entero que no se repita. Puedes revisar la columna ID de la lista.
4. Define un identificador único, por ejemplo `paisaje-lago-sur`, sin espacios ni tildes.
5. Completa título, precio, categoría y orden; agrega al menos una imagen.
6. Si corresponde, agrega variantes y un video. Guarda y comprueba la publicación.

Para Mew Adventures, incluye `Mew Adventures` y su número en el título. Ese número de serie no reemplaza el número interno de la ficha.

## Ocultar, restaurar o eliminar

Activa **Ocultar obra temporalmente** para retirarla del catálogo, los conteos de colecciones, el carrusel automático y sus videos asociados. Desactívalo para restaurarla. La ficha sigue contando dentro del máximo de 50.

Las imágenes exclusivas de esa obra y sus variantes también se omiten de las prioridades del carrusel. Si una imagen se comparte con otra obra visible, puede seguir apareciendo.

Una portada de colección elegida manualmente o un video agregado en **Videos generales** se gestiona de forma independiente: cambia también esa selección si quieres retirarla.

Ocultar es una herramienta editorial, **no una función de privacidad**: no elimina los archivos del repositorio, del alojamiento ni sus enlaces directos. Las fichas ocultas deben conservar datos válidos; no son borradores incompletos.

Eliminar una ficha es permanente en esa versión del contenido. Para retirarla por un tiempo, usa la opción de ocultar. Al eliminarla, revisa si sus imágenes siguen elegidas como prioridades del carrusel o portadas de colección. No borres archivos multimedia compartidos sin revisar sus usos.

## Imágenes y videos

- La primera imagen de una obra es su portada. Reordena la lista para cambiarla.
- Puedes agregar hasta seis imágenes por obra y hasta tres variantes adicionales a la obra original. Cada variante puede tener su propia imagen; si queda vacía se usa la principal.
- Imágenes: PNG, JPG, JPEG o WebP, hasta **5 MiB** por archivo. Recomendado: WebP de hasta 1600 px en su lado mayor. El sitio conserva sus marcos y proporciones de presentación.
- Videos nuevos o reemplazados: MP4, hasta **45 segundos** y **25 MiB**. Recomendado: H.264 con audio AAC para una mayor compatibilidad.
- Los nueve videos originales conservan la excepción de duración únicamente con sus archivos y rutas originales. Reemplazarlos o volver a subirlos con otra ruta elimina esa excepción.
- Las nuevas cargas reciben nombres generados para reducir colisiones. Para sustituir una imagen, carga la nueva y selecciónala en la ficha. Comprueba la publicación antes de pedir al administrador que limpie archivos antiguos.

El peso y la duración se comprueban al compilar, no al subir al selector. Un archivo que supere 25 MiB bloquea la compilación aunque todavía no esté asociado a una obra. La extensión MP4 no garantiza que todos los dispositivos puedan reproducir el códec; comprueba cada video nuevo.

## Colecciones

Puedes cambiar **Nombre público**, **Orden** y **Portada de la colección**. Si no eliges portada se usa la primera obra visible; si no hay obras se usa el paisaje de portada.

Para crear una colección, define un identificador único y asígnala a las obras. No uses `Todos`: ese filtro lo genera el sitio.

Para eliminar una colección, **primero reasigna todas sus obras**, incluidas las ocultas, y guarda esas fichas. Después elimina la colección. Para renombrarla públicamente cambia su nombre, no su identificador.

## Portada y contacto

Puedes editar el nombre del encabezado y pie, la leyenda bajo el logo, el logo, el paisaje y los textos principales de portada.

**Imágenes prioritarias del carrusel** ordena hasta doce imágenes al comienzo; después se incluyen las demás obras visibles. Vaciar esa lista mantiene el carrusel automático. Si no hay obras ni prioridades, se muestra el paisaje de portada como respaldo.

**Videos generales** admite hasta seis videos independientes; después se agregan los de las obras visibles. Los archivos repetidos se reproducen una sola vez. Si eliminas todos los videos, desaparecen la sección y su enlace del menú.

Para WhatsApp, escribe el número con código de país, sin `+`, espacios ni guiones; por ejemplo `56912345678`. Para Instagram, actualiza tanto el enlace HTTPS como el usuario visible. El validador revisa el formato; debes confirmar que sean las cuentas correctas.

## Límites de texto

| Campo | Máximo de caracteres |
| --- | ---: |
| Nombre del sitio | 40 |
| Leyenda bajo el logo | 60 |
| Título principal / destacado de portada | 60 / 40 |
| Texto de portada | 320 |
| Nombre de colección | 60 |
| Título de obra | 80 |
| Resumen / descripción de obra | 240 / 1200 |
| Precio | 40 |
| Nombre de variante | 60 |
| Nombre o descripción breve del video | 100 |

El sitio no recorta automáticamente el contenido guardado para hacerlo válido. Corrige el campo si supera un límite.

## Si el cambio no aparece

1. Espera a que termine la compilación y recarga el sitio.
2. Si falló, pide al administrador el mensaje del registro. La validación identifica la ficha o el archivo que requiere atención.
3. Corrige y vuelve a guardar. Evita repetir cargas mientras no conozcas el error.

Ejemplos: `categoría inexistente` exige reasignar una ficha; `duplicado` exige otro identificador o nombre de variante; `archivo inexistente` exige seleccionar un recurso disponible; `máximo ... caracteres` exige abreviar ese campo.

Los colores, tamaños del modal, columnas del catálogo, tiempos de transición y código no se editan desde estos formularios. Si necesitas cambiar esa estructura, solicítalo al administrador.


## Enlaces de las ilustraciones

Cada obra visible tiene una URL estable: `https://newenpintando.cl/obras/identificador/`. Puedes copiarla de la barra del navegador al abrir su modal. Al compartirla se abre la página original con ese modal y el catálogo detrás.

Conserva el identificador (`slug`) de las obras publicadas. Puedes cambiar título, descripción y precio sin cambiar su enlace. Ocultar o eliminar una obra retira su página y su entrada del sitemap después de publicar la recompilación; sus archivos de imagen o video siguen siendo públicos si permanecen en el proyecto. Restaurarla con el mismo identificador recupera su URL.


El campo **Logo** también se usa como icono de la pestaña (favicon) en todas las rutas. Para que se reconozca bien a tamaño pequeño, usa una imagen cuadrada con el símbolo centrado. Los navegadores pueden conservar el icono anterior en caché después de publicar.
