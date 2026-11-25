/*
 * Titulo: the theme's boc_heading in our display face. Uppercase by default (boc_heading); set
 * mayusculas={false} for the official "no_text_transform" headings. Official green titles -> color 'lima'.
 * Props: children; nivel? 1–6 (default 2); alinear? 'izquierda' | 'centro' | 'derecha' (default 'izquierda');
 * color? 'lima' | 'claro' (default 'claro'); separador? boolean | 'corto' | 'icono' | 'linea' (the divider the
 * official places under the heading; true = 'corto'); mayusculas? (default true); tamano? (px, overrides the
 * level size); estilo? 'display' | 'texto' (texto = body face, e.g. the CTA bands); className?; id?.
 */
import type { CSSProperties, ReactNode } from 'react';
import Separador from './Separador';
import './espejo-componentes.css';

type Props = {
  children: ReactNode;
  nivel?: 1 | 2 | 3 | 4 | 5 | 6;
  alinear?: 'izquierda' | 'centro' | 'derecha';
  color?: 'lima' | 'claro';
  separador?: boolean | 'corto' | 'icono' | 'linea';
  mayusculas?: boolean;
  tamano?: number;
  estilo?: 'display' | 'texto';
  className?: string;
  id?: string;
};

export default function Titulo({ children, nivel = 2, alinear = 'izquierda', color = 'claro', separador = false, mayusculas = true, tamano, estilo = 'display', className = '', id }: Props) {
  const Etiqueta = `h${nivel}` as 'h1';
  const clases = ['wb-titulo', `wb-h${nivel}`, `wb-${alinear}`, color === 'lima' ? 'wb-lima' : 'wb-claro', mayusculas ? 'wb-mayus' : '', estilo === 'texto' ? 'wb-titulo--texto' : '', className].filter(Boolean).join(' ');
  const css = tamano ? ({ fontSize: `${tamano}px` } as CSSProperties) : undefined;
  const tipo = separador === true ? 'corto' : separador || null;
  if (!tipo) return <Etiqueta id={id} className={clases} style={css}>{children}</Etiqueta>;
  return <div className={`wb-titulo-grupo wb-${alinear}`}>
    <Etiqueta id={id} className={clases} style={css}>{children}</Etiqueta>
    <Separador tipo={tipo} alinear={alinear} color={color === 'lima' && tipo !== 'icono' ? 'lima' : 'linea'}/>
  </div>;
}
