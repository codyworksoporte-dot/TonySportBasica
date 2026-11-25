/*
 * Fila: a WPBakery row (vc_row). Full-width band with its background, the 1200 px container inside and a
 * 12-column flex row for <Columna>s (-15 px gutters, like the official).
 * Props: children; fondo? 'oscuro' | 'negro' | 'tile' | 'lima' | 'imagen' (official teal / black / light grey /
 * green / photo, in our colours); imagen? (official image URL, used with fondo 'imagen'); parallax? (fixed
 * background on desktop, off on touch and with effects off); velo? (0–1 dark veil over the photo);
 * trama? (dotted screen over the photo, like the theme's pattern); anchoCompleto? (no container, columns
 * without gutters: vc_row-no-padding / stretch content); sinPadding? (no 50 px vertical padding);
 * pegadas? (columns do not get the phone spacing between them); as? 'section' | 'div' | 'header' | 'aside';
 * className?; id?; style?; ariaLabel?.
 */
import type { CSSProperties, ReactNode } from 'react';
import { srcOficial } from '@/lib/oficial/imagenes';

export type FondoFila = 'oscuro' | 'negro' | 'tile' | 'lima' | 'imagen';
export type FilaProps = {
  children?: ReactNode;
  fondo?: FondoFila;
  imagen?: string | null;
  parallax?: boolean;
  velo?: number;
  trama?: boolean;
  anchoCompleto?: boolean;
  sinPadding?: boolean;
  pegadas?: boolean;
  as?: 'section' | 'div' | 'header' | 'aside';
  className?: string;
  id?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

export default function Fila({ children, fondo, imagen, parallax = false, velo, trama = false, anchoCompleto = false, sinPadding = false, pegadas = false, as: Etiqueta = 'section', className = '', id, style, ariaLabel }: FilaProps) {
  const foto = imagen ? srcOficial(imagen) : '';
  const tipo: FondoFila | undefined = fondo ?? (foto ? 'imagen' : undefined);
  const clases = [
    'wb-fila',
    tipo ? `wb-fondo--${tipo}` : '',
    parallax && foto ? 'wb-fila--parallax' : '',
    velo !== undefined ? 'wb-velo' : '',
    trama ? 'wb-trama' : '',
    anchoCompleto ? 'wb-fila--ancho-completo' : '',
    sinPadding ? 'wb-fila--sin-padding' : '',
    className,
  ].filter(Boolean).join(' ');
  const estilo = {
    ...(foto ? { backgroundImage: `url("${foto}")` } : {}),
    ...(velo !== undefined ? { '--wb-velo': String(Math.max(0, Math.min(1, velo))) } : {}),
    ...style,
  } as CSSProperties;
  const columnas = <div className={`wb-fila-cols${pegadas ? ' wb-fila-cols--pegadas' : ''}`}>{children}</div>;
  return <Etiqueta id={id} className={clases} style={estilo} aria-label={ariaLabel}>
    {anchoCompleto ? columnas : <div className="wb-contenedor">{columnas}</div>}
  </Etiqueta>;
}
