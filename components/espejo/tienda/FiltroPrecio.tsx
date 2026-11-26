'use client';
/*
 * FiltroPrecio: the shop's «Filtrar por precio» widget (WooCommerce price slider, step 10): two handles,
 * the «Precio: $0 — $110» label and FILTRAR, with the same look as the category archives' slider.
 * Like the official form it opens the shop with ?min_price=&max_price= (keeping the search and the order),
 * where ResultadosTienda lists the products in that range.
 * Props: min, max (slider limits); paso? (default 10); id? (heading id prefix).
 */
import Form from 'next/form';
import { useState, type CSSProperties } from 'react';
import Boton from '@/components/espejo/Boton';
import { useParametrosTienda } from './ProveedorTienda';

function Controles({ min, max, paso, desdeInicial, hastaInicial }: { min: number; max: number; paso: number; desdeInicial: number; hastaInicial: number }) {
  const [desde, setDesde] = useState(desdeInicial);
  const [hasta, setHasta] = useState(hastaInicial);
  const amplitud = Math.max(1, max - min);
  // Percentages: the CSS places the lime fill between the two handles.
  const pos = (v: number) => `${((v - min) / amplitud) * 100}%`;
  const estilo = { '--desde': pos(desde), '--hasta': pos(hasta) } as CSSProperties;
  return <>
    <div className="wb-catalogo-deslizador" style={estilo}>
      {/* Past the middle the minimum handle goes on top, so it can still move when both meet. */}
      <input type="range" name="min_price" min={min} max={max} step={paso} value={desde} aria-label="Precio mínimo"
        aria-valuetext={`$${desde}`} className={desde > min + amplitud / 2 ? 'wb-catalogo-deslizador-arriba' : undefined}
        onChange={(e) => setDesde(Math.min(Number(e.target.value), hasta))}/>
      <input type="range" name="max_price" min={min} max={max} step={paso} value={hasta} aria-label="Precio máximo"
        aria-valuetext={`$${hasta}`} onChange={(e) => setHasta(Math.max(Number(e.target.value), desde))}/>
    </div>
    <div className="wb-catalogo-precio-fila">
      <p className="wb-catalogo-precio-etiqueta">Precio: <span>${desde}</span> — <span>${hasta}</span></p>
      <Boton type="submit" tamano="sm" flecha={false} className="wb-catalogo-precio-boton">Filtrar</Boton>
    </div>
  </>;
}

export default function FiltroPrecio({ min, max, paso = 10, id = 'wb-tienda-precio' }: { min: number; max: number; paso?: number; id?: string }) {
  const p = useParametrosTienda();
  const ajustar = (v: number | null, defecto: number) => Math.min(max, Math.max(min, v ?? defecto));
  const desde = ajustar(p.min, min);
  const hasta = Math.max(desde, ajustar(p.max, max));
  return <section className="wb-catalogo-widget" aria-labelledby={`${id}-t`}>
    <h2 className="wb-catalogo-widget-titulo" id={`${id}-t`}><span>Filtrar por precio</span></h2>
    <Form action="/productos/" className="wb-catalogo-precio">
      {/* key: the handles return to the URL's range after each navigation. */}
      <Controles key={`${desde}-${hasta}`} min={min} max={max} paso={paso} desdeInicial={desde} hastaInicial={hasta}/>
      {p.s && <input type="hidden" name="s" value={p.s}/>}
      {p.orderby && <input type="hidden" name="orderby" value={p.orderby}/>}
    </Form>
  </section>;
}
