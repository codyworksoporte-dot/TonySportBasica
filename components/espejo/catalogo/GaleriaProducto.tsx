'use client';
/*
 * GaleriaProducto: the WooCommerce product gallery of the theme: the main image (400 px when it is the only one,
 * the full column otherwise) and the rest as square thumbnails, four per row. Every image links to its large
 * version (it still works without JavaScript) and opens an accessible lightbox: native modal <dialog>, Esc or
 * the × to close, arrows (buttons and keyboard) to move, focus back on the image that opened it.
 * Props: imagenes ({ grande, mini, alt }[], resolved local WebP); nombre (product name, for the labels);
 * oferta? ("¡Oferta!" flash on the main image).
 */
import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import Icon from '@/components/Icon';
import type { ImagenResuelta } from './tipos';
import { SinFoto } from './TarjetaCatalogo';

export type ImagenGaleria = { grande: ImagenResuelta; mini: ImagenResuelta; alt: string };
type Props = { imagenes: ImagenGaleria[]; nombre: string; oferta?: boolean };

export default function GaleriaProducto({ imagenes, nombre, oferta = false }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [indice, setIndice] = useState<number | null>(null);
  const total = imagenes.length;

  function abrir(i: number) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks open the image file as usual.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0 || !dialogo.current) return;
      event.preventDefault();
      setIndice(i);
      if (!dialogo.current.open) dialogo.current.showModal();
    };
  }
  const mover = (paso: number) => setIndice((i) => (i === null ? i : (i + paso + total) % total));
  const cerrar = () => dialogo.current?.close();
  function alPulsarTecla(event: KeyboardEvent<HTMLDialogElement>) {
    if (total < 2) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); mover(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); mover(-1); }
  }

  if (!total) return <div className="wb-galeria wb-galeria--unica"><SinFoto className="wb-galeria-sin-foto"/></div>;
  const [principal, ...resto] = imagenes;
  const actual = indice === null ? null : imagenes[indice];

  // data-no-transition: the image links open the lightbox, not a new page (RouteTransition listens to clicks).
  return <div className={`wb-galeria${total > 1 ? ' wb-galeria--varias' : ' wb-galeria--unica'}`} data-no-transition>
    <div className="wb-galeria-principal">
      {oferta && <span className="wb-producto-etiqueta wb-galeria-oferta">¡Oferta!</span>}
      <a href={principal.grande.src} onClick={abrir(0)} className="wb-galeria-enlace"
        aria-label={total > 1 ? `Ampliar imagen 1 de ${total}: ${nombre}` : `Ampliar imagen: ${nombre}`}>
        <img src={principal.grande.src} width={principal.grande.w} height={principal.grande.h} alt={principal.alt || nombre}
          loading="eager" fetchPriority="high" decoding="async"/>
        <span className="wb-galeria-lupa" aria-hidden="true"><Icon name="search" size={20}/></span>
      </a>
    </div>
    {resto.length > 0 && <ul className="wb-galeria-miniaturas" aria-label={`Más imágenes de ${nombre}`}>
      {resto.map((im, i) => <li key={`${im.grande.src}-${i}`}>
        <a href={im.grande.src} onClick={abrir(i + 1)} className="wb-galeria-enlace" aria-label={`Ampliar imagen ${i + 2} de ${total}`}>
          <img src={im.mini.src} width={im.mini.w} height={im.mini.h} alt={im.alt} loading="lazy" decoding="async"/>
        </a>
      </li>)}
    </ul>}
    <dialog ref={dialogo} className="wb-galeria-dialogo" aria-label={`Imágenes de ${nombre}`}
      onClose={() => setIndice(null)} onKeyDown={alPulsarTecla}
      onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.fondo !== undefined) cerrar(); }}>
      {actual && <div className="wb-galeria-dialogo-in" data-fondo="">
        <figure className="wb-galeria-figura" data-fondo="">
          <img key={actual.grande.src} src={actual.grande.src} width={actual.grande.w} height={actual.grande.h}
            style={{ '--r': String(actual.grande.w / actual.grande.h) } as CSSProperties}
            alt={actual.alt || `${nombre}, imagen ${(indice ?? 0) + 1}`}/>
          {total > 1 && <figcaption className="wb-galeria-contador" aria-live="polite">{(indice ?? 0) + 1} / {total}</figcaption>}
        </figure>
        <button type="button" className="wb-galeria-boton wb-galeria-cerrar" onClick={cerrar} aria-label="Cerrar" autoFocus>
          <Icon name="close" size={22}/>
        </button>
        {total > 1 && <>
          <button type="button" className="wb-galeria-boton wb-galeria-anterior" onClick={() => mover(-1)} aria-label="Imagen anterior">
            <Icon name="left" size={26}/>
          </button>
          <button type="button" className="wb-galeria-boton wb-galeria-siguiente" onClick={() => mover(1)} aria-label="Imagen siguiente">
            <Icon name="right" size={26}/>
          </button>
        </>}
      </div>}
    </dialog>
  </div>;
}
