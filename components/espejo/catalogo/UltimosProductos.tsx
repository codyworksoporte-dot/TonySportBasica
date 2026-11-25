/*
 * UltimosProductos: the sidebar "Últimos productos añadidos" widget (WooCommerce product_list_widget): thumbnail
 * floated left, name as link, price under it (it slips under the thumbnail when the name takes three lines,
 * like the official float).
 * Props: items (UltimoProducto[], newest first); id?.
 */
import Link from 'next/link';
import type { UltimoProducto } from './tipos';
import { SinFoto } from './TarjetaCatalogo';

export default function UltimosProductos({ items, id = 'wb-catalogo-ultimos' }: { items: UltimoProducto[]; id?: string }) {
  if (!items.length) return null;
  return <section className="wb-catalogo-widget" aria-labelledby={`${id}-t`}>
    <h2 className="wb-catalogo-widget-titulo" id={`${id}-t`}><span>Últimos productos añadidos</span></h2>
    <ul className="wb-catalogo-ultimos">
      {items.map((p) => <li key={p.ruta}>
        <Link href={p.ruta} prefetch={false}>
          {p.imagen
            ? <img src={p.imagen.src} width={p.imagen.w} height={p.imagen.h} alt="" loading="lazy" decoding="async"/>
            : <SinFoto className="wb-catalogo-ultimos-sin-foto"/>}
          <span className="wb-catalogo-ultimos-nombre">{p.nombre}</span>
        </Link>
        {p.precio && <span className="wb-catalogo-ultimos-precio">
          {p.anterior && <del><span className="tc-sr">Precio anterior: </span>{p.anterior}</del>}
          <ins><span className="tc-sr">{p.anterior ? 'Precio actual: ' : 'Precio: '}</span>{p.precio}</ins>
        </span>}
      </li>)}
    </ul>
  </section>;
}
