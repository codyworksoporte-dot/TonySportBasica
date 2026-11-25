/*
 * Server-only data of the shop archive: imports lib/oficial/catalogo (multi-MB JSON). Pages and the
 * /productos/indice.json route call it at build time; client components receive plain values.
 */
import {
  miniaturaProducto,
  precioPartes,
  productos,
  rangoDePrecios,
  rutaProducto,
  subcategorias,
  ultimosProductos,
  type ProductoOficial,
} from '@/lib/oficial/catalogo';
import { aTarjeta, compactar, type ProductoIndice, type TarjetaTiendaDatos } from './tienda-comun';

function textoPlano(html: string): string {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function montos(p: ProductoOficial): { mn: number | null; mx: number | null } {
  const precios = p.precios;
  if (!precios) return { mn: null, mx: null };
  const divisor = 10 ** (Number.isFinite(precios.currency_minor_unit) ? precios.currency_minor_unit : 2);
  const valor = (monto: string | undefined) => (monto === undefined || monto === '' ? null : Number(monto) / divisor);
  if (precios.price_range) return { mn: valor(precios.price_range.min_amount), mx: valor(precios.price_range.max_amount) };
  const v = valor(precios.price);
  return { mn: v, mx: v };
}

export function aIndice(p: ProductoOficial): ProductoIndice {
  const precio = precioPartes(p);
  const mini = miniaturaProducto(p);
  const { mn, mx } = montos(p);
  return {
    id: p.id,
    n: p.nombre,
    h: rutaProducto(p),
    i: mini ? [mini.src, mini.w, mini.h] : null,
    p: precio.actual,
    a: precio.anterior,
    o: precio.enOferta,
    b: p.boton.texto,
    mn,
    mx,
    t: compactar([p.nombre, textoPlano(p.descripcionCorta), textoPlano(p.descripcion)].filter(Boolean).join(' ')),
  };
}

let cache: ProductoIndice[] | null = null;

/** The 242 products in the official order (newest first). */
export function indiceTienda(): ProductoIndice[] {
  if (!cache) cache = productos().map(aIndice);
  return cache;
}

/** Cards of one shop page, same data the client results use. */
export function tarjetasDe(lista: readonly ProductoIndice[]): TarjetaTiendaDatos[] {
  return lista.map(aTarjeta);
}

export type OpcionCategoriaTienda = { slug: string; nombre: string };

/** Sidebar «Categorías» on the shop root: top-level categories only, official (API) order. */
export function categoriasDelLateral(): OpcionCategoriaTienda[] {
  return subcategorias(0).map((c) => ({ slug: c.slug, nombre: c.nombre }));
}

/** Price filter limits: «Precio: $0 — $110» (step 10, like WooCommerce). */
export function limitesDePrecio(): { min: number; max: number } {
  const { min, max } = rangoDePrecios(productos());
  return { min, max };
}

export type UltimoProducto = { nombre: string; href: string; imagen: { src: string; w: number; h: number } | null; precio: string; precioAnterior: string | null };

/** «Últimos productos añadidos» widget (5 newest). */
export function ultimosDelLateral(cantidad = 5): UltimoProducto[] {
  return ultimosProductos(cantidad).map((p) => {
    const precio = precioPartes(p);
    const mini = miniaturaProducto(p);
    return { nombre: p.nombre, href: rutaProducto(p), imagen: mini, precio: precio.actual, precioAnterior: precio.anterior };
  });
}
