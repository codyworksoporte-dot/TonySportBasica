'use client';
/*
 * CarritoFlotante: the official floating cart (WPC Fly Cart), bottom right. The button shows the real count;
 * it opens the "MI CARRITO" panel with our saved designs (configurator drafts and studio designs) or the
 * official empty message, and a link to /carrito/. Saved artwork is read only while the panel is open.
 * No props (needs ProveedorCarritoEspejo above it).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { siteAsset } from '@/lib/asset-path';
import { useCart } from '@/lib/cart';
import type { PedidoDraft } from '@/lib/pedido/types';
import { WIDGETS } from '@/lib/oficial/menu';
import { useCarritoEspejo } from './CarritoEstado';
import IconoEspejo from './Iconos';
import './espejo-chrome.css';

type Fila = { id: string; nombre: string; detalle: string; imagen: string | null; href: string };

const rutaImagen = (src: string | null | undefined) => !src ? null : src.startsWith('/assets/') ? siteAsset(src as `/assets/${string}`) : src;
const unidades = (n: number | string) => `${n} ${Number(n) === 1 ? 'unidad' : 'unidades'}`;

function Lista({ pedidos }: { pedidos: PedidoDraft[] }) {
  const estudio = useCart();
  const filas: Fila[] = [
    ...pedidos.map(p => ({
      id: p.id,
      nombre: p.teamName || 'Diseño sin nombre',
      detalle: `${p.product === 'uniform' ? 'Uniforme completo' : 'Camisa'} · ${unidades(p.quantity)}`,
      imagen: rutaImagen(p.design.finalFront || p.design.front),
      href: `/configurador?pedido=${encodeURIComponent(p.id)}`,
    })),
    ...estudio.items.map(item => ({
      id: item.id,
      nombre: item.order.team || 'Diseño sin nombre',
      detalle: `${item.order.line === 'kit' ? 'Uniforme completo' : 'Camisa'} · ${unidades(item.order.quantity)}`,
      imagen: rutaImagen(item.assets.front),
      href: WIDGETS.carrito.href,
    })),
  ];
  if (estudio.loading && !filas.length) return <p className="wb-cf-vacio" role="status">Cargando…</p>;
  if (!filas.length) return <ul className="wb-cf-lista"><li className="wb-cf-vacio">{WIDGETS.carrito.vacio}</li></ul>;
  return <ul className="wb-cf-lista">
    {filas.map(fila => <li key={fila.id}>
      <Link className="wb-cf-item" href={fila.href} prefetch={false}>
        {fila.imagen ? <img src={fila.imagen} alt="" width={56} height={56} loading="lazy" decoding="async"/> : <span className="wb-cf-sin-imagen" aria-hidden="true"><IconoEspejo nombre="canasta" size={22}/></span>}
        <span className="wb-cf-texto"><b>{fila.nombre}</b><small>{fila.detalle}</small></span>
      </Link>
    </li>)}
    {estudio.error && <li className="wb-cf-vacio" role="alert">{estudio.error}</li>}
  </ul>;
}

export default function CarritoFlotante() {
  const { total, pedidos, cargando, error } = useCarritoEspejo();
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), boton = useRef<HTMLButtonElement>(null);
  const ruta = usePathname();

  useEffect(() => { setAbierto(false); }, [ruta]);
  useEffect(() => {
    if (!abierto) return;
    panel.current?.focus({ preventScroll: true });
    const alPulsar = (event: PointerEvent) => { if (raiz.current && !raiz.current.contains(event.target as Node)) setAbierto(false); };
    document.addEventListener('pointerdown', alPulsar);
    return () => document.removeEventListener('pointerdown', alPulsar);
  }, [abierto]);

  const cerrar = () => { setAbierto(false); boton.current?.focus({ preventScroll: true }); };
  const etiqueta = error ? 'Mi carrito: requiere revisión' : cargando ? 'Mi carrito' : `Mi carrito: ${total} ${total === 1 ? 'diseño' : 'diseños'}`;

  return <div ref={raiz} className="wb-carrito-flotante" data-abierto={abierto || undefined}
    onKeyDown={event => { if (event.key === 'Escape' && abierto) { event.preventDefault(); cerrar(); } }}>
    <div id="wb-cf-panel" ref={panel} className="wb-cf-panel" role="dialog" aria-modal="false" aria-labelledby="wb-cf-titulo" tabIndex={-1} hidden={!abierto}>
      <div className="wb-cf-cabeza">
        <h2 id="wb-cf-titulo">{WIDGETS.carrito.titulo}</h2>
        <button type="button" className="wb-cf-cerrar" onClick={cerrar} aria-label="Cerrar carrito"><Icon name="close" size={20}/></button>
      </div>
      <div className="wb-cf-cuerpo">{abierto && <Lista pedidos={pedidos}/>}</div>
      <div className="wb-cf-pie">
        <Link className="tc-btn tc-btn--lime tc-btn--sm tc-btn--block" href={WIDGETS.carrito.href} prefetch={false}>Ver carrito<Icon name="right"/></Link>
      </div>
    </div>
    <button ref={boton} type="button" className="wb-cf-boton" aria-expanded={abierto} aria-controls="wb-cf-panel" aria-label={etiqueta} onClick={() => (abierto ? cerrar() : setAbierto(true))}>
      <IconoEspejo nombre="canasta" size={32}/>
      <span className="wb-cf-contador" data-error={error ? '' : undefined} aria-hidden="true">{error ? '!' : total}</span>
    </button>
  </div>;
}
