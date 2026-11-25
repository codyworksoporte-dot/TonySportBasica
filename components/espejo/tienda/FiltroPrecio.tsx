'use client';
/*
 * FiltroPrecio: the sidebar «Filtrar por precio» widget (WooCommerce price slider, step 10): two handles,
 * the «Precio: $0 — $110» label and FILTRAR. It opens the shop with ?min_price=&max_price= (keeping the
 * search and the order), where ResultadosTienda lists the products in that range.
 * Props: min, max (slider limits); paso? (default 10).
 */
import Form from 'next/form';
import { useState, type CSSProperties } from 'react';
import Boton from '@/components/espejo/Boton';
import { useParametrosTienda } from './ProveedorTienda';

function Controles({ min, max, paso, desdeInicial, hastaInicial }: { min: number; max: number; paso: number; desdeInicial: number; hastaInicial: number }) {
  const [desde, setDesde] = useState(desdeInicial);
  const [hasta, setHasta] = useState(hastaInicial);
  const rango = Math.max(1, max - min);
  // Unitless fractions: the CSS places the lime fill between the two handles.
  const estilo = { '--desde': String((desde - min) / rango), '--hasta': String((hasta - min) / rango) } as CSSProperties;
  // When both handles meet at the top, the minimum one goes on top so it can still move.
  const minimoEncima = desde === hasta && desde > (min + max) / 2;
  return <>
    <div className="wb-tienda-deslizador" style={estilo}>
      <input type="range" name="min_price" min={min} max={max} step={paso} value={desde} aria-label="Precio mínimo"
        className={minimoEncima ? 'wb-tienda-encima' : undefined}
        aria-valuetext={`$${desde}`} onChange={(e) => setDesde(Math.min(Number(e.target.value), hasta))}/>
      <input type="range" name="max_price" min={min} max={max} step={paso} value={hasta} aria-label="Precio máximo"
        aria-valuetext={`$${hasta}`} onChange={(e) => setHasta(Math.max(Number(e.target.value), desde))}/>
    </div>
    <div className="wb-tienda-precio-pie">
      <p className="wb-tienda-precio-etiqueta">Precio: <span>${desde}</span> — <span>${hasta}</span></p>
      <Boton type="submit" tamano="sm" flecha={false} className="wb-tienda-filtrar">Filtrar</Boton>
    </div>
  </>;
}

export default function FiltroPrecio({ min, max, paso = 10 }: { min: number; max: number; paso?: number }) {
  const p = useParametrosTienda();
  const ajustar = (v: number | null, defecto: number) => Math.min(max, Math.max(min, v ?? defecto));
  const desde = ajustar(p.min, min);
  const hasta = Math.max(desde, ajustar(p.max, max));
  return <Form action="/productos/" className="wb-tienda-filtro">
    {/* key: the handles return to the URL's range after each navigation. */}
    <Controles key={`${desde}-${hasta}`} min={min} max={max} paso={paso} desdeInicial={desde} hastaInicial={hasta}/>
    {p.s && <input type="hidden" name="s" value={p.s}/>}
    {p.orderby && <input type="hidden" name="orderby" value={p.orderby}/>}
  </Form>;
}
