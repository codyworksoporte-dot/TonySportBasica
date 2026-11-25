/*
 * BandaTitulo: the official stretched title row with the green fill (subliminado, tipo de sublimando,
 * replica) in our lime: heading centred at the top of the band, 20 px under it, 35 px before the next row.
 * Props: children (heading text, uppercased like boc_heading); nivel? (1 | 2, default 1); divisor? (the
 * official divider drawn in the band's own colour: only its 41 px of space shows); className?.
 */
import type { ReactNode } from 'react';
import Titulo from '@/components/espejo/Titulo';
import './contenido.css';

type Props = { children: ReactNode; nivel?: 1 | 2; divisor?: boolean; className?: string };

export default function BandaTitulo({ children, nivel = 1, divisor = false, className = '' }: Props) {
  const clases = ['wb-fondo--lima', 'wb-contenido-banda', divisor ? 'wb-contenido-banda--divisor' : '', className].filter(Boolean).join(' ');
  return <div className={clases}>
    <Titulo nivel={nivel} alinear="centro">{children}</Titulo>
  </div>;
}
