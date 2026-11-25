/*
 * UltimosProductos: the sidebar «Últimos productos añadidos» list (WooCommerce product_list_widget):
 * small framed thumbnail, name in capitals and price.
 * Props: productos (UltimoProducto[] from datos-tienda, newest first).
 */
import Link from 'next/link';
import type { UltimoProducto } from './datos-tienda';

export default function UltimosProductos({ productos }: { productos: UltimoProducto[] }) {
  return <ul className="wb-tienda-ultimos">
    {productos.map((p, i) => <li key={`${p.href}-${i}`} className="wb-tienda-ultimo">
      <Link href={p.href} prefetch={false} className="wb-tienda-ultimo-enlace">
        {p.imagen
          ? <img src={p.imagen.src} width={p.imagen.w} height={p.imagen.h} alt="" loading="lazy" decoding="async" className="wb-tienda-ultimo-img"/>
          : <span className="wb-img-falta wb-tienda-ultimo-img" aria-hidden="true"/>}
        <span className="wb-tienda-ultimo-nombre">{p.nombre}</span>
      </Link>
      {p.precio && <span className="wb-tienda-ultimo-precio">
        {p.precioAnterior && <del><span className="tc-sr">Precio anterior: </span>{p.precioAnterior}</del>}
        <ins><span className="tc-sr">{p.precioAnterior ? 'Precio actual: ' : 'Precio: '}</span>{p.precio}</ins>
      </span>}
    </li>)}
  </ul>;
}
