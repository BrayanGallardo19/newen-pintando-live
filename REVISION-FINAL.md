# Revisión general · Newen Pintando

Fecha: 25 de septiembre de 2026.

## Ajustes realizados

- Al abrir una colección se limpian la búsqueda anterior y la página del catálogo, incluso al elegir de nuevo la misma colección.
- El modal bloquea el desplazamiento de la página de fondo, devuelve el foco al cerrarse y ya no se cierra por pulsar un espacio vacío dentro de su ventana.
- El límite de diez obras aparece en el botón del modal; sigue siendo posible quitar una obra ya seleccionada.
- Volver a la variante original, o elegir una variante sin imagen propia, restaura la imagen principal.
- Elegir otra vez el video que acaba de terminar lo reinicia, evitando que cancelar la espera lo deje detenido.
- Los campos opcionales vacíos de Pages CMS se normalizan: borrar listas de variantes, videos o imágenes destacadas no provoca errores de lectura.
- El validador informa sobre listas, registros y textos mal formados sin interrumpirse por un error interno. También acepta enlaces de Instagram con o sin `www`.
- La navegación deja espacio para la altura real del encabezado. Se reforzó la distribución de textos largos, categorías, precios y la lista de selección en pantallas estrechas.
- La documentación y los requisitos de Node.js coinciden con el soporte necesario para ejecutar las pruebas TypeScript.

## Verificaciones realizadas

- 29 pruebas automatizadas aprobadas tras la revisión editorial: reglas del catálogo, selección y cotización, geometría del selector, datos opcionales, ocultación, portadas y validación editorial.
- Validación del contenido, comprobación TypeScript y compilación de producción completadas sin errores.
- 35 obras, cuatro categorías y nueve videos MP4 presentes. Las excepciones de duración de los videos originales dependen de su ruta y huella exactas.
- 43 imágenes referenciadas decodificadas y verificadas correctamente.
- Configuración YAML de Pages CMS legible; revisión de sus campos, referencias, listas y medios frente a la documentación oficial.
- Revisión del código y estilos de paginación, modales, carruseles, reproductor, encabezado y contacto.

## Alcance y pendientes

No se pudo realizar una prueba visual e interactiva en navegador: el navegador de revisión bloqueó el acceso al servidor local. Las pruebas automatizadas no sustituyen esa comprobación.

Después de subir y publicar el proyecto, comprobar en móvil y escritorio:

1. Encabezado y portada; carrusel de ilustraciones, arrastre y controles.
2. Catálogo con 16 obras por página y cuatro columnas en escritorio; 12 y dos columnas en móvil.
3. Apertura, cierre, textos largos, variantes y límite de selección en los modales.
4. Selector continuo de videos y reanudación tras clic o arrastre; reproductor de tamaño estable y espera de 2,5 segundos entre videos.
5. Enlaces de contacto y mensaje de WhatsApp con las obras seleccionadas.
6. Una edición real en Pages CMS y su publicación.

Las 35 obras conservan «Precio por confirmar». Confirmar precios y datos de contacto antes del lanzamiento. Esta entrega no publica el sitio ni modifica GitHub.

## Referencias técnicas consultadas

- [Listas de Pages CMS](https://pagescms.org/docs/configuration/content/list/)
- [Campos de Pages CMS](https://pagescms.org/docs/configuration/content/fields/)
- [Medios de Pages CMS](https://pagescms.org/docs/configuration/media/)
- [Referencias de Pages CMS](https://pagescms.org/docs/configuration/fields/reference/)
- [Soporte TypeScript de Node.js](https://nodejs.org/api/typescript.html)

La revisión específica del CMS y la guía del cliente están en `REVISION-CMS.md` y `GUIA-CLIENTE-CMS.md`.
