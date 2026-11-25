/*
 * BandaCTA: the official call-to-action band ("Si tienes alguna duda estamos a tus órdenes" + CONTÁCTANOS):
 * text left, button right; stacked on phones. Official green band -> our lime with dark text.
 * Props: texto (ReactNode); boton ({ texto, href }); fondo? 'lima' | 'oscuro' | 'tile' | 'negro'
 * (default 'lima'); variante? (button, default 'contorno' like the official outline button); nivel?
 * (heading level of the text, default 2); className?; id?.
 */
import type { ReactNode } from 'react';
import Boton from './Boton';
import './espejo-componentes.css';

type Props = {
  texto: ReactNode;
  boton: { texto: string; href: string };
  fondo?: 'lima' | 'oscuro' | 'tile' | 'negro';
  variante?: 'lleno' | 'contorno';
  nivel?: 2 | 3;
  className?: string;
  id?: string;
};

export default function BandaCTA({ texto, boton, fondo = 'lima', variante = 'contorno', nivel = 2, className = '', id }: Props) {
  const Encabezado = `h${nivel}` as 'h2';
  return <section id={id} className={`wb-banda-cta wb-fondo--${fondo} ${className}`.trim()}>
    <div className="wb-contenedor wb-banda-cta-in">
      <Encabezado className="wb-banda-cta-texto">{texto}</Encabezado>
      <Boton href={boton.href} variante={variante} className="wb-banda-cta-boton">{boton.texto}</Boton>
    </div>
  </section>;
}
