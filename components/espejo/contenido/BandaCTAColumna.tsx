/*
 * BandaCTAColumna: BandaCTA placed inside the main column of a page with sidebar. The official row is
 * stretched by the theme: its green fill (our lime) runs edge to edge over the sidebar while the text and
 * the outline button stay within the column. Same text/button styles as BandaCTA.
 * Props: texto; boton ({ texto, href }: local route); className?.
 */
import type { ReactNode } from 'react';
import Boton from '@/components/espejo/Boton';
import './contenido.css';

type Props = { texto: ReactNode; boton: { texto: string; href: string }; className?: string };

export default function BandaCTAColumna({ texto, boton, className = '' }: Props) {
  return <section className={`wb-fondo--lima wb-contenido-cta ${className}`.trim()}>
    <div className="wb-banda-cta-in">
      <h2 className="wb-banda-cta-texto">{texto}</h2>
      <Boton href={boton.href} variante="contorno" className="wb-banda-cta-boton">{boton.texto}</Boton>
    </div>
  </section>;
}
