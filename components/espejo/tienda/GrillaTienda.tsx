/*
 * GrillaTienda: the WooCommerce loop (ul.products) of the shop with already resolved images, so the same
 * markup renders on the server (static pages) and in the client results (search, filter, order).
 * Same classes as the base GrillaProductos / TarjetaProducto; each card keeps its official button label
 * («Añadir al carrito» or «Más información»).
 * Props: productos (TarjetaTiendaDatos[]); prioridad? (first N images eager, default 0); etiqueta?.
 */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Boton from '@/components/espejo/Boton';
import type { TarjetaTiendaDatos } from './tienda-comun';
import '@/components/espejo/espejo-componentes.css';

const COLUMNAS = { '--wb-g-xs': 1, '--wb-g-sm': 2, '--wb-g-md': 3, '--wb-g-lg': 3 } as CSSProperties;

function TarjetaTienda({ producto, prioridad }: { producto: TarjetaTiendaDatos; prioridad: boolean }) {
  const { nombre, href, imagen, precio, precioAnterior, etiqueta, boton } = producto;
  return <div className="wb-producto">
    <Link className="wb-producto-enlace" href={href} prefetch={false}>
      <span className="wb-producto-media">
        {etiqueta && <span className="wb-producto-etiqueta">{etiqueta}</span>}
        {imagen
          ? <img src={imagen.src} width={imagen.w} height={imagen.h} alt="" className="wb-producto-img"
            loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>
          : <span className="wb-img-falta wb-producto-img" aria-hidden="true" style={{ aspectRatio: '1 / 1' }}/>}
      </span>
      <h2 className="wb-producto-nombre">{nombre}</h2>
    </Link>
    {precio && <p className="wb-producto-precio">
      {precioAnterior && <del><span className="tc-sr">Precio anterior: </span>{precioAnterior}</del>}
      <ins><span className="tc-sr">{precioAnterior ? 'Precio actual: ' : 'Precio: '}</span>{precio}</ins>
    </p>}
    <Boton href={href} tamano="sm" flecha={false} className="wb-producto-boton" ariaLabel={`${boton}: ${nombre}`}>{boton}</Boton>
  </div>;
}

export default function GrillaTienda({ productos, prioridad = 0, etiqueta = 'Productos' }: { productos: TarjetaTiendaDatos[]; prioridad?: number; etiqueta?: string }) {
  return <ul className="wb-productos wb-tienda-grilla" style={COLUMNAS} aria-label={etiqueta}>
    {productos.map((producto, i) => <li key={`${producto.href}-${i}`} className="wb-productos-item">
      <TarjetaTienda producto={producto} prioridad={i < prioridad}/>
    </li>)}
  </ul>;
}
