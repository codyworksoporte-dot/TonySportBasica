'use client';
/*
 * OrdenTienda: the official «Pedido de la tienda» select (Ordenar por las últimas…). Like WooCommerce it
 * reloads the shop with ?orderby= (keeping search and price filter, back to page 1). A mouse choice
 * applies at once; with the keyboard the arrows only move and Enter applies.
 */
import { useRouter } from 'next/navigation';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useParametrosTienda } from './ProveedorTienda';
import { ORDEN_RELEVANCIA, ORDENES, ordenPorDefecto, urlTienda } from './tienda-comun';

const TECLAS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

export default function OrdenTienda() {
  const router = useRouter();
  const p = useParametrosTienda();
  const actual = p.orderby || ordenPorDefecto(p);
  const conTeclado = useRef(false);
  const opciones = p.s ? [ORDEN_RELEVANCIA, ...ORDENES] : ORDENES;

  const aplicar = (orden: string) => {
    if (orden === actual) return;
    router.push(urlTienda({ ...p, orderby: orden === ordenPorDefecto(p) ? '' : orden, paged: 1 }));
  };
  const alCambiar = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!conTeclado.current) aplicar(event.target.value);
  };
  const alPulsar = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicar(event.currentTarget.value); return; }
    if (TECLAS.has(event.key) || event.key.length === 1) conTeclado.current = true;
  };

  return <form className="wb-form wb-tienda-orden" onSubmit={(event) => event.preventDefault()}>
    {/* key: the select resets to the URL's order after every navigation. */}
    <select key={actual} name="orderby" aria-label="Pedido de la tienda" defaultValue={actual} onChange={alCambiar} onKeyDown={alPulsar}
      onPointerDown={() => { conTeclado.current = false; }} onBlur={() => { conTeclado.current = false; }}>
      {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
    </select>
  </form>;
}
