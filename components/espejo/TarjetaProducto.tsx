/*
 * TarjetaProducto: one product of the WooCommerce loop as the theme shows it: square image, name (official
 * green -> lime, uppercase), price and a small button. The image and name share one link; the button is
 * our .tc-btn. Official labels: "Más información" (default) or "Añadir al carrito" (pass `boton`).
 * Props: producto ({ nombre, href, imagen?, precio?, precioAnterior?, etiqueta? }); boton? (label);
 * nivel? (heading of the name, default 2); prioridad? (eager image); className?.
 * formatearPrecio(menor, decimales = 2, simbolo = '$', mostrarCero = false) turns Store API minor units
 * ("1099") into "$10.99"; empty or 0 prices give undefined (the official shows no price for them).
 */
import Link from 'next/link';
import Boton, { esExterno } from './Boton';
import ImagenOficial from './ImagenOficial';
import './espejo-componentes.css';

export type ProductoTarjeta = {
  nombre: string;
  href: string;
  imagen?: string | null;
  /** Formatted price as the official shows it, e.g. "$24.99". */
  precio?: string;
  /** Regular price when the product is on sale (shown struck through). */
  precioAnterior?: string;
  /** Small flag over the image, e.g. "¡Oferta!". */
  etiqueta?: string;
};

type Props = { producto: ProductoTarjeta; boton?: string; nivel?: 2 | 3 | 4; prioridad?: boolean; className?: string };

export function formatearPrecio(menor: string | number | null | undefined, decimales = 2, simbolo = '$', mostrarCero = false): string | undefined {
  const valor = typeof menor === 'number' ? menor : Number(menor);
  if (menor === null || menor === undefined || menor === '' || !Number.isFinite(valor)) return undefined;
  // Official products priced 0 (e.g. "PROMO IMPLEMENTOS DEPORTIVOS") show no price, only "Más información".
  if (valor === 0 && !mostrarCero) return undefined;
  return `${simbolo}${(valor / 10 ** decimales).toFixed(decimales)}`;
}

export default function TarjetaProducto({ producto, boton = 'Más información', nivel = 2, prioridad = false, className = '' }: Props) {
  const { nombre, href, imagen, precio, precioAnterior, etiqueta } = producto;
  const Encabezado = `h${nivel}` as 'h2';
  const externo = esExterno(href);
  const contenido = <>
    <span className="wb-producto-media">
      {etiqueta && <span className="wb-producto-etiqueta">{etiqueta}</span>}
      <ImagenOficial url={imagen} alt="" prioridad={prioridad} sizes="(max-width: 767px) 300px, 285px" className="wb-producto-img" ancho={1} alto={1}/>
    </span>
    <Encabezado className="wb-producto-nombre">{nombre}</Encabezado>
  </>;
  return <div className={`wb-producto ${className}`.trim()}>
    {externo
      ? <a className="wb-producto-enlace" href={href} target="_blank" rel="noopener noreferrer">{contenido}</a>
      : <Link className="wb-producto-enlace" href={href} prefetch={false}>{contenido}</Link>}
    {precio && <p className="wb-producto-precio">
      {precioAnterior && <del><span className="tc-sr">Precio anterior: </span>{precioAnterior}</del>}
      <ins><span className="tc-sr">{precioAnterior ? 'Precio actual: ' : 'Precio: '}</span>{precio}</ins>
    </p>}
    <Boton href={href} tamano="sm" flecha={false} className="wb-producto-boton" ariaLabel={`${boton}: ${nombre}`}>{boton}</Boton>
  </div>;
}
