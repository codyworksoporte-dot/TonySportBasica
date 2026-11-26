/*
 * GrillaTienda: the WooCommerce loop (ul.products) of the shop with already resolved values, so the same
 * markup renders on the server (static pages) and in the client results (search, filter, order).
 * The shop is the category template on the official site, so it uses the category card (TarjetaCatalogo):
 * «¡Oferta!» flash, price inside the product link and «Pedir por WhatsApp» / «Más información».
 * Props: productos (TarjetaDatos[]); prioridad? (first N images eager, default 0); etiqueta?.
 */
import type { CSSProperties } from 'react';
import TarjetaCatalogo from '@/components/espejo/catalogo/TarjetaCatalogo';
import type { TarjetaDatos } from '@/components/espejo/catalogo/tipos';

const COLUMNAS = { '--wb-g-xs': 1, '--wb-g-sm': 2, '--wb-g-md': 3, '--wb-g-lg': 3 } as CSSProperties;

export default function GrillaTienda({ productos, prioridad = 0, etiqueta = 'Productos' }: { productos: TarjetaDatos[]; prioridad?: number; etiqueta?: string }) {
  return <ul className="wb-productos wb-catalogo-grilla" style={COLUMNAS} aria-label={etiqueta}>
    {productos.map((item, i) => <li key={item.id} className="wb-productos-item">
      <TarjetaCatalogo item={item} prioridad={i < prioridad}/>
    </li>)}
  </ul>;
}
