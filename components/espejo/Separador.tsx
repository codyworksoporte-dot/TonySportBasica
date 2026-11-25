/*
 * Separador: the theme's boc_divider. 'icono' (default) is the full-width line with a lime square and an
 * icon in the middle, as under "LO QUE NOS DISTINGUE"; 'corto' is the 60 px rule under headings; 'linea'
 * a plain full-width rule. Decorative (aria-hidden).
 * Props: tipo? 'icono' | 'corto' | 'linea'; icono? (IconoNombre, default 'diamante'); alinear?
 * 'izquierda' | 'centro' | 'derecha' (for 'corto'); color? 'linea' | 'lima'; className?.
 */
import IconoEspejo, { type IconoNombre } from './Iconos';
import './espejo-componentes.css';

type Props = {
  tipo?: 'icono' | 'corto' | 'linea';
  icono?: IconoNombre;
  alinear?: 'izquierda' | 'centro' | 'derecha';
  color?: 'linea' | 'lima';
  className?: string;
};

export default function Separador({ tipo = 'icono', icono = 'diamante', alinear = 'izquierda', color = 'linea', className = '' }: Props) {
  if (tipo === 'icono') {
    return <div className={`wb-separador${color === 'lima' ? ' wb-separador--lima' : ''} ${className}`.trim()} aria-hidden="true">
      <span className="wb-separador-icono"><IconoEspejo nombre={icono} size={14}/></span>
    </div>;
  }
  const clases = ['wb-divisor', tipo === 'linea' ? 'wb-divisor--completo' : '', alinear === 'centro' ? 'wb-divisor--centro' : alinear === 'derecha' ? 'wb-divisor--derecha' : '', color === 'lima' ? 'wb-divisor--lima' : '', className];
  return <span className={clases.filter(Boolean).join(' ')} aria-hidden="true"/>;
}
