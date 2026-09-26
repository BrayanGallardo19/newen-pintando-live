# Revisión editorial de Pages CMS

25 de septiembre de 2026. Alcance: configuración, lectura de datos, validación y comportamiento del sitio ante ediciones.

## Problemas corregidos y mejoras

| Hallazgo | Cambio |
| --- | --- |
| Faltaban límites coherentes de textos y listas | Límites en el editor y en el validador, compatibles con todo el contenido actual |
| El título «Obras destacadas» no explicaba el funcionamiento del carrusel | Campo renombrado a «Imágenes prioritarias» y ayuda que explica la incorporación automática del resto |
| Retirar una obra requería borrarla | Interruptor para ocultar/restaurar, aplicado al catálogo, las colecciones, el carrusel y los videos de obras |
| Portada de colección dependía solo del orden de las obras | Imagen opcional por colección, con respaldo automático |
| Variantes con nombres repetidos producían una selección ambigua | Validación de nombres únicos por obra, ignorando espacios exteriores y mayúsculas |
| Nombres de archivo e identificadores podían confundirse con los títulos | Renombrado de archivos desactivado en la interfaz, campo de nombre de archivo oculto y explicaciones para IDs y códigos |
| Faltaban ayudas para borrar categorías y sustituir medios | Instrucciones junto a los campos y guía para el cliente |
| Nuevos medios podían colisionar por nombre | Nombres generados en nuevas cargas; las rutas existentes no cambian |
| Archivos pesados fallaban tarde al publicar | Máximo de 25 MiB por archivo y 5 MiB por imagen revisado antes de compilar |
| Un JSON dañado no señalaba claramente su ficha | Mensaje con la ruta afectada |
| Borrar todas las fichas podía eliminar la carpeta del repositorio | Validación compatible con carpetas ausentes y mensajes públicos de catálogo vacío |
| El menú mantenía el enlace a una sección de videos inexistente | Enlace condicionado a la lista real de videos |

La configuración general del CMS se oculta de la navegación del editor para reducir cambios accidentales. Esto no es un control de permisos de GitHub.

## Validación y límites de protección

29 pruebas automatizadas aprobadas. Las pruebas verifican las reglas editoriales, ocultación y restauración, archivos pesados, JSON incorrecto, referencias de categorías y un catálogo vacío. La compilación de producción terminó correctamente, incluida la validación y la comprobación TypeScript. También compiló una copia aislada con catálogo y videos vacíos; el contenido original no se alteró. Los 40 registros actuales (35 obras, 4 categorías y configuración general) son compatibles con el esquema editorial.

Las reglas entre archivos se ejecutan con `npm run build`: máximo de 50 fichas, IDs y códigos únicos, categorías existentes, recursos presentes, tamaño y duración de medios. No impiden que Pages CMS guarde primero un cambio inválido en GitHub. El alojamiento debe conservar el comando de compilación documentado para que la validación bloquee la nueva publicación. Los errores se consultan en sus registros, no en un panel personalizado dentro del CMS.

Los IDs y códigos siguen siendo campos editables porque son necesarios al crear fichas. La ayuda pide conservarlos y el validador detecta duplicados y desacuerdos con nombres de archivo. No se implementó un bloqueo condicional por antigüedad que el esquema documentado no ofrece.

Ocultar no elimina medios ni restringe sus URLs. Las referencias manuales en portadas de colección o videos generales son independientes. Tampoco se comprueban la titularidad de los contactos, la exactitud de los precios ni todos los códecs de video.

La prueba con la interfaz real de Pages CMS, sus permisos y una publicación real sigue pendiente de conectar las cuentas. No se modificó GitHub ni se publicó el sitio durante esta revisión.

## Entrega al cliente

Dar al cliente `GUIA-CLIENTE-CMS.md`. Antes de entregar el acceso, probar una obra nueva, una variante, ocultar/restaurar, cambiar una portada y una edición de contacto en el repositorio de producción. Revisar móvil y escritorio tras publicar.

Si se usa una invitación de colaborador de Pages CMS, comprobar el alcance efectivo en la instancia conectada. Dar escritura directa en GitHub también permite modificar código; ocultar ajustes del CMS no elimina ese permiso.

## Agregados posibles para una siguiente etapa

- Textos editoriales de «Cómo comprar» y encabezados secundarios, con campos acotados y valores de respaldo.
- Título SEO, descripción para buscadores e imagen para compartir, integrados en el HTML generado.
- Un flujo de revisión previo a producción mediante rama editorial y vista previa. Requiere configurar las cuentas y acordar quién aprueba.

Se dejan como propuestas: no son funciones incluidas ni conexiones activadas en esta entrega.

## Referencias oficiales

- [Campos, ayudas y validación](https://pagescms.org/docs/configuration/content/fields/)
- [Operaciones de contenido](https://pagescms.org/docs/configuration/content/operations/)
- [Nombres de archivo](https://pagescms.org/docs/configuration/content/filename/)
- [Configuración de medios](https://pagescms.org/docs/configuration/media/)
- [Configuración general](https://pagescms.org/docs/configuration/settings/)
- [Límites de Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/)
