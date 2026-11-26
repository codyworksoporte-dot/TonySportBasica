# Web básica de Tony Sportswear

## Qué es

La web básica es un **espejo** del sitio oficial [tonysportselsalvador.com](https://www.tonysportselsalvador.com) (WordPress con el tema «Elegante», WPBakery, Slider Revolution y WooCommerce). Tiene la misma estructura, las mismas secciones en el mismo orden, los mismos textos, imágenes y enlaces, y se comporta igual en computadora y en celular. Lo único que cambia es la piel: usa **nuestros colores, dibujos y botones** (el sistema visual del rediseño Tony 2026).

La maquetación es siempre la oficial. Del rediseño anterior solo quedan los colores, los botones, el logo 2026, los dibujos del cocodrilo y las tipografías: ninguna sección, tarjeta ni maqueta del rediseño aparece en una página espejo.

Está hecha con Next.js 16.3.6 (app router, React 19, TypeScript estricto) y se publica como una exportación estática. Vive en su propia carpeta, separada del proyecto original `TonySportWeb`, que no se toca.

La asesora y todo el proceso de «Crea tu pedido» son los del rediseño y quedan exactamente como están (ver [Qué está protegido](#qué-está-protegido)).

## Cómo correrla

Se necesita Node.js 22.9 o posterior. Desde la carpeta `web basica`:

```sh
npm install
npm run dev
```

Abre [http://127.0.0.1:3001](http://127.0.0.1:3001). La web básica usa el **puerto 3001** para no chocar con el proyecto original, que corre en el 3000. Si el servidor ya está abierto, no hace falta abrir otro: Next avisa y muestra la dirección del que está corriendo.

Para revisar tipos: `npm run typecheck` (o `npx tsc --noEmit`).

## Cómo se actualizan los datos y las imágenes del sitio oficial

Todo lo que viene del sitio oficial se descarga con scripts que solo leen de `tonysportselsalvador.com`.

1. **Datos y referencia**: `node scripts/oficial/capturar.mjs`
   - Descarga de las API públicas de WordPress y WooCommerce los productos y las categorías: `data/oficial/productos.json` (241 productos al 25 de noviembre de 2026, con nombre, precios, imágenes, categorías, descripciones y enlace) y `data/oficial/categorias.json` (51 categorías con imagen, categoría madre y conteo). Estos archivos sí los usa el sitio.
   - Captura cada página oficial en computadora (1440 px) y celular (390 px) dentro de `referencia-oficial/`: capturas (`desktop.jpg`, `mobile.jpg`), el HTML ya renderizado (`page.html`) y un esquema de bloques (`outline-desktop.json`, `outline-mobile.json`) con textos, tipografías, colores, posiciones, imágenes, botones, menús, pie, elementos flotantes y ventanas emergentes. También guarda `paginas-wp.json` (las 52 páginas de WordPress) y `reporte.json` (índice de lo capturado).
   - Con nombres al final (`node scripts/oficial/capturar.mjs inicio app-tony`) recaptura solo esas páginas y no vuelve a bajar los datos.
   - `referencia-oficial/` es material de consulta local: está en `.gitignore` y no se publica.
2. **Solo el catálogo**: `node scripts/oficial/datos.mjs` muestra qué cambió en la Store API (productos retirados o nuevos, campos cambiados, conteos de categorías) sin tocar nada; `node scripts/oficial/datos.mjs --escribir` guarda los dos JSON con el mismo formato. No recaptura las páginas.
   - La Store API oculta las categorías sin productos. Las que el menú enlaza aunque estén vacías (hoy «Camisas Full Sublimadas», `/categoria/camisa-full-sublimada/`) se declaran en `lib/oficial/catalogo.ts` (`CATEGORIAS_VACIAS`): tienen ruta y muestran el archivo vacío oficial, pero no aparecen en los desplegables, igual que en el oficial.
3. **Imágenes**: `node scripts/oficial/imagenes.mjs --ancho-galeria 1000 --sin-audio`
   - Reúne todas las imágenes que usan las páginas capturadas, los productos y las categorías, las descarga, las convierte a WebP y las guarda en `public/assets/oficial/img/`. El índice queda en `data/oficial/imagenes.json` (dirección oficial → archivo local con su ancho y alto); las que fallan, en `imagenes-fallidas.json`, y las que viven fuera del dominio oficial (que no se descargan), en `imagenes-externas.json`. Sin `--sin-audio` también baja el audio del pie a `public/assets/oficial/audio/`.
   - Se puede repetir sin miedo: reutiliza lo que ya está en disco y solo baja lo que falta. Opciones: `--dry` (solo muestra qué haría), `--limite N`, `--sin-audio`, `--solo-audio`, `--ancho-galeria N` (limita a N px las fotos que solo usan las galerías de producto).
   - Cuando el oficial cambia fotos, las viejas salen del índice pero sus archivos quedan en `public/assets/oficial/img/`: los que ya no figuran en `imagenes.json` se pueden borrar.
   - En el código, `lib/oficial/imagenes.ts` traduce una dirección de imagen oficial a su copia local (ya con el prefijo de publicación).

Para comparar el espejo con la referencia:

- `node scripts/oficial/cobertura.mjs [página…]` abre cada página capturada en el espejo (por defecto `http://127.0.0.1:3001`) e informa qué textos, imágenes y enlaces oficiales faltan, los errores de consola y el estado HTTP. Deja el detalle en `referencia-oficial/cobertura-<páginas>.json`. Entiende las variantes de tamaño de WordPress, `mailto:` y los enlaces de WhatsApp.
- `node scripts/oficial/lado-a-lado.mjs [--vista=escritorio|celular] [página…]` arma el tablero oficial | espejo en `referencia-oficial/lado-a-lado/<página>-<vista>.jpg`.

## Mapa de rutas final

Regla general: **la ruta del espejo es la misma que la oficial**. En desarrollo Next responde sin la barra final (redirige `/ruta/` a `/ruta`); la exportación publicada usa `trailingSlash`, así que allí todas terminan en `/`.

Las piezas comunes del espejo están en `components/espejo/` y los datos oficiales en `lib/oficial/` y `data/oficial/`. Cada grupo de páginas tiene su carpeta de componentes y su hoja de estilos con prefijo propio (`wb-<grupo>-`).

### Marco común

`app/layout.tsx` monta en todas las páginas la barra superior (lema, WhatsApp, correo y redes), la cabecera (`Cabecera`: logo 2026 como enlace simple a Inicio, carrito con su contador real, menú de escritorio en dos filas o tres hasta 1280 px, y menú de celular), el pie (`Pie`: «¿Requieres más información?» con el reproductor de audio, «Explora nuestras categorías» con el desplegable que marca la categoría actual, y «Sobre nosotros» con nuestro cocodrilo) y los flotantes (burbuja de WhatsApp, «IDIOMA »» y carrito flotante, ocultos en `/configurador`). El menú (13 entradas, 59 enlaces), el pie y los widgets salen de `lib/oficial/menu.ts`. Las pestañas usan la plantilla «%s | TONY SPORTSWEAR EL SALVADOR».

### Las 13 entradas del menú

| Menú oficial | Ruta (oficial = espejo) | Carpeta de componentes | Notas |
| --- | --- | --- | --- |
| Inicio | `/` | `components/espejo/inicio/` | Carrusel con las 19 diapositivas (la 3.ª con su botón «MAS DISEÑOS»), los 3 círculos, bienvenida con el logo 2026, banda de contacto, «LO QUE NOS DISTINGUE» y banda lima |
| CREÁ TU PEDIDO | `/crea-tu-pedido/` | `components/espejo/pedido-app/` | Los dos enlaces muestran el texto oficial y llevan a `/configurador` (protegido) |
| App Tony | `/app-tony/` | `components/espejo/pedido-app/` | Submenú: «Descarga App Tony Sportswear» (`/app-tony/`) y «Premios App» (`/categoria/premios-app/`) |
| Tienda en Línea | `/tienda-en-linea/` | `components/espejo/tienda/` | Submenú: 4 categorías |
| Productos | `/productos3/` | `components/espejo/tienda/` | Submenú de 3 niveles con `/subliminado/`, `/tipo-de-sublimando/`, `/replica/`, `/uniformes-bkb/` y las categorías; `/producto/` muestra la misma página (la enlaza el carrito protegido) |
| Promociones | `/promociones/` | `components/espejo/promos/` | Vacía en el oficial; el submenú «PROMOCIONES» lleva a `/categoria/promo-inicio-de-ano/` |
| Patrocinio | `/patrocinadores/` | `components/espejo/promos/` | |
| Nuestras tiendas | `/nuestras-tiendas/` | `components/espejo/tiendas-contacto/` | 14 tiendas con sus datos, mapas y videos (`tiendas.ts`) |
| Nuestra Calidad | `/nuestra-calidad/` | `components/espejo/calidad-nosotros/` | Submenú: categorías «Lineas de Tela» y «Costuras» |
| Servicio a domicilio | `/servicio-a-domicilio/` | `components/espejo/tiendas-contacto/` | |
| Contacto | `/contacto/` | `components/espejo/tiendas-contacto/` | El formulario abre WhatsApp con los datos (el cuestionario «¿Cuánto es 5 + 3?» se valida) |
| Tony News | `/tony-news/` | `components/espejo/contenido/` | 7 videos |
| RSE-TONY | `/categoria/rse-tony/` | `components/espejo/catalogo/` | Archivo de categoría |

### Otras páginas oficiales

Páginas de WordPress que existen en el oficial, enlazadas desde el submenú, desde otras páginas o sin enlace (como en el oficial):

| Ruta | Carpeta de componentes | Notas |
| --- | --- | --- |
| `/app-tony/descarga-nuestra-app/`, `/premios-app/` | `components/espejo/pedido-app/` | Vacías en el oficial |
| `/tienda-en-linea/street-wear/`, `/tienda-en-linea/camisas-venta-individual/` | `components/espejo/tienda/` | Vacías en el oficial |
| `/subliminado/`, `/tipo-de-sublimando/`, `/replica/`, `/uniformes-bkb/`, `/confeccion-de-uniformes-personalizados/`, `/politica-de-privacidad/`, `/implementos-deportivos/` | `components/espejo/contenido/` | La URL oficial `/productos/confeccion-de-uniformes-personalizados/` también responde (alias) |
| `/quienes-somos/`, `/proyectos/`, `/testimoniales-productos/`, `/blog/`, `/galeria/` | `components/espejo/calidad-nosotros/` | Galería con visor y testimonios en carrusel |
| `/copa-tony-sportswear/`, `/paquetes/`, `/eventos/` | `components/espejo/promos/` | |
| `/como-comprar/`, `/mi-cuenta/` | `components/espejo/tiendas-contacto/` | `/mi-cuenta/` es el marco oficial con nuestra cuenta protegida dentro |
| `/catalogo/` | `components/espejo/tienda/` | |

En total son 35 páginas de WordPress: las 36 de `PAGINAS_ESPEJO` en `lib/oficial/enlaces.ts` menos `/carrito/`, que es nuestro (`/productos/` es la primera página de la tienda). A ellas se suman los alias `/producto/` y `/productos/confeccion-de-uniformes-personalizados/`.

### Plantillas de WooCommerce (rutas dinámicas)

| Oficial | Archivo en el espejo | Páginas exportadas | Datos |
| --- | --- | --- | --- |
| `/productos/` y `/productos/page/<n>/` | `app/productos/page.tsx`, `app/productos/page/[n]/page.tsx`, `components/espejo/tienda/` | 21 (241 productos, 12 por página) | `data/oficial/productos.json` |
| `/categoria/<categoría>/` y `/page/<n>/`, también la forma anidada `/categoria/<madre>/<hija>/` que enlaza el menú | `app/categoria/[...ruta]/page.tsx`, `components/espejo/catalogo/` | 65 (52 categorías, incluida la vacía «Camisas Full Sublimadas», con su paginación y las 4 formas anidadas) | `data/oficial/categorias.json` + `CATEGORIAS_VACIAS` |
| `/producto/<producto>/` | `app/producto/[slug]/page.tsx`, `components/espejo/catalogo/` | 241 (incluye los slugs numéricos, como `/producto/38313/`) | `data/oficial/productos.json` |

Como la publicación es estática, cada ruta dinámica genera todas sus páginas con `generateStaticParams` y `dynamicParams = false`. Buscar, Filtrar por precio y Ordenar se resuelven en el navegador con el índice estático `/productos/indice.json` (`app/productos/indice.json/route.ts`). El conteo usa el texto oficial: «Mostrando el único resultado», «Mostrando todos los resultados N» (2 a 12) y «Mostrando 13–24 de 35 resultados».

### Casos especiales

- **Lo nuestro reemplaza lo oficial**: el carrito y la finalización de compra oficiales (`/carrito/`, `/finalizar-compra/`) son nuestro `/carrito`, del proceso protegido. `enlaceLocal()` (`lib/oficial/enlaces.ts`) traduce esos enlaces.
- **Páginas «Index of»**: `/implementos-deportivos/`, `/galeria/`, `/mi-cuenta/` y `/eventos/` muestran en el oficial un listado de carpeta de Apache. El espejo muestra en su lugar la página de WordPress de cada una.
- **Rutas nuestras que se conservan**: `/configurador` y `/configurador/archivo`, `/carrito`, `/cuenta`, `/recientes`, `/colecciones`, `/privacidad`, `/terminos` y `/cookies` (la enlaza la página protegida de privacidad).
- **Rutas del rediseño que se retiraron** porque no existen en el sitio oficial: `/resenas`, `/nosotros`, `/patrocinio`, `/calidad`, `/consulta`, `/entregas`, `/implementos`, `/lineas`, `/tiendas`, `/actualidad`, `/comunidad` y `/ayuda`. Responden «página no encontrada». Su código (cabecera, pie y portada del rediseño, asistente, explorador de líneas, etc.) también se retiró.
- Las páginas de `paginas-wp.json` que el menú no enlaza (por ejemplo `inicio2`, `blog-2`, `sucursales` o `videos`) no se copiaron; si hicieran falta, se agregan a la lista de `scripts/oficial/capturar.mjs`.

## La regla de piel

| Del sitio oficial | Nuestro |
| --- | --- |
| Estructura y maquetación: secciones, orden, columnas y comportamiento en computadora y celular | Colores: los tokens `--tc-*` de `app/tony-c.css` y su traducción `--wb-*` en `app/espejo.css` |
| Textos, literales y en español (con sus mayúsculas, tildes y signos) | Logo 2026 (`public/assets/brand/tony-logo.webp` y `tony-logo-480.webp`) y dibujos del cocodrilo (`components/TonyArt.tsx`: `TonyFace`, `TonyBadge`, `TonyHead`) |
| Imágenes de contenido (las copias locales de `public/assets/oficial/img/`) | Botones `.tc-btn` con su corte biselado y sus variantes |
| Enlaces y destinos | Tipografías: Barlow Condensed (`--font-display`) y Archivo (`--font-body`); iconos de `components/Icon.tsx` y `components/espejo/Iconos.tsx`; animaciones `LagartoIntro` y `RouteTransition` |

Cómo se traducen los colores y botones oficiales:

- Verde fosforescente → lima `#b4ff35`.
- Fondo verde petróleo de la página → nuestro fondo oscuro liso `--wb-fondo` (`#050a07`); filas negras y gris claro → `--wb-negro` y los tonos de tile, con texto claro. Las escamas de `app/globals.css` solo quedan detrás de las páginas protegidas.
- Bandas de título con foto → la misma foto bajo el velo negro liso al 40 % del patrón oficial (`patterns/01.png`, copiado como `/assets/oficial/img/01-63d4eb.webp`).
- Títulos verdes → lima.
- Botones verdes o turquesa rellenos → `.tc-btn--lime`; botones de contorno → `.tc-btn--ghost` (tamaños `--sm` y `--lg`).
- El logo viejo sobre cuero y la mascota vieja se cambian por el logo 2026 y nuestros dibujos.

Las rutas de imágenes y archivos pasan siempre por `siteAsset('/assets/...')` (de `lib/asset-path.ts`) o `imagenOficial()`, que agregan el prefijo de publicación. Un `url()` dentro de CSS no lo recibe al compilar: evítalo para imágenes de contenido (`scripts/prepare-pages.mjs` solo corrige los fondos decorativos del CSS).

## Diferencias intencionales con el oficial

Son decisiones tomadas, no defectos:

- **Piel**: colores, botones biselados, tipografías propias, logo 2026 y dibujos del cocodrilo; los 3 círculos de la portada usan nuestros iconos.
- **Contenedor**: fluido hasta 1200 px. El oficial salta a anchos fijos de 940, 720 y 440 px.
- **Movimiento**: la entrada del cocodrilo se reproduce una vez por sesión en la primera visita de escritorio a la portada (es nuestro dibujo); el logo de la cabecera es un enlace simple a Inicio y no la repite. No se replican las animaciones de entrada del oficial (WPBakery y Ultimate Addons). La burbuja de WhatsApp se abre sola a los 3 s.
- **Carrusel de la portada**: flechas redondas y botón de pausa en lugar de las flechas del Slider Revolution, imágenes recortadas sin deformarse, y el botón «MAS DISEÑOS» de la 3.ª diapositiva dibujado como uno de nuestros botones (se oculta en el celular, donde el oficial lo deja fuera del encuadre).
- **WhatsApp**: los enlaces al número principal usan `wa.me/50370155571` en lugar de `api.whatsapp.com`.
- **Pedido**: en los productos sueltos, «Pedir por WhatsApp» sustituye a «Añadir al carrito», porque nuestro carrito guarda los diseños del configurador; los enlaces de `/crea-tu-pedido/` muestran el texto oficial pero llevan a `/configurador`; `/mi-cuenta/` muestra nuestra cuenta protegida dentro del marco oficial.
- **Tienda estática**: Buscar, Filtrar por precio y Ordenar funcionan en el navegador; «Ordenar por popularidad» ordena por fecha (la Store API no publica las ventas); los productos relacionados son deterministas (el oficial los elige al azar); el título «PRODUCTOSPRODUCTOS RELACIONADOS» que duplica el tema oficial no se calca.
- **Archivos pesados del oficial**: los videos MP4 de Tony News, de las tiendas y de servicio a domicilio se reproducen o enlazan desde el servidor oficial, porque pesan demasiado para el repositorio. Las imágenes que el oficial toma de otros dominios (imgur, astraps, gstatic, ytimg) no se descargan.
- **Datos**: los errores del oficial (teléfonos, correos y redes de algunas tiendas que no coinciden con su texto) se conservan literales; conviene que el cliente los revise.
- **«Index of»**: `/implementos-deportivos/`, `/galeria/`, `/mi-cuenta/` y `/eventos/` muestran su página de WordPress en lugar del listado de carpeta.
- **Accesibilidad**: un solo h1 por página (solo para lectores de pantalla donde el tema oculta el título), textos alternativos descriptivos, objetivos táctiles de 44 px, foco visible y nada se desborda en el celular (las direcciones largas se cortan en sus barras).

## Qué está protegido

La asesora y el proceso de «Crea tu pedido» quedan **exactamente como están**. Se pueden importar y usar, pero no se editan ni se borran:

- `app/configurador/**`, `components/pedido/**`, `lib/pedido/**`, `data/pedido/**`, `public/assets/pedido/**`, `public/assets/advisor/**`
- `app/carrito/**`, `app/cuenta/**`, `app/recientes/**`, `app/colecciones/**`, `app/privacidad/**`, `app/terminos/**`
- `components/CartExperience.tsx`, `components/AddToCart.tsx`, `components/CartLink.tsx`, `components/CartFeedback.tsx`, `components/Account*.tsx`
- `lib/cart.ts`, `lib/cart-feedback.ts`, `lib/order.ts`, `lib/studio.ts`, `lib/auth.ts`
- `tests/pedido/**`

Lo que el espejo debe respetar para no romperlos: el carrito enlaza a `/producto`, la privacidad enlaza a `/cookies`, y el enlace del carrito de la cabecera anuncia cuántos diseños hay guardados (las pruebas del carrito lo buscan como el enlace de `<header>` cuyo nombre accesible es «Carrito: 1 diseño», «Carrito: 2 diseños»…). Las reglas de `app/espejo.css` que cambian el aspecto de toda la página (como el fondo liso) excluyen a las páginas protegidas por la clase de su `<main>`.

## Cómo probar

Las pruebas usan Playwright con Microsoft Edge (`channel: 'msedge'`) contra `http://127.0.0.1:3001`; si el servidor ya está abierto, lo reutilizan.

```sh
npx playwright test                         # todo
npx playwright test tests/espejo.spec.ts    # aceptación del espejo
npx playwright test tests/pedido            # proceso de pedido (protegido)
```

- **`tests/espejo.spec.ts`** es la prueba de aceptación del espejo y tiene todas sus filas activas (`ready: true`): cada página responde y muestra su título oficial (sacado de `outline-desktop.json`), sin desbordarse a 1440 y 390 px; la cabecera tiene las 13 entradas del menú oficial, en su orden y también en el menú del celular; el pie tiene sus 3 columnas y su desplegable marca la categoría actual con su flecha; la burbuja de WhatsApp enlaza a `wa.me/50370155571`; `/configurador` sigue cargando la asesora; las rutas protegidas responden y las del rediseño dan 404; y axe (wcag2a, wcag2aa, wcag21aa) no encuentra violaciones serias en la portada, `/contacto`, una categoría y un producto. Una página nueva se agrega como fila de `PAGES`; si todavía no está lista, con `ready: false` queda como `test.fixme` (`ESPEJO_TODAS=1` las corre todas igual).
- Las pruebas del configurador, la asesora, el carrito, la cuenta, la intro y las transiciones se conservan (`configurator`, `advisor-mobile`, `editor`, `mobile`, `pedido-*`, `cart`, `collections-directory`, `privacy-storage`, `account`, `intro`, `mobile-transition`, `motion`). La intro y `motion` comprueban además que el logo es un enlace simple a Inicio que no repite la entrada.
- Las pruebas que envían el pedido, pagan con Wompi o usan la IA simulan la API en `/pedido-api`, pero el sitio solo la llama si se compiló con `NEXT_PUBLIC_TONY_API_BASE=http://127.0.0.1:3001/pedido-api`. Playwright pone esa variable cuando él mismo arranca el servidor; si ya hay uno abierto sin ella, esas pruebas fallan con «El servicio de pedidos todavía no está conectado». En ese caso, cierra el servidor y deja que Playwright lo abra, o arráncalo con la variable. Las comprobaciones de axe de `editor.spec.ts` señalan además la lista de definiciones del total (`.pedido-price-total`), que es código protegido.
- La prueba de cuentas reales (`account.spec.ts`) necesita PHP y se corre aparte con `TONY_AUTH_TEST=true`.
- Revisión visual: con Playwright (Edge) en 1440 × 900 y 390 × 844, comparando con `referencia-oficial/<grupo>/<página>/desktop.jpg` y `mobile.jpg` (o con `scripts/oficial/lado-a-lado.mjs`); y `node scripts/oficial/cobertura.mjs` para el contenido.

## Publicación

La web básica se publica aparte del original, bajo su propio prefijo: **`/TonySportBasica`** por defecto. Se cambia con la variable `TONY_PAGES_BASE` (vacía = el valor por defecto; `/` = la raíz del dominio). Debe ser la misma al compilar y al preparar:

```sh
TONY_GITHUB_PAGES=true npm run build
node scripts/prepare-pages.mjs
```

En PowerShell: `$env:TONY_GITHUB_PAGES='true'; npm run build; node scripts/prepare-pages.mjs`.

La exportación genera 374 páginas HTML (las 35 páginas de WordPress del espejo y sus 2 alias, las otras 20 páginas de la tienda, 65 de categorías, 241 de productos, las 9 protegidas y 2 de «página no encontrada») y pesa unos 670 MB, casi todo imágenes.

`scripts/prepare-pages.mjs` deja `out/` lista para GitHub Pages (prefija los fondos del CSS, duplica los datos de navegación que pide el modo estático y crea `.nojekyll`) y se detiene con un mensaje claro si:

- la exportación se compiló con otro prefijo (la portada no carga sus scripts desde `<prefijo>/_next/`);
- la portada no tiene enlaces internos con el prefijo o tiene rutas sin él;
- falta `out/crea-tu-pedido/index.html` o no contiene el texto «CREÁ TU PEDIDO».

Para revisar la exportación antes de subirla:

```sh
node scripts/preview-pages.mjs        # sirve out/ en http://127.0.0.1:4173/TonySportBasica/ (déjalo abierto)
node scripts/smoke-pages.cjs          # intro y logo de la portada publicada, 8 rutas clave y navegación por menú, pie y tarjetas
node scripts/rastrear-enlaces.mjs     # todos los enlaces internos e imágenes desde la portada (--todas: desde cada página)
```

`scripts/smoke-pages.cjs`, `scripts/rastrear-enlaces.mjs`, `scripts/preview-pages.mjs` y `components/LagartoIntroBootstrap.tsx` leen el prefijo de la configuración (`TONY_PAGES_BASE` / `TONY_ASSET_BASE`); el logo es un `next/link` a `/`, así que recibe el prefijo solo.

Esta carpeta está conectada al repositorio público **[codyworksoporte-dot/TonySportBasica](https://github.com/codyworksoporte-dot/TonySportBasica)** (remoto `origin`). Cada subida a `main` ejecuta `.github/workflows/pages.yml` y publica **https://codyworksoporte-dot.github.io/TonySportBasica/**. En ese repositorio, *Settings → Pages → Source* está en *GitHub Actions* y el entorno `github-pages` solo despliega desde `main`. Nunca se sube al repositorio del sitio original (`TonySport`).

El envío de pedidos del configurador queda **sin conectar a propósito** en esta publicación: el repositorio no define `NEXT_PUBLIC_TONY_API_BASE`, así que una copia de demostración no puede crear pedidos reales. Para conectarlo, definir esa variable en *Settings → Secrets and variables → Actions → Variables* y volver a publicar.
