/*
 * Client-safe types and helpers of the WooCommerce templates (category archive, product page).
 * Values arrive already resolved from the server (components/espejo/catalogo/datos.ts): no JSON imports here.
 */

/** Local WebP already prefixed with the site base. */
export type ImagenResuelta = { src: string; w: number; h: number };

/** One product of the loop (archive grid, related products). */
export type TarjetaDatos = {
  id: number;
  nombre: string;
  /** Local route, '/producto/<slug>/'. */
  ruta: string;
  imagen: ImagenResuelta | null;
  /** Current price as the official prints it ('$24.99'), '' when the product shows no price. */
  precio: string;
  /** Regular price struck through when on sale. */
  anterior: string | null;
  /** "¡Oferta!" flash (WooCommerce is_on_sale). */
  oferta: boolean;
  /** Numeric price for sorting and the price filter (null = no price at all). */
  valor: number | null;
  /** Purchasable with price: the official "Añadir al carrito" becomes "Pedir por WhatsApp". */
  whatsapp: boolean;
  /** Official permalink, used in the WhatsApp text until the browser knows the mirror URL. */
  permalink: string;
};

/** Option of the sidebar "Categorías" dropdown (WooCommerce product_cat widget, hierarchical). */
export type OpcionCategoriaLateral = { slug: string; nombre: string; nivel: number };

/** Search index entry: name and slug. */
export type ProductoBusqueda = { n: string; s: string };

/** "Últimos productos añadidos" widget entry. */
export type UltimoProducto = { nombre: string; ruta: string; imagen: ImagenResuelta | null; precio: string; anterior: string | null };

/** Products per archive page on the official site (3 columns x 4 rows). */
export const POR_PAGINA_CATALOGO = 12;

/** Official WooCommerce archive orderings (select name="orderby"). */
export const ORDENES = [
  { valor: 'popularity', texto: 'Ordenar por popularidad' },
  { valor: 'date', texto: 'Ordenar por las últimas' },
  { valor: 'price', texto: 'Ordenar por precio: bajo a alto' },
  { valor: 'price-desc', texto: 'Ordenar por precio: alto a bajo' },
  { valor: 'oldest_to_recent', texto: 'Ordenar por antiguedad' },
] as const;
export type Orden = (typeof ORDENES)[number]['valor'];

export const SIN_RESULTADOS = 'No se encontraron productos que concuerden con la selección.';

/**
 * Result count exactly as the official site prints it (its own translation differs from WooCommerce's):
 * 'Mostrando el único resultado', 'Mostrando todos los resultados 7', 'Mostrando 13–24 de 35 resultados'.
 */
export function textoConteo(total: number, pagina: number, porPagina = POR_PAGINA_CATALOGO): string {
  if (total <= 0) return SIN_RESULTADOS;
  if (total === 1) return 'Mostrando el único resultado';
  const totalPaginas = Math.ceil(total / porPagina);
  if (totalPaginas <= 1) return `Mostrando todos los resultados ${total}`;
  const desde = (pagina - 1) * porPagina + 1;
  const hasta = Math.min(total, pagina * porPagina);
  return `Mostrando ${desde}–${hasta} de ${total} resultados`;
}

const MARCAS = /[̀-ͯ]/g;
/** Lowercase without accents, for accent-insensitive search. */
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(MARCAS, '').toLowerCase();
}
