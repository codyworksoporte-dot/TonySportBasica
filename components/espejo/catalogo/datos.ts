/*
 * Server-side helpers of the WooCommerce templates: turn official catalogue records into plain values for
 * the client components. Imports lib/oficial/catalogo (multi-MB JSON): never import this from 'use client'.
 */
import {
  categorias,
  miniaturaProducto,
  precioPartes,
  rutaProducto,
  type CategoriaOficial,
  type ProductoOficial,
} from '@/lib/oficial/catalogo';
import productosJson from '@/data/oficial/productos.json';
import type { ImagenResuelta, OpcionCategoriaLateral, TarjetaDatos, UltimoProducto } from './tipos';

// Store API field that lib/oficial/catalogo does not map (same JSON module, no extra copy in memory).
const EN_RESERVA = new Set(
  ((productosJson as unknown as { products?: { id: number; is_on_backorder?: boolean }[] }).products ?? [])
    .filter((p) => p.is_on_backorder)
    .map((p) => p.id),
);

/** WooCommerce stock text "Disponible para reserva" (product on backorder). */
export function disponibleParaReserva(p: ProductoOficial): boolean {
  return EN_RESERVA.has(p.id);
}

function resolver(imagen: { src: string; w: number; h: number } | null): ImagenResuelta | null {
  return imagen ? { src: imagen.src, w: imagen.w, h: imagen.h } : null;
}

/** Numeric price (major units) as WooCommerce's lookup table holds it; null when the product has none. */
export function valorPrecio(p: ProductoOficial): number | null {
  const { price, currency_minor_unit: unidad } = p.precios;
  if (price === '' || price === null || price === undefined) return null;
  const valor = Number(price) / 10 ** (Number.isFinite(unidad) ? unidad : 2);
  return Number.isFinite(valor) ? valor : null;
}

/** True when the official shows "Añadir al carrito" (purchasable product with a price). */
export function pidePorWhatsApp(p: ProductoOficial): boolean {
  return p.comprable && precioPartes(p).actual !== '';
}

export function tarjetaDeProducto(p: ProductoOficial): TarjetaDatos {
  const partes = precioPartes(p);
  return {
    id: p.id,
    nombre: p.nombre,
    ruta: rutaProducto(p),
    imagen: resolver(miniaturaProducto(p, 0)),
    precio: partes.actual,
    anterior: partes.anterior,
    oferta: p.enOferta,
    valor: valorPrecio(p),
    whatsapp: pidePorWhatsApp(p),
    permalink: p.permalink,
  };
}

export function ultimoProducto(p: ProductoOficial): UltimoProducto {
  const partes = precioPartes(p);
  return { nombre: p.nombre, ruta: rutaProducto(p), imagen: resolver(miniaturaProducto(p, 0)), precio: partes.actual, anterior: partes.anterior };
}

/** Ancestor ids of a category, nearest first. */
function ancestros(c: CategoriaOficial, todas: CategoriaOficial[]): number[] {
  const salida: number[] = [];
  let padre = c.padre;
  while (padre && !salida.includes(padre)) {
    salida.push(padre);
    padre = todas.find((x) => x.id === padre)?.padre ?? 0;
  }
  return salida;
}

/**
 * Options of the sidebar "Categorías" dropdown as the official widget prints them ("Only show children of the
 * current category", hierarchical): every top-level category plus, on a category page, its ancestors, its
 * children and the children of its ancestors, each child indented under its parent, alphabetical.
 */
export function opcionesCategoriaLateral(actual: CategoriaOficial | null): OpcionCategoriaLateral[] {
  const todas = categorias();
  const incluir = new Set(todas.filter((c) => c.padre === 0).map((c) => c.id));
  if (actual) {
    const cadena = ancestros(actual, todas);
    incluir.add(actual.id);
    for (const id of cadena) incluir.add(id);
    for (const c of todas) if (c.padre === actual.id || cadena.includes(c.padre)) incluir.add(c.id);
  }
  const salida: OpcionCategoriaLateral[] = [];
  const visitar = (padre: number, nivel: number) => {
    for (const c of todas) {
      if (c.padre !== padre || !incluir.has(c.id)) continue;
      salida.push({ slug: c.slug, nombre: c.nombre, nivel });
      visitar(c.id, nivel + 1);
    }
  };
  visitar(0, 0);
  return salida;
}

/** Path segments after /categoria/ of the official permalink ('padre/hija' for subcategories). */
export function segmentosDeCategoria(c: CategoriaOficial): string[] {
  const m = /\/categoria\/(.+?)\/?$/.exec(c.permalink.replace(/[?#].*$/, ''));
  return m ? m[1].split('/').filter(Boolean) : [c.slug];
}

/**
 * Title of the theme's previous/next product tabs: the official cuts the name to its first 30 bytes, drops the
 * last (possibly partial) word and adds "..." ("PROMO IMPLEMENTOS...", "CAMISAS...").
 */
export function tituloDeNavegacion(nombre: string): string {
  const limpio = nombre.replace(/\s+/g, ' ').trim();
  const bytes = new TextEncoder().encode(limpio);
  const corte = bytes.length > 30 ? new TextDecoder().decode(bytes.slice(0, 30)).replace(/�+$/, '') : limpio;
  const espacio = corte.lastIndexOf(' ');
  return `${espacio > 0 ? corte.slice(0, espacio) : corte}...`;
}
