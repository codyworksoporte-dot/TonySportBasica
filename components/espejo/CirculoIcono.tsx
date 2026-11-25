/*
 * CirculoIcono: the big circle with a picture and the title + text under it (Inicio: CALIDAD / ATENCIÓN
 * PERSONALIZADA / EXPERIENCIA). The official circles are white discs with green icons; ours are dark tiles
 * with a lime ring and our line icons or drawings. Up to 365 px (285 on phones), centred in its column.
 * Props: titulo; texto? (ReactNode); icono? (IconoNombre, e.g. 'escudo-check', 'auriculares', 'medalla');
 * dibujo? (ReactNode, e.g. <TonyHead/>); imagen? (official image URL shown inside the circle); href?
 * (whole block becomes a link); nivel? (heading level, default 3); className?.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import IconoEspejo, { type IconoNombre } from './Iconos';
import ImagenOficial from './ImagenOficial';
import { esExterno } from './Boton';
import './espejo-componentes.css';

type Props = {
  titulo: string;
  texto?: ReactNode;
  icono?: IconoNombre;
  dibujo?: ReactNode;
  imagen?: string;
  href?: string;
  nivel?: 2 | 3 | 4;
  className?: string;
};

export default function CirculoIcono({ titulo, texto, icono, dibujo, imagen, href, nivel = 3, className = '' }: Props) {
  const Encabezado = `h${nivel}` as 'h3';
  const disco = <span className="wb-circulo-disco" aria-hidden={imagen ? undefined : true}>
    {dibujo ? <span className="wb-circulo-dibujo">{dibujo}</span>
      : imagen ? <ImagenOficial url={imagen} alt="" className="wb-circulo-imagen"/>
      : <IconoEspejo nombre={icono ?? 'star'} className="wb-circulo-icono" size={120}/>}
  </span>;
  const cuerpo = <>
    {disco}
    <Encabezado className="wb-circulo-titulo">{titulo}</Encabezado>
    {texto && <div className="wb-circulo-texto">{texto}</div>}
  </>;
  if (!href) return <div className={`wb-circulo ${className}`.trim()}>{cuerpo}</div>;
  const externo = esExterno(href);
  return externo
    ? <a className={`wb-circulo wb-circulo--enlace ${className}`.trim()} href={href} target="_blank" rel="noopener noreferrer">{cuerpo}</a>
    : <Link className={`wb-circulo wb-circulo--enlace ${className}`.trim()} href={href} prefetch={false}>{cuerpo}</Link>;
}
