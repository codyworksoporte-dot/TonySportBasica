/*
 * Shop archive (WooCommerce /productos/) helpers shared by the server pages and the client results.
 * No JSON imports here: client files may use this module. The server builds ProductoIndice[] with
 * datos-tienda.ts; the client gets the same records from /productos/indice.json.
 * The shop is the same WooCommerce template as the category archives, so its cards are the
 * category cards (TarjetaCatalogo) and its texts come from components/espejo/catalogo/tipos.
 */
import { textoConteo as textoConteoCatalogo, type TarjetaDatos } from '@/components/espejo/catalogo/tipos';

/** Products per archive page on the official site (3 columns x 4 rows). */
export const POR_PAGINA_TIENDA = 12;

/** One product of the shop index (compact keys: the whole catalogue travels as JSON). */
export type ProductoIndice = {
  /** Official id (tiebreaker of the price and popularity orders). */
  id: number;
  /** Name, entities decoded. */
  n: string;
  /** Local route, /producto/<slug>/. */
  h: string;
  /** Square thumbnail: src (site prefix included), width, height. */
  i: [string, number, number] | null;
  /** Price as the official loop shows it ('' = no price). */
  p: string;
  /** Regular price, struck through, when on sale. */
  a: string | null;
  /** On sale («¡Oferta!» flag). */
  o: boolean;
  /** Purchasable with a price: the official «Añadir al carrito» becomes «Pedir por WhatsApp». */
  w: boolean;
  /** Lowest and highest price in dollars (null = no price: left out by the price filter). */
  mn: number | null;
  mx: number | null;
  /** Search text: name, short description and description, lower case, no accents, no HTML. */
  t: string;
};

/** Card data of the shared category card. The permalink is only the WhatsApp text until the browser knows the mirror URL. */
export function aTarjeta(p: ProductoIndice): TarjetaDatos {
  return {
    id: p.id,
    nombre: p.n,
    ruta: p.h,
    imagen: p.i ? { src: p.i[0], w: p.i[1], h: p.i[2] } : null,
    precio: p.p,
    anterior: p.a,
    oferta: p.o,
    valor: p.mn,
    whatsapp: p.w,
    permalink: `https://www.tonysportselsalvador.com${p.h}`,
  };
}

/** Lower case without accents, like the database collation the official search runs on. */
export function normalizar(texto: string): string {
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Search form of a text: normalized, letters, digits and price signs only (emoji and decoration dropped). */
export function compactar(texto: string): string {
  return normalizar(texto).replace(/[^a-z0-9$%.,\- ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export type PaginaLista<T> = { items: T[]; pagina: number; totalPaginas: number; total: number; desde: number; hasta: number };

/** Same paging as lib/oficial/catalogo paginar(): 12 per page, page clamped. */
export function paginarLista<T>(lista: readonly T[], pagina = 1): PaginaLista<T> {
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA_TIENDA));
  const actual = Math.min(Math.max(1, Math.floor(Number(pagina) || 1)), totalPaginas);
  const inicio = (actual - 1) * POR_PAGINA_TIENDA;
  const items = lista.slice(inicio, inicio + POR_PAGINA_TIENDA);
  return { items, pagina: actual, totalPaginas, total, desde: items.length ? inicio + 1 : 0, hasta: inicio + items.length };
}

/** Result count exactly as the official prints it ('Mostrando todos los resultados 7', 'Mostrando 13–24 de 242 resultados'…). */
export function textoConteo({ total, pagina }: Pick<PaginaLista<unknown>, 'total' | 'pagina'>): string {
  return textoConteoCatalogo(total, pagina, POR_PAGINA_TIENDA);
}

// ---------------------------------------------------------------------------
// URL state (the official query vars: s, orderby, min_price, max_price, paged)
// ---------------------------------------------------------------------------
export type ParametrosTienda = { s: string; orderby: string; min: number | null; max: number | null; paged: number; listo: boolean };

export const PARAMETROS_VACIOS: ParametrosTienda = { s: '', orderby: '', min: null, max: null, paged: 1, listo: false };

function numero(valor: string | null): number | null {
  if (valor === null || valor.trim() === '') return null;
  const n = Number(valor.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function leerParametros(sp: URLSearchParams): ParametrosTienda {
  return {
    s: (sp.get('s') ?? '').trim(),
    orderby: (sp.get('orderby') ?? '').trim(),
    min: numero(sp.get('min_price')),
    max: numero(sp.get('max_price')),
    paged: Math.max(1, Math.floor(Number(sp.get('paged')) || 1)),
    listo: true,
  };
}

/** True when the URL asks for something the static page does not show (search, filter, order, page). */
export function pideResultados(p: ParametrosTienda): boolean {
  return p.listo && (p.s !== '' || p.min !== null || p.max !== null || p.paged > 1 || (p.orderby !== '' && p.orderby !== ordenPorDefecto(p)));
}

/** Shop URL with the given state (paths without the site prefix: next/link and the router add it). */
export function urlTienda(p: Pick<ParametrosTienda, 's' | 'orderby' | 'min' | 'max' | 'paged'>): string {
  const sp = new URLSearchParams();
  if (p.s) sp.set('s', p.s);
  if (p.orderby) sp.set('orderby', p.orderby);
  if (p.min !== null) sp.set('min_price', String(p.min));
  if (p.max !== null) sp.set('max_price', String(p.max));
  if (p.paged > 1) sp.set('paged', String(p.paged));
  const query = sp.toString();
  return query ? `/productos/?${query}` : '/productos/';
}

// ---------------------------------------------------------------------------
// Ordering (official «Pedido de la tienda» select)
// ---------------------------------------------------------------------------
export const ORDENES: { valor: string; texto: string }[] = [
  { valor: 'popularity', texto: 'Ordenar por popularidad' },
  { valor: 'date', texto: 'Ordenar por las últimas' },
  { valor: 'price', texto: 'Ordenar por precio: bajo a alto' },
  { valor: 'price-desc', texto: 'Ordenar por precio: alto a bajo' },
  { valor: 'oldest_to_recent', texto: 'Ordenar por antiguedad' },
];
/** WooCommerce adds «Relevancia» (and selects it) on search results. */
export const ORDEN_RELEVANCIA = { valor: 'relevance', texto: 'Relevancia' };

export function ordenPorDefecto(p: Pick<ParametrosTienda, 's'>): string {
  return p.s ? 'relevance' : 'date';
}

function relevancia(p: ProductoIndice, frase: string, terminos: string[]): number {
  const nombre = compactar(p.n);
  if (frase && nombre.includes(frase)) return 0;
  if (terminos.every((t) => nombre.includes(t))) return 1;
  if (terminos.some((t) => nombre.includes(t))) return 2;
  return 3;
}

/** Search, price filter and order over the index (kept in the official date order). */
export function filtrarYOrdenar(lista: readonly ProductoIndice[], p: ParametrosTienda): ProductoIndice[] {
  const posicion = new Map(lista.map((x, i) => [x.id, i]));
  let salida = lista.slice();
  const frase = compactar(p.s);
  const terminos = frase.split(' ').filter(Boolean);
  if (terminos.length) salida = salida.filter((x) => terminos.every((t) => x.t.includes(t)));
  if (p.min !== null || p.max !== null) {
    const desde = p.min ?? 0;
    const hasta = p.max ?? Number.POSITIVE_INFINITY;
    salida = salida.filter((x) => x.mn !== null && x.mx !== null && x.mx >= desde && x.mn <= hasta);
  }
  const orden = p.orderby || ordenPorDefecto(p);
  const fecha = (a: ProductoIndice, b: ProductoIndice) => (posicion.get(a.id) ?? 0) - (posicion.get(b.id) ?? 0);
  switch (orden) {
    case 'relevance':
      if (terminos.length) salida.sort((a, b) => relevancia(a, frase, terminos) - relevancia(b, frase, terminos) || fecha(a, b));
      break;
    case 'popularity':
      // Sales counts are not in the snapshot: WooCommerce's tiebreaker (newest id first) is all that is left.
      salida.sort((a, b) => b.id - a.id);
      break;
    case 'price':
      salida.sort((a, b) => (a.mn ?? Number.NEGATIVE_INFINITY) - (b.mn ?? Number.NEGATIVE_INFINITY) || a.id - b.id);
      break;
    case 'price-desc':
      salida.sort((a, b) => (b.mx ?? Number.NEGATIVE_INFINITY) - (a.mx ?? Number.NEGATIVE_INFINITY) || b.id - a.id);
      break;
    case 'oldest_to_recent':
      salida.sort((a, b) => fecha(b, a));
      break;
    default:
      break;
  }
  return salida;
}
