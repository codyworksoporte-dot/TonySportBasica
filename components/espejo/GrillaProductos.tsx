/*
 * GrillaProductos: the WooCommerce product loop (ul.products) of the theme. Columns per breakpoint like the
 * official: 3 from 992 px (285 px cards, 18 px gaps in the 891 px shop column), 2 on tablets, 1 on phones.
 * Props: productos (ProductoTarjeta[]); columnas? ({ xs?, sm?, md?, lg? } 1–6, default { xs: 1, sm: 2, md: 3, lg: 3 });
 * boton? (button label for every card); nivel? (heading level of names, default 2); prioridad? (number of
 * first images loaded eagerly, default 0); etiqueta? (accessible name of the list); className?.
 */
import type { CSSProperties } from 'react';
import TarjetaProducto, { type ProductoTarjeta } from './TarjetaProducto';
import './espejo-componentes.css';

type Columnas = { xs?: number; sm?: number; md?: number; lg?: number };
type Props = { productos: ProductoTarjeta[]; columnas?: Columnas; boton?: string; nivel?: 2 | 3 | 4; prioridad?: number; etiqueta?: string; className?: string };

export default function GrillaProductos({ productos, columnas = {}, boton, nivel = 2, prioridad = 0, etiqueta, className = '' }: Props) {
  const xs = columnas.xs ?? 1, sm = columnas.sm ?? 2, md = columnas.md ?? 3, lg = columnas.lg ?? md;
  const estilo = { '--wb-g-xs': xs, '--wb-g-sm': sm, '--wb-g-md': md, '--wb-g-lg': lg } as CSSProperties;
  return <ul className={`wb-productos ${className}`.trim()} style={estilo} aria-label={etiqueta}>
    {productos.map((producto, i) => <li key={`${producto.href}-${i}`} className="wb-productos-item">
      <TarjetaProducto producto={producto} boton={boton} nivel={nivel} prioridad={i < prioridad}/>
    </li>)}
  </ul>;
}
