'use client';
/*
 * WhatsAppFlotante: the official WhatsApp bubble, bottom left. The "WhatsApp" pill toggles a card with the
 * literal texts; like the official it opens by itself after 3 s, unless the visitor closed it this session.
 * Our crocodile is the avatar. Props: retrasoMs? (auto-open delay, 0 disables it; default 3000).
 */
import { useEffect, useId, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { TonyHead } from '@/components/TonyArt';
import { WHATSAPP_FLOTANTE as W } from '@/lib/oficial/menu';
import './espejo-chrome.css';

const CERRADO = 'wb:whatsapp:cerrado';

export default function WhatsAppFlotante({ retrasoMs = 3000 }: { retrasoMs?: number }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!retrasoMs) return;
    let cerrado = false;
    try { cerrado = sessionStorage.getItem(CERRADO) === '1'; } catch { /* Storage may be blocked. */ }
    if (cerrado) return;
    const espera = window.setTimeout(() => setAbierto(true), retrasoMs);
    return () => window.clearTimeout(espera);
  }, [retrasoMs]);

  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false);
    try { sessionStorage.setItem(CERRADO, '1'); } catch { /* The choice then lasts for this page only. */ }
    if (devolverFoco) boton.current?.focus();
  };

  return <div className="wb-wa" data-abierto={abierto || undefined} onKeyDown={event => { if (event.key === 'Escape' && abierto) { event.preventDefault(); cerrar(true); } }}>
    <div id={id} className="wb-wa-caja" role="region" aria-label="WhatsApp" hidden={!abierto}>
      <div className="wb-wa-cabeza">
        <p>{W.descripcion}</p>
        <button type="button" className="wb-wa-cerrar" onClick={() => cerrar(true)} aria-label="Cerrar"><Icon name="close" size={18}/></button>
      </div>
      <div className="wb-wa-cuerpo">
        <a className="wb-wa-cuenta" href={W.href} target="_blank" rel="noopener noreferrer">
          <span className="wb-wa-cara"><TonyHead className="wb-wa-tony"/><span className="wb-wa-sello"><Icon name="whatsapp-solid" size={12}/></span></span>
          <span className="wb-wa-info"><span className="wb-wa-titulo">{W.titulo}</span><span className="wb-wa-nombre">{W.nombre}</span></span>
          <span className="tc-sr"> (se abre en otra pestaña)</span>
        </a>
      </div>
    </div>
    <button ref={boton} type="button" className="wb-wa-boton" aria-expanded={abierto} aria-controls={id} onClick={() => (abierto ? cerrar(false) : setAbierto(true))}>
      <Icon name="whatsapp-solid" size={17}/><span>{W.boton}</span>
    </button>
  </div>;
}
