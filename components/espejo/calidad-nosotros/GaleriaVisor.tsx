'use client';
/*
 * GaleriaVisor: the official Robo Gallery grid (3 / 2 / 1 columns, 15 px gaps, zoom veil) and its lightbox
 * (Magnific Popup in the official) as a modal <dialog>: Escape closes, Left/Right navigate (looping), Tab stays
 * inside, a click on the dark area closes, and focus returns to the thumbnail. Use Galeria (server) so the
 * images are resolved before reaching the browser.
 * Props: imagenes (ImagenGaleria[]), etiqueta (accessible name of the grid), visor? (name of the dialog).
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Icon from '@/components/Icon';
import './calidad-nosotros.css';

type Archivo = { src: string; w: number; h: number };
export type ImagenGaleria = { mini: Archivo | null; grande: Archivo | null; alt: string; titulo: string; original: string };
type Props = { imagenes: ImagenGaleria[]; etiqueta: string; visor?: string };

const ENFOCABLES = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function GaleriaVisor({ imagenes, etiqueta, visor = 'Visor de imágenes' }: Props) {
  const total = imagenes.length;
  const [abierta, setAbierta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const cerrarBoton = useRef<HTMLButtonElement>(null);
  const origen = useRef<HTMLElement | null>(null);

  const cerrar = useCallback(() => setAbierta(null), []);
  const mover = useCallback((paso: number) => setAbierta(n => (n === null ? n : (n + paso + total) % total)), [total]);

  // Opens or closes the native modal dialog to follow the state.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta !== null && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = 'hidden';
      cerrarBoton.current?.focus();
    } else if (abierta === null && d.open) d.close();
  }, [abierta]);

  // Escape (native cancel) and close(): reset the state, the page scroll and the focus.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const alCerrar = () => {
      setAbierta(null);
      document.documentElement.style.overflow = '';
      origen.current?.focus();
    };
    d.addEventListener('close', alCerrar);
    return () => {
      d.removeEventListener('close', alCerrar);
      document.documentElement.style.overflow = '';
    };
  }, []);

  const teclas = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      mover(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (event.key !== 'Tab') return;
    const lista = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(ENFOCABLES));
    if (!lista.length) return;
    const primero = lista[0], ultimo = lista[lista.length - 1];
    const activo = document.activeElement;
    if (event.shiftKey && (activo === primero || !event.currentTarget.contains(activo))) { event.preventDefault(); ultimo.focus(); }
    else if (!event.shiftKey && (activo === ultimo || !event.currentTarget.contains(activo))) { event.preventDefault(); primero.focus(); }
  };

  const actual = abierta === null ? null : imagenes[abierta];
  return <>
    <ul className="wb-calidad-nosotros-galeria" aria-label={etiqueta}>
      {imagenes.map((imagen, i) => <li key={`${imagen.original}-${i}`}>
        <button type="button" className="wb-calidad-nosotros-galeria-boton" aria-haspopup="dialog" aria-label={`Ampliar ${imagen.alt}`}
          onClick={event => { origen.current = event.currentTarget; setAbierta(i); }}>
          {imagen.mini
            ? <img src={imagen.mini.src} width={imagen.mini.w} height={imagen.mini.h} alt="" loading="lazy" decoding="async"/>
            : <span className="wb-img-falta" aria-hidden="true" data-falta-imagen={imagen.original}/>}
          <span className="wb-calidad-nosotros-galeria-velo" aria-hidden="true"><span className="wb-calidad-nosotros-galeria-zoom"><Icon name="search" size={20}/></span></span>
        </button>
      </li>)}
    </ul>
    <dialog ref={dialogo} className="wb-calidad-nosotros-visor" aria-label={visor} onKeyDown={teclas}
      onClick={event => { if (event.target === event.currentTarget) cerrar(); }}>
      <button ref={cerrarBoton} type="button" className="wb-calidad-nosotros-visor-boton wb-calidad-nosotros-visor-cerrar" onClick={cerrar} aria-label="Cerrar (Esc)">
        <Icon name="close" size={22}/>
      </button>
      {actual && abierta !== null && <figure className="wb-calidad-nosotros-visor-figura">
        {actual.grande
          ? <img src={actual.grande.src} width={actual.grande.w} height={actual.grande.h} alt={actual.alt} decoding="async"/>
          : <span className="wb-img-falta" role="img" aria-label={actual.alt} data-falta-imagen={actual.original}/>}
        <figcaption className="wb-calidad-nosotros-visor-pie">
          <span className="wb-calidad-nosotros-visor-titulo">{actual.titulo}</span>
          <span aria-live="polite">{abierta + 1} de {total}</span>
        </figcaption>
      </figure>}
      {total > 1 && <>
        <button type="button" className="wb-calidad-nosotros-visor-boton wb-calidad-nosotros-visor-anterior" onClick={() => mover(-1)} aria-label="Anterior (flecha izquierda)">
          <Icon name="left" size={24}/>
        </button>
        <button type="button" className="wb-calidad-nosotros-visor-boton wb-calidad-nosotros-visor-siguiente" onClick={() => mover(1)} aria-label="Siguiente (flecha derecha)">
          <Icon name="right" size={24}/>
        </button>
      </>}
    </dialog>
  </>;
}
