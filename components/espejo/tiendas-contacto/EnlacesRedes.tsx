/*
 * EnlacesRedes: the official contact lines of the store and service texts ("Ubicación: Google maps",
 * "Facebook: …", "Cel/WhatsApp: …"), one per line with its icon in our set.
 * Props: lineas (LineaRed[]): each line has an icono and partes, texts or links shown in order with a
 * space between them (pegado: no space before). Links: lima (green on the official, else light text),
 * negrita, nueva (the official opens it in a new tab).
 */
import IconoEspejo, { type IconoNombre } from '@/components/espejo/Iconos';
import './tiendas-contacto.css';

export type IconoRed = 'ubicacion' | 'facebook' | 'instagram' | 'whatsapp' | 'correo';
export type ParteRed = { texto: string; href?: string; lima?: boolean; negrita?: boolean; nueva?: boolean; pegado?: boolean };
export type LineaRed = { icono: IconoRed; partes: ParteRed[] };

const ICONOS: Record<IconoRed, IconoNombre> = { ubicacion: 'idioma', facebook: 'facebook', instagram: 'instagram', whatsapp: 'whatsapp-solid', correo: 'correo' };
const NUEVA = ' (se abre en otra pestaña)';

function Parte({ parte }: { parte: ParteRed }) {
  const { texto, href, lima = false, negrita = false, nueva = false } = parte;
  if (!href) return negrita ? <strong className="wb-tiendas-contacto-negrita">{texto}</strong> : <>{texto}</>;
  const clases = ['wb-tiendas-contacto-enlace', lima ? 'wb-tiendas-contacto-enlace--lima' : '', negrita ? 'wb-tiendas-contacto-negrita' : ''].filter(Boolean).join(' ');
  return <a className={clases} href={href} {...(nueva ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    {texto}{nueva && <span className="tc-sr">{NUEVA}</span>}
  </a>;
}

export default function EnlacesRedes({ lineas, className = '' }: { lineas: LineaRed[]; className?: string }) {
  return <ul className={`wb-tiendas-contacto-redes ${className}`.trim()}>
    {lineas.map((linea, i) => <li key={i}>
      <IconoEspejo nombre={ICONOS[linea.icono]} size={16} className="wb-tiendas-contacto-redes-icono"/>
      <span className="wb-tiendas-contacto-redes-linea">
        {linea.partes.map((parte, j) => <span key={j}>{j > 0 && !parte.pegado ? ' ' : ''}<Parte parte={parte}/></span>)}
      </span>
    </li>)}
  </ul>;
}
