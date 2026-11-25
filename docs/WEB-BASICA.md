# Web básica de Tony Sportswear

## Qué es

La web básica es un **espejo** del sitio oficial [tonysportselsalvador.com](https://www.tonysportselsalvador.com) (WordPress con el tema «Elegante», WPBakery, Slider Revolution y WooCommerce). Tiene la misma estructura, las mismas secciones en el mismo orden, los mismos textos, imágenes y enlaces, y se comporta igual en computadora y en celular. Lo único que cambia es la piel: usa **nuestros colores, dibujos y botones** (el sistema visual del rediseño Tony 2026).

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

Todo lo que viene del sitio oficial se descarga con dos scripts. Solo leen de `tonysportselsalvador.com`.

1. **Datos y referencia**: `node scripts/oficial/capturar.mjs`
   - Descarga de las API públicas de WordPress y WooCommerce los productos y las categorías: `data/oficial/productos.json` (242 productos con nombre, precios, imágenes, categorías, descripciones y enlace) y `data/oficial/categorias.json` (51 categorías con imagen, categoría madre y conteo). Estos archivos sí los usa el sitio.
   - Captura cada página oficial en computadora (1440 px) y celular (390 px) dentro de `referencia-oficial/`: capturas (`desktop.jpg`, `mobile.jpg`), el HTML ya renderizado (`page.html`) y un esquema de bloques (`outline-desktop.json`, `outline-mobile.json`) con textos, tipografías, colores, posiciones, imágenes, botones, menús, pie, elementos flotantes y ventanas emergentes. También guarda `paginas-wp.json` (las 52 páginas de WordPress) y `reporte.json` (índice de lo capturado).
   - Con nombres al final (`node scripts/oficial/capturar.mjs inicio app-tony`) recaptura solo esas páginas y no vuelve a bajar los datos.
   - `referencia-oficial/` es material de consulta local: está en `.gitignore` y no se publica.
2. **Imágenes**: `node scripts/oficial/imagenes.mjs`
   - Reúne todas las imágenes que usan las páginas capturadas, los productos y las categorías, las descarga, las convierte a WebP y las guarda en `public/assets/oficial/img/`. El índice queda en `data/oficial/imagenes.json` (dirección oficial → archivo local con su ancho y alto); las que fallan, en `imagenes-fallidas.json`, y las que viven fuera del dominio oficial (que no se descargan), en `imagenes-externas.json`. También baja el audio del pie a `public/assets/oficial/audio/`.
   - Se puede repetir sin miedo: reutiliza lo que ya está en disco y solo baja lo que falta. Opciones: `--dry` (solo muestra qué haría), `--limite N`, `--sin-audio`, `--solo-audio`.
   - En el código, `lib/oficial/imagenes.ts` traduce una dirección de imagen oficial a su copia local (ya con el prefijo de publicación).

Para comparar el espejo con la referencia: `node scripts/oficial/cobertura.mjs` abre cada página capturada en el espejo (por defecto `http://127.0.0.1:3001`) e informa qué textos, imágenes y enlaces oficiales faltan. Deja el detalle en `referencia-oficial/cobertura.json`. Acepta `--base=...` y nombres de páginas para revisar solo esas.

## Mapa de rutas: oficial → espejo

Regla general: **la ruta del espejo es la misma que la oficial**, sin la barra final en desarrollo (al publicar se agrega, porque la exportación usa `trailingSlash`).

### Las 13 entradas del menú

| Menú oficial | Ruta oficial | Ruta en el espejo |
| --- | --- | --- |
| Inicio | `/` | `/` |
| CREÁ TU PEDIDO | `/crea-tu-pedido/` | `/crea-tu-pedido` (el pedido en sí se hace en `/configurador`, protegido) |
| App Tony | `/app-tony/` | `/app-tony` |
| Tienda en Línea | `/tienda-en-linea/` | `/tienda-en-linea` |
| Productos | `/productos3/` | `/productos3`; `/producto` es por ahora un marcador (el carrito protegido enlaza ahí) que se convertirá en la página «Productos» |
| Promociones | `/promociones/` | `/promociones` |
| Patrocinio | `/patrocinadores/` | `/patrocinadores` |
| Nuestras tiendas | `/nuestras-tiendas/` | `/nuestras-tiendas` |
| Nuestra Calidad | `/nuestra-calidad/` | `/nuestra-calidad` |
| Servicio a domicilio | `/servicio-a-domicilio/` | `/servicio-a-domicilio` |
| Contacto | `/contacto/` | `/contacto` |
| Tony News | `/tony-news/` | `/tony-news` |
| RSE-TONY | `/categoria/rse-tony/` | `/categoria/rse-tony` |

### Otras páginas oficiales

Siguen la misma regla: `/subliminado`, `/replica`, `/tipo-de-sublimando`, `/quienes-somos`, `/proyectos`, `/como-comprar`, `/politica-de-privacidad`, `/productos`, `/productos/confeccion-de-uniformes-personalizados`, `/uniformes-bkb`, `/copa-tony-sportswear`, `/blog`, `/catalogo`, `/paquetes`, `/testimoniales-productos`, `/premios-app`, `/app-tony/descarga-nuestra-app`, `/tienda-en-linea/street-wear` y `/tienda-en-linea/camisas-venta-individual`.

### Plantillas de la tienda (rutas dinámicas)

| Oficial | Espejo | Datos |
| --- | --- | --- |
| `/categoria/<categoría>/` (y `/page/<n>/` para las siguientes páginas) | `/categoria/[slug]` | `data/oficial/categorias.json` |
| `/producto/<producto>/` | `/producto/[slug]` | `data/oficial/productos.json` |

Como la publicación es estática, cada ruta dinámica genera todas sus páginas con `generateStaticParams`.

### Casos especiales

- **Lo nuestro reemplaza lo oficial**: el carrito oficial (`/carrito/`) es nuestro `/carrito`, y «Mi cuenta» (`/mi-cuenta/`) es nuestra `/cuenta`. Las dos son del proceso protegido.
- **No se copian**: `/implementos-deportivos/`, `/galeria/`, `/mi-cuenta/` y `/eventos/` están rotas en el sitio oficial (muestran un listado de carpeta «Index of»). Las páginas de `paginas-wp.json` que el menú no enlaza (por ejemplo `inicio2`, `blog-2`, `sucursales` o `videos`) no se capturaron; si hicieran falta, se agregan a la lista de `scripts/oficial/capturar.mjs`.
- **Rutas nuestras que se conservan**: `/configurador` y `/configurador/archivo`, `/carrito`, `/cuenta`, `/recientes`, `/colecciones`, `/privacidad`, `/terminos` y `/cookies` (la enlaza la página protegida de privacidad).
- **Rutas del rediseño que se retiraron** porque no existen en el sitio oficial: `/resenas`, `/nosotros`, `/patrocinio`, `/calidad`, `/consulta`, `/entregas`, `/implementos`, `/lineas`, `/tiendas`, `/actualidad`, `/comunidad` y `/ayuda`. Ahora responden «página no encontrada».

## La regla de piel

| Del sitio oficial | Nuestro |
| --- | --- |
| Estructura y maquetación: secciones, orden, columnas y comportamiento en computadora y celular | Colores: los tokens `--tc-*` de `app/tony-c.css` |
| Textos, literales y en español (con sus mayúsculas, tildes y signos) | Logo 2026 (`public/assets/brand/tony-logo.webp` y `tony-logo-480.webp`) y dibujos del cocodrilo (`components/TonyArt.tsx`: `TonyFace`, `TonyBadge`, `TonyHead`) |
| Imágenes de contenido (las copias locales de `public/assets/oficial/img/`) | Botones `.tc-btn` con su corte biselado y sus variantes |
| Enlaces y destinos | Tipografías: Barlow Condensed (`--font-display`) y Archivo (`--font-body`); iconos de `components/Icon.tsx`; animaciones `LagartoIntro` y `RouteTransition` |

Cómo se traducen los colores y botones oficiales:

- Verde fosforescente → lima `#b4ff35`.
- Fondos verde petróleo, negros y gris claro → nuestros fondos oscuros (`#050a07` y los tonos de tile), con texto claro.
- Títulos verdes → lima.
- Botones verdes o turquesa rellenos → `.tc-btn--lime`; botones de contorno → `.tc-btn--ghost` (también hay `--dark`, `--wa`, `--sm` y `--lg`).
- El logo y el cocodrilo viejos se cambian por el logo 2026 y nuestros dibujos.

Las rutas de imágenes y archivos pasan siempre por `siteAsset('/assets/...')` (de `lib/asset-path.ts`), que agrega el prefijo de publicación. Un `url()` dentro de CSS no lo recibe al compilar: evítalo para imágenes de contenido (`scripts/prepare-pages.mjs` solo corrige los fondos decorativos del CSS).

## Qué está protegido

La asesora y el proceso de «Crea tu pedido» quedan **exactamente como están**. Se pueden importar y usar, pero no se editan ni se borran:

- `app/configurador/**`, `components/pedido/**`, `lib/pedido/**`, `data/pedido/**`, `public/assets/pedido/**`, `public/assets/advisor/**`
- `app/carrito/**`, `app/cuenta/**`, `app/recientes/**`, `app/colecciones/**`, `app/privacidad/**`, `app/terminos/**`
- `components/CartExperience.tsx`, `components/AddToCart.tsx`, `components/CartLink.tsx`, `components/CartFeedback.tsx`, `components/Account*.tsx`
- `lib/cart.ts`, `lib/cart-feedback.ts`, `lib/order.ts`, `lib/studio.ts`, `lib/auth.ts`
- `tests/pedido/**`

Lo que el espejo debe respetar para no romperlos: el carrito enlaza a `/producto`, la privacidad enlaza a `/cookies`, y el enlace del carrito de la cabecera anuncia cuántos diseños hay guardados (las pruebas del carrito lo buscan como el enlace de `<header>` cuyo nombre accesible es «Carrito: 1 diseño», «Carrito: 2 diseños»…).

## Cómo probar

Las pruebas usan Playwright con Microsoft Edge (`channel: 'msedge'`) contra `http://127.0.0.1:3001`; si el servidor ya está abierto, lo reutilizan.

```sh
npx playwright test                         # todo
npx playwright test tests/espejo.spec.ts    # aceptación del espejo
npx playwright test tests/pedido            # proceso de pedido (protegido)
```

- **`tests/espejo.spec.ts`** es la prueba de aceptación del espejo: cada ruta responde y muestra su título oficial (sacado de `outline-desktop.json`), sin desbordarse a 1440 y 390 px; la cabecera tiene las 13 entradas del menú oficial, en su orden y también en el menú del celular; el pie tiene sus 3 columnas («¿Requieres más información?», «Explora nuestras categorías», «Sobre nosotros»); la burbuja de WhatsApp enlaza a `wa.me/50370155571`; `/configurador` sigue cargando la asesora; y axe (wcag2a, wcag2aa, wcag21aa) no encuentra violaciones serias en la portada, `/contacto`, una categoría y un producto.
  - Lo que todavía no está construido queda marcado con `test.fixme`. **Para activarlo**, cuando una página esté lista se pone `ready: true` en su fila de `PAGES`. La cabecera, el pie y la burbuja ya están construidos y activos en `CHROME_READY`.
  - Para ver de una vez todo lo que falta: `ESPEJO_TODAS=1 npx playwright test tests/espejo.spec.ts` (en PowerShell: `$env:ESPEJO_TODAS='1'; npx playwright test tests/espejo.spec.ts`).
- Las pruebas del configurador, la asesora, el carrito, la cuenta, la intro y las transiciones se conservan (`configurator`, `advisor-mobile`, `editor`, `mobile`, `pedido-*`, `cart`, `collections-directory`, `privacy-storage`, `account`, `intro`, `mobile-transition`, `motion`). No dependen del diseño de la cabecera, sino de su función, así que la cabecera del espejo debe ofrecer: dentro de `<header>`, el logo como enlace a Inicio (con su imagen) y el enlace del carrito; en el celular, un botón cuyo nombre accesible empiece por «Abrir menú» o «Menú»; y las entradas oficiales del menú («Tony News», «Promociones», «Contacto»…) como enlaces. La capa de ambiente del rediseño (brillo de escamas, rasguños, lagarto que asoma y su botón de pausa) ya no se monta, y sus pruebas se retiraron.
- Las pruebas que envían el pedido, pagan con Wompi o usan la IA simulan la API en `/pedido-api`, pero el sitio solo la llama si se compiló con `NEXT_PUBLIC_TONY_API_BASE=http://127.0.0.1:3001/pedido-api`. Playwright pone esa variable cuando él mismo arranca el servidor; si ya hay uno abierto sin ella, esas pruebas fallan con «El servicio de pedidos todavía no está conectado». En ese caso, cierra el servidor y deja que Playwright lo abra, o arráncalo con la variable.
- La prueba de cuentas reales (`account.spec.ts`) necesita PHP y se corre aparte con `TONY_AUTH_TEST=true`.
- Revisión visual: con Playwright (Edge) en 1440 × 900 y 390 × 844, comparando con `referencia-oficial/<grupo>/<página>/desktop.jpg` y `mobile.jpg`; y `node scripts/oficial/cobertura.mjs` para el contenido.

## Publicación

La web básica se publica aparte del original, bajo su propio prefijo: **`/TonySportBasica`** por defecto. Se cambia con la variable `TONY_PAGES_BASE` (vacía = el valor por defecto; `/` = la raíz del dominio). Debe ser la misma al compilar y al preparar:

```sh
TONY_GITHUB_PAGES=true npm run build
node scripts/prepare-pages.mjs
```

En PowerShell: `$env:TONY_GITHUB_PAGES='true'; npm run build; node scripts/prepare-pages.mjs`.

`scripts/prepare-pages.mjs` deja `out/` lista para GitHub Pages (prefija los fondos del CSS, duplica los datos de navegación que pide el modo estático y crea `.nojekyll`) y se detiene con un mensaje claro si:

- la exportación se compiló con otro prefijo (la portada no carga sus scripts desde `<prefijo>/_next/`);
- la portada no tiene enlaces internos con el prefijo o tiene rutas sin él;
- falta `out/crea-tu-pedido/index.html` o no contiene el texto «CREÁ TU PEDIDO».

El flujo de GitHub Actions (`.github/workflows/pages.yml`) está listo, pero esta carpeta todavía no está conectada a ningún repositorio.

Pendientes conocidos del cambio de prefijo (archivos que no son de esta tarea): `scripts/preview-pages.mjs` y `scripts/smoke-pages.cjs` todavía sirven y revisan `/TonySport`; `components/LagartoIntroBootstrap.tsx` y `components/espejo/LogoEspejo.tsx` comparan la dirección con `/TonySport` para reconocer la portada; y `TONY_FRONTEND_URL` en `.env.example` apunta al sitio del original.
