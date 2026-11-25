/*
 * CajaIcono: the theme's side_icon_box ("xlarge") of «LO QUE NOS DISTINGUE»: a big icon on the left and the
 * text beside it; on phones the icon sits centred above the text. Official teal icon -> our lime line icon.
 * Props: icono (IconoNombre); children (the text); className?.
 */
import type { ReactNode } from 'react';
import IconoEspejo, { type IconoNombre } from '@/components/espejo/Iconos';

type Props = { icono: IconoNombre; children: ReactNode; className?: string };

export default function CajaIcono({ icono, children, className = '' }: Props) {
  return <div className={`wb-inicio-caja ${className}`.trim()}>
    <span className="wb-inicio-caja-icono" aria-hidden="true"><IconoEspejo nombre={icono} size={52}/></span>
    <p className="wb-inicio-caja-texto">{children}</p>
  </div>;
}
