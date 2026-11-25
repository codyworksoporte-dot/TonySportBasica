/*
 * BandaParallax: a photo band with fixed background (desktop), dotted screen and dark veil, title and
 * button centred ("¿Requieres más información? Contáctanos, con gusto te atenderemos"). 292 px tall at 1440.
 * Props: imagen (official image URL); titulo (ReactNode); boton? ({ texto, href }); texto? (ReactNode under
 * the title); alto? (min height px, default 292); velo? (0–1, default .45); mayusculas? (title, default false
 * like the official); nivel? (default 2); children? (extra content); className?; id?.
 */
import type { CSSProperties, ReactNode } from 'react';
import Boton from './Boton';
import Fila from './Fila';
import './espejo-componentes.css';

type Props = {
  imagen: string;
  titulo: ReactNode;
  boton?: { texto: string; href: string };
  texto?: ReactNode;
  alto?: number;
  velo?: number;
  mayusculas?: boolean;
  nivel?: 2 | 3;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export default function BandaParallax({ imagen, titulo, boton, texto, alto = 292, velo = .45, mayusculas = false, nivel = 2, children, className = '', id }: Props) {
  const Encabezado = `h${nivel}` as 'h2';
  return <Fila fondo="imagen" imagen={imagen} parallax velo={velo} trama sinPadding id={id}
    className={`wb-banda-parallax ${className}`.trim()} style={{ '--wb-bp-alto': `${alto}px` } as CSSProperties}>
    <div className="wb-col wb-banda-parallax-in">
      <Encabezado className={`wb-banda-parallax-titulo${mayusculas ? ' wb-mayus' : ''}`}>{titulo}</Encabezado>
      {texto && <div className="wb-banda-parallax-texto">{texto}</div>}
      {boton && <Boton href={boton.href} tamano="sm">{boton.texto}</Boton>}
      {children}
    </div>
  </Fila>;
}
