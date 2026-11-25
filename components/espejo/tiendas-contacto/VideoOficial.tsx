/*
 * VideoOficial: stands in for an official WordPress .mp4 that is not mirrored (no poster on the official).
 * Same box as the official player (width x height at 1440 px, full width on phones), our scales, a play
 * button and «Ver video», linking to the official file in a new tab.
 * Props: url (official .mp4 URL, without the ?_=n query); ancho, alto (player box on the official, px);
 * contexto (completes the accessible name after «Ver video», e.g. "de TONY SPORTSWEAR SAN SALVADOR");
 * dibujo? (our drawing behind the button, e.g. the badge the official first frame shows); anchoDibujo?
 * (% of the box width); className?.
 */
import type { CSSProperties, ReactNode } from 'react';
import Icon from '@/components/Icon';
import { siteAsset } from '@/lib/asset-path';
import './tiendas-contacto.css';

type Props = { url: string; ancho: number; alto: number; contexto: string; dibujo?: ReactNode; anchoDibujo?: number; className?: string };

export default function VideoOficial({ url, ancho, alto, contexto, dibujo, anchoDibujo, className = '' }: Props) {
  const estilo = {
    '--wb-tiendas-contacto-video-ancho': `${ancho}px`,
    '--wb-tiendas-contacto-video-proporcion': `${ancho} / ${alto}`,
    ...(anchoDibujo ? { '--wb-tiendas-contacto-dibujo-ancho': `${anchoDibujo}%` } : {}),
    backgroundImage: `url("${siteAsset('/assets/escamas-tony-base.webp')}")`,
  } as CSSProperties;
  return <a className={`wb-tiendas-contacto-video ${className}`.trim()} href={url} target="_blank" rel="noopener noreferrer" style={estilo}>
    {dibujo && <span className="wb-tiendas-contacto-video-dibujo" aria-hidden="true">{dibujo}</span>}
    <span className="wb-tiendas-contacto-video-boton" aria-hidden="true"><Icon name="play"/></span>
    <span className="wb-tiendas-contacto-video-texto">Ver video</span>
    <span className="tc-sr"> {contexto} (se abre en otra pestaña)</span>
  </a>;
}
