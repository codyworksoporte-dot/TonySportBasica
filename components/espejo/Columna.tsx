/*
 * Columna: a WPBakery column inside <Fila>. Widths per breakpoint like vc_col-xs/sm/md/lg (1–12):
 * xs < 768, sm >= 768, md >= 992, lg >= 1200; without xs the column is full width on phones.
 * Props: children; ancho? ({ xs?, sm?, md?, lg? } 1–12, e.g. { sm: 4 } = vc_col-sm-4); desplazar?
 * ({ xs?, sm?, md?, lg? } 0–6 offsets); ocultarEn? (('xs' | 'sm' | 'md' | 'lg')[], like vc_hidden-*);
 * alinear? 'izquierda' | 'centro' | 'derecha'; fondo? (same values as Fila, fills the column);
 * imagen? (official image URL as the column's cover background, vc_col-has-fill; give it a min-height via
 * style when the column has no content); as? 'div' | 'article' | 'aside' | 'section'; className?; id?; style?.
 */
import type { CSSProperties, ReactNode } from 'react';
import { srcOficial } from '@/lib/oficial/imagenes';
import type { FondoFila } from './Fila';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';
export type Ancho = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Desplazamiento = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ColumnaProps = {
  children?: ReactNode;
  ancho?: Partial<Record<Breakpoint, Ancho>>;
  desplazar?: Partial<Record<Breakpoint, Desplazamiento>>;
  ocultarEn?: Breakpoint[];
  alinear?: 'izquierda' | 'centro' | 'derecha';
  fondo?: FondoFila;
  imagen?: string | null;
  as?: 'div' | 'article' | 'aside' | 'section';
  className?: string;
  id?: string;
  style?: CSSProperties;
};

const ORDEN: Breakpoint[] = ['xs', 'sm', 'md', 'lg'];

export default function Columna({ children, ancho = {}, desplazar = {}, ocultarEn = [], alinear, fondo, imagen, as: Etiqueta = 'div', className = '', id, style }: ColumnaProps) {
  const foto = imagen ? srcOficial(imagen) : '';
  const clases = ['wb-col'];
  for (const bp of ORDEN) {
    const n = ancho[bp];
    if (n) clases.push(`wb-col-${bp}-${n}`);
    const d = desplazar[bp];
    if (d !== undefined && (d > 0 || bp !== 'xs')) clases.push(`wb-col-${bp}-offset-${d}`);
  }
  for (const bp of ocultarEn) clases.push(`wb-oculto-${bp}`);
  if (alinear === 'centro') clases.push('wb-col--centro');
  if (alinear === 'derecha') clases.push('wb-col--derecha');
  const tipo = fondo ?? (foto ? 'imagen' : undefined);
  if (tipo) clases.push(`wb-fondo--${tipo}`);
  if (className) clases.push(className);
  const estilo = foto ? { backgroundImage: `url("${foto}")`, ...style } : style;
  return <Etiqueta id={id} className={clases.join(' ')} style={estilo}>{children}</Etiqueta>;
}
