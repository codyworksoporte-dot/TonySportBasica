import productosJson from '@/data/oficial/productos.json';
import categoriasJson from '@/data/oficial/categorias.json';
import { enlaceLocal, esExterno, PAGINAS_ESPEJO } from '@/lib/oficial/enlaces';
import { imagenOficial, srcOficial, type ImagenOficial } from '@/lib/oficial/imagenes';

/*
 * Official WooCommerce catalogue (Store API snapshot in data/oficial/).
 * Server-side helper: it imports multi-MB JSON, so call it from server components / generateStaticParams
 * and pass plain values to client components.
 * Order = official archive default ("Ordenar por las últimas", newest first), verified against
 * referencia-oficial/plantillas/categoria-* (12 per page, same products in the same order).
 */

/** Store API price block; amounts are minor units ("1099" = $10.99). */
export type PreciosOficiales = {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min_amount: string; max_amount: string } | null;
};

/** Official image record (URLs are the official ones; resolve them with imagenOficial()). */
export type ImagenProducto = { id: number; src: string; thumbnail: string; srcset: string; sizes: string; nombre: string; alt: string };

export type TerminoOficial = { id: number; nombre: string; slug: string };

export type ProductoOficial = {
  id: number;
  /** From the permalink; can be numeric (e.g. "38313"). */
  slug: string;
  /** Name with HTML entities decoded. */
  nombre: string;
  permalink: string;
  tipo: string;
  sku: string;
  /** Official HTML; render it through localizarHtml() (local links/images, native emoji). */
  descripcionCorta: string;
  descripcion: string;
  enOferta: boolean;
  precios: PreciosOficiales;
  /** Official price_html, untouched. */
  precioHtml: string;
  imagenes: ImagenProducto[];
  categorias: TerminoOficial[];
  etiquetas: TerminoOficial[];
  comprable: boolean;
  enStock: boolean;
  /** Loop button: "Añadir al carrito" or "Más información" (products without price). */
  boton: { texto: string; descripcion: string };
};

export type CategoriaOficial = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  /** Parent category id (0 = top level). */
  padre: number;
  /** Official product count (includes subcategories). */
  conteo: number;
  imagen: ImagenProducto | null;
  permalink: string;
};

export type Paginacion<T> = { items: T[]; pagina: number; totalPaginas: number; total: number; desde: number; hasta: number };

export type PrecioPartes = {
  /** Current price ("$13.99"), range ("$5.00 – $10.00") or '' when the product has no price. */
  actual: string;
  /** Regular price shown struck through when on sale, otherwise null. */
  anterior: string | null;
  desde: string | null;
  hasta: string | null;
  enOferta: boolean;
};

/** Products per archive page on the official site (3 columns x 4 rows). */
export const POR_PAGINA = 12;

// ---------------------------------------------------------------------------
// Raw Store API shapes
// ---------------------------------------------------------------------------
type ImagenApi = { id?: number; src?: string; thumbnail?: string; srcset?: string; sizes?: string; name?: string; alt?: string };
type TerminoApi = { id: number; name: string; slug: string };
type ProductoApi = {
  id: number;
  name: string;
  type?: string;
  permalink: string;
  sku?: string;
  short_description?: string;
  description?: string;
  on_sale?: boolean;
  prices: PreciosOficiales;
  price_html?: string;
  images?: ImagenApi[] | Record<string, ImagenApi> | null;
  categories?: TerminoApi[];
  tags?: TerminoApi[];
  is_purchasable?: boolean;
  is_in_stock?: boolean;
  add_to_cart?: { text?: string; description?: string };
};
type CategoriaApi = { id: number; name: string; slug: string; description?: string; parent?: number; count?: number; image?: ImagenApi | null; permalink?: string };

const ENTIDADES: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’' };

function decodificar(texto: string): string {
  return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entera, cuerpo: string) => {
    if (cuerpo[0] === '#') {
      const hex = cuerpo[1] === 'x' || cuerpo[1] === 'X';
      const codigo = hex ? parseInt(cuerpo.slice(2), 16) : parseInt(cuerpo.slice(1), 10);
      return Number.isFinite(codigo) && codigo > 0 && codigo <= 0x10ffff ? String.fromCodePoint(codigo) : entera;
    }
    return ENTIDADES[cuerpo.toLowerCase()] ?? entera;
  });
}

function aImagen(im: ImagenApi | null | undefined): ImagenProducto | null {
  if (!im || !im.src) return null;
  return { id: im.id ?? 0, src: im.src, thumbnail: im.thumbnail || im.src, srcset: im.srcset ?? '', sizes: im.sizes ?? '', nombre: decodificar(im.name ?? ''), alt: decodificar(im.alt ?? '') };
}

function aTermino(t: TerminoApi): TerminoOficial {
  return { id: t.id, nombre: decodificar(t.name), slug: t.slug };
}

function rutaDePermalink(permalink: string): string {
  const m = /^https?:\/\/[^/]+(\/[^?#]*)/i.exec(permalink);
  return m ? m[1] : permalink;
}

const PRODUCTOS: ProductoOficial[] = ((productosJson as unknown as { products: ProductoApi[] }).products ?? []).map((p) => {
  const imagenes = Array.isArray(p.images) ? p.images : Object.values(p.images ?? {});
  return {
    id: p.id,
    slug: slugDeProducto(p),
    nombre: decodificar(p.name),
    permalink: p.permalink,
    tipo: p.type ?? 'simple',
    sku: p.sku ?? '',
    descripcionCorta: p.short_description ?? '',
    descripcion: p.description ?? '',
    enOferta: Boolean(p.on_sale),
    precios: p.prices,
    precioHtml: p.price_html ?? '',
    imagenes: imagenes.map(aImagen).filter((im): im is ImagenProducto => im !== null),
    categorias: (p.categories ?? []).map(aTermino),
    etiquetas: (p.tags ?? []).map(aTermino),
    comprable: p.is_purchasable !== false,
    enStock: p.is_in_stock !== false,
    boton: { texto: p.add_to_cart?.text ?? 'Añadir al carrito', descripcion: decodificar(p.add_to_cart?.description ?? '') },
  };
});

const CATEGORIAS: CategoriaOficial[] = ((categoriasJson as unknown as { categories: CategoriaApi[] }).categories ?? []).map((c) => ({
  id: c.id,
  slug: c.slug,
  nombre: decodificar(c.name),
  descripcion: c.description ?? '',
  padre: c.parent ?? 0,
  conteo: c.count ?? 0,
  imagen: aImagen(c.image),
  permalink: c.permalink ?? `https://www.tonysportselsalvador.com/categoria/${c.slug}/`,
}));

const PRODUCTO_POR_SLUG = new Map(PRODUCTOS.map((p) => [p.slug, p]));
const PRODUCTO_POR_ID = new Map(PRODUCTOS.map((p) => [p.id, p]));
const CATEGORIA_POR_SLUG = new Map(CATEGORIAS.map((c) => [c.slug, c]));
const CATEGORIA_POR_RUTA = new Map(CATEGORIAS.map((c) => [rutaDePermalink(c.permalink), c]));

// ---------------------------------------------------------------------------
// Products and categories
// ---------------------------------------------------------------------------

/** All 242 official products, newest first (official default order). */
export function productos(): ProductoOficial[] {
  return PRODUCTOS.slice();
}

/** Product by slug ("milan-premier-futsal-no4", "38313"), or null. */
export function producto(slug: string): ProductoOficial | null {
  let clave = String(slug ?? '').replace(/^\/+|\/+$/g, '');
  try {
    clave = decodeURIComponent(clave);
  } catch {
    // Keep the raw value.
  }
  return PRODUCTO_POR_SLUG.get(clave) ?? null;
}

export function productoPorId(id: number): ProductoOficial | null {
  return PRODUCTO_POR_ID.get(Number(id)) ?? null;
}

/** All 51 official categories (Store API order, alphabetical by name). */
export function categorias(): CategoriaOficial[] {
  return CATEGORIAS.slice();
}

export function categoria(slug: string): CategoriaOficial | null {
  return CATEGORIA_POR_SLUG.get(String(slug ?? '').replace(/^\/+|\/+$/g, '')) ?? null;
}

/** Direct children of a category id (0 = top-level categories). */
export function subcategorias(idPadre: number): CategoriaOficial[] {
  return CATEGORIAS.filter((c) => c.padre === Number(idPadre));
}

function idsConDescendientes(id: number): Set<number> {
  const ids = new Set([id]);
  for (let crecio = true; crecio; ) {
    crecio = false;
    for (const c of CATEGORIAS) {
      if (ids.has(c.padre) && !ids.has(c.id)) {
        ids.add(c.id);
        crecio = true;
      }
    }
  }
  return ids;
}

/** Products of a category archive, subcategories included (as WooCommerce does), official order. */
export function productosDeCategoria(slug: string): ProductoOficial[] {
  const c = categoria(slug);
  if (!c) return [];
  const ids = idsConDescendientes(c.id);
  return PRODUCTOS.filter((p) => p.categorias.some((t) => ids.has(t.id)));
}

/** Page `pagina` (1-based, clamped) of a list, POR_PAGINA items per page. */
export function paginar<T>(lista: readonly T[], pagina = 1): Paginacion<T> {
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const actual = Math.min(Math.max(1, Math.floor(Number(pagina) || 1)), totalPaginas);
  const inicio = (actual - 1) * POR_PAGINA;
  const items = lista.slice(inicio, inicio + POR_PAGINA);
  return { items, pagina: actual, totalPaginas, total, desde: items.length ? inicio + 1 : 0, hasta: inicio + items.length };
}

/** WooCommerce result count text: "Mostrando 1–12 de 47 resultados", "Mostrando los 7 resultados", "Mostrando el único resultado". */
export function textoResultados(paginacion: Pick<Paginacion<unknown>, 'total' | 'desde' | 'hasta' | 'totalPaginas'>): string {
  const { total, desde, hasta, totalPaginas } = paginacion;
  if (total === 0) return 'No se encontraron productos que concuerden con la selección.';
  if (total === 1) return 'Mostrando el único resultado';
  if (totalPaginas <= 1) return `Mostrando los ${total} resultados`;
  return `Mostrando ${desde}–${hasta} de ${total} resultados`;
}

/** Newest products, as in the "Últimos productos añadidos" sidebar widget (5 on the official site). */
export function ultimosProductos(cantidad = 5): ProductoOficial[] {
  return PRODUCTOS.slice(0, cantidad);
}

/** Deterministic "Productos relacionados": other products sharing a category, official order (4 on the official site). */
export function productosRelacionados(p: ProductoOficial, cantidad = 4): ProductoOficial[] {
  const ids = new Set(p.categorias.map((t) => t.id));
  return PRODUCTOS.filter((otro) => otro.id !== p.id && otro.categorias.some((t) => ids.has(t.id))).slice(0, cantidad);
}

// ---------------------------------------------------------------------------
// Prices (same text as the official price_html)
// ---------------------------------------------------------------------------
function formatearMonto(monto: string | number | null | undefined, precios: PreciosOficiales): string {
  if (monto === null || monto === undefined || monto === '') return '';
  const unidad = Number.isFinite(precios.currency_minor_unit) ? precios.currency_minor_unit : 2;
  const valor = typeof monto === 'number' ? Math.round(monto) : parseInt(monto, 10);
  if (!Number.isFinite(valor)) return '';
  const absoluto = Math.abs(valor);
  const divisor = 10 ** unidad;
  const entero = String(Math.floor(absoluto / divisor)).replace(/\B(?=(\d{3})+(?!\d))/g, precios.currency_thousand_separator ?? ',');
  const decimales = unidad > 0 ? `${precios.currency_decimal_separator ?? '.'}${String(absoluto % divisor).padStart(unidad, '0')}` : '';
  return `${valor < 0 ? '-' : ''}${precios.currency_prefix ?? '$'}${entero}${decimales}${precios.currency_suffix ?? ''}`;
}

/** A ProductoOficial, or a raw Store API product (prices / on_sale / price_html). */
export type ConPrecio = {
  precios?: PreciosOficiales;
  enOferta?: boolean;
  precioHtml?: string;
  prices?: PreciosOficiales;
  on_sale?: boolean;
  price_html?: string;
};

/** Price pieces for rendering: <del>{anterior}</del> <ins>{actual}</ins> when on sale. */
export function precioPartes(p: ConPrecio): PrecioPartes {
  const precios = p.precios ?? p.prices;
  const enOferta = Boolean(p.enOferta ?? p.on_sale);
  const html = p.precioHtml ?? p.price_html ?? '';
  const vacio: PrecioPartes = { actual: '', anterior: null, desde: null, hasta: null, enOferta: false };
  if (!precios) return vacio;
  if (precios.price_range) {
    const desde = formatearMonto(precios.price_range.min_amount, precios);
    const hasta = formatearMonto(precios.price_range.max_amount, precios);
    if (desde && hasta && desde !== hasta) return { actual: `${desde} – ${hasta}`, anterior: null, desde, hasta, enOferta };
  }
  // Products the official site shows without price (empty price_html, price "0" or "").
  if (precios.price === '' || (html === '' && Number(precios.price) === 0)) return vacio;
  const actual = formatearMonto(precios.price, precios);
  const regular = formatearMonto(precios.regular_price, precios);
  if (enOferta && regular && regular !== actual) return { actual, anterior: regular, desde: null, hasta: null, enOferta: true };
  return { actual, anterior: null, desde: null, hasta: null, enOferta: false };
}

/** Plain text of the official price: "$8.99", "$14.99 $13.99" (old + new when on sale), "$5.00 – $10.00" (ranges) or ''. */
export function precioTexto(p: ConPrecio): string {
  const partes = precioPartes(p);
  return partes.anterior ? `${partes.anterior} ${partes.actual}` : partes.actual;
}

/** Price filter widget label, rounded like WooCommerce (step 10): "Precio: $0 — $110". */
export function rangoDePrecios(lista: readonly ConPrecio[]): { min: number; max: number; etiqueta: string } {
  const valores = lista
    .map((p) => {
      const precios = p.precios ?? p.prices;
      return precios && precios.price !== '' ? Number(precios.price) / 10 ** (precios.currency_minor_unit ?? 2) : NaN;
    })
    .filter((v) => Number.isFinite(v));
  const min = valores.length ? Math.floor(Math.min(...valores) / 10) * 10 : 0;
  const max = valores.length ? Math.ceil(Math.max(...valores) / 10) * 10 : 0;
  return { min, max, etiqueta: `Precio: $${min} — $${max}` };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Slug from the official permalink (/producto/<slug>/); works with raw Store API objects too. */
export function slugDeProducto(p: { permalink?: string | null; slug?: string | null; id?: number | null }): string {
  const m = /\/producto\/([^/?#]+)\/?(?:[?#].*)?$/i.exec(p.permalink ?? '');
  if (m) {
    try {
      return decodeURIComponent(m[1]);
    } catch {
      return m[1];
    }
  }
  return p.slug || String(p.id ?? '');
}

/** Local route of a product: "/producto/<slug>/". */
export function rutaProducto(p: { permalink?: string | null; slug?: string | null; id?: number | null }): string {
  return `/producto/${slugDeProducto(p)}/`;
}

/**
 * Local route of a category archive: "/categoria/<slug>/" or "/categoria/<slug>/page/<n>/" (n > 1).
 * Always the flat slug, also for subcategories (the official menus link those as
 * /categoria/<padre>/<hija>/; enlaceLocal() flattens them to this same route).
 */
export function rutaCategoria(c: { slug: string } | string, pagina?: number): string {
  const slug = typeof c === 'string' ? c : c.slug;
  const n = Math.floor(Number(pagina) || 1);
  return n > 1 ? `/categoria/${slug}/page/${n}/` : `/categoria/${slug}/`;
}

/** Resolves a path or catch-all segments after /categoria/ ("padre/hija/page/2", ["hija"]) to a category and page. */
export function categoriaPorRuta(ruta: string | readonly string[]): { categoria: CategoriaOficial; pagina: number } | null {
  const segmentos = (Array.isArray(ruta) ? ruta.join('/') : String(ruta))
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/[?#].*$/, '')
    .split('/')
    .filter(Boolean);
  if (segmentos[0] === 'categoria') segmentos.shift();
  let pagina = 1;
  const i = segmentos.indexOf('page');
  if (i >= 0) {
    pagina = Math.max(1, Math.floor(Number(segmentos[i + 1]) || 1));
    segmentos.splice(i);
  }
  if (!segmentos.length) return null;
  const encontrada = CATEGORIA_POR_RUTA.get(`/categoria/${segmentos.join('/')}/`) ?? categoria(segmentos[segmentos.length - 1]);
  return encontrada ? { categoria: encontrada, pagina } : null;
}

/** Every product slug, for generateStaticParams of /producto/[slug]/. */
export function slugsDeProductos(): string[] {
  return PRODUCTOS.map((p) => p.slug);
}

/** Every category archive page (page 1 and /page/<n>/), for generateStaticParams. */
export function paginasDeCategorias(): { slug: string; pagina: number; ruta: string }[] {
  return CATEGORIAS.flatMap((c) => {
    const total = paginar(productosDeCategoria(c.slug)).totalPaginas;
    return Array.from({ length: total }, (_, i) => ({ slug: c.slug, pagina: i + 1, ruta: rutaCategoria(c, i + 1) }));
  });
}

/** Shop archive: the official /productos/ lists all products, 12 per page (/productos/page/<n>/). */
export function rutaTienda(pagina?: number): string {
  const n = Math.floor(Number(pagina) || 1);
  return n > 1 ? `/productos/page/${n}/` : '/productos/';
}

/** Every shop archive page (/productos/ and /productos/page/2/ … /page/21/). */
export function paginasDeTienda(): { pagina: number; ruta: string }[] {
  return Array.from({ length: paginar(PRODUCTOS).totalPaginas }, (_, i) => ({ pagina: i + 1, ruta: rutaTienda(i + 1) }));
}

/** Every mirror route: PAGINAS_ESPEJO + shop pages + category pages + product pages. */
export function rutasEspejo(): string[] {
  return [...new Set([...PAGINAS_ESPEJO, ...paginasDeTienda().map((p) => p.ruta), ...paginasDeCategorias().map((p) => p.ruta), ...PRODUCTOS.map((p) => rutaProducto(p))])];
}

// ---------------------------------------------------------------------------
// Official HTML (product descriptions, WordPress content)
// ---------------------------------------------------------------------------
function escaparAtributo(valor: string): string {
  return valor.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function conBaseDelSitio(ruta: string): string {
  const base = process.env.TONY_ASSET_BASE || '';
  if (!ruta.startsWith('/') || (base && (ruta === base || ruta.startsWith(`${base}/`)))) return ruta;
  return `${base}${ruta}`;
}

/**
 * Rewrites official HTML for the mirror: WordPress emoji <img> -> the emoji character,
 * links -> enlaceLocal() (with the site base, external ones open in a new tab),
 * mirrored images -> local WebP (srcset/sizes dropped). Unknown images keep their URL.
 */
export function localizarHtml(html: string): string {
  return String(html ?? '')
    .replace(/<img\b[^>]*\bclass=(["'])[^"']*\bemoji\b[^"']*\1[^>]*>/gi, (etiqueta) => /\balt=(["'])(.*?)\1/i.exec(etiqueta)?.[2] ?? '')
    .replace(/\s(?:srcset|data-srcset|sizes)=(["'])[\s\S]*?\1/gi, '')
    .replace(/(\s(?:src|data-src|data-lazy-src)=)(["'])(.*?)\2/gi, (_, atributo: string, comilla: string, url: string) => {
      const original = decodificar(url);
      const yaLocal = /^\/(?:[^/]+\/)?assets\//.test(original);
      const destino = yaLocal ? original : srcOficial(original, /^\/(?!\/)/.test(original) ? `https://www.tonysportselsalvador.com${original}` : original);
      return `${atributo}${comilla}${escaparAtributo(destino)}${comilla}`;
    })
    .replace(/<a\b([^>]*?)\shref=(["'])(.*?)\2([^>]*)>/gi, (_, antes: string, comilla: string, url: string, despues: string) => {
      const original = decodificar(url);
      const imagen = imagenOficial(original);
      const destino = imagen ? imagen.src : esExterno(original) ? original : conBaseDelSitio(enlaceLocal(original));
      const nueva = esExterno(original) && !imagen && !/\btarget=/i.test(antes + despues) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a${antes} href=${comilla}${escaparAtributo(destino)}${comilla}${despues}${nueva}>`;
    });
}

// ---------------------------------------------------------------------------
// Images (local WebP copies)
// ---------------------------------------------------------------------------

/** Large image of a product (product page / lightbox). */
export function fotoProducto(p: Pick<ProductoOficial, 'imagenes'>, indice = 0): ImagenOficial | null {
  const im = p.imagenes[indice];
  return im ? imagenOficial(im.src) ?? imagenOficial(im.thumbnail) : null;
}

/** Square grid thumbnail of a product (falls back to the large image). */
export function miniaturaProducto(p: Pick<ProductoOficial, 'imagenes'>, indice = 0): ImagenOficial | null {
  const im = p.imagenes[indice];
  return im ? imagenOficial(im.thumbnail) ?? imagenOficial(im.src) : null;
}

/** Category image (square thumbnail by default). */
export function imagenCategoria(c: Pick<CategoriaOficial, 'imagen'>, grande = false): ImagenOficial | null {
  if (!c.imagen) return null;
  return grande ? imagenOficial(c.imagen.src) ?? imagenOficial(c.imagen.thumbnail) : imagenOficial(c.imagen.thumbnail) ?? imagenOficial(c.imagen.src);
}
