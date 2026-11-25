/*
 * IconoEspejo: glyphs the mirror needs that components/Icon.tsx does not have, drawn on the same
 * 24 px grid and 1.5 stroke (line) or as filled brand shapes (solid). Any other name falls back to Icon.
 * Props: nombre (IconoNombre), size (px, default 20), className.
 */
import Icon, { type IconName } from '@/components/Icon';

const LINEA = {
  correo: 'M3 6.5h18v11H3v-11Zm0 .5 9 6.5L21 7',
  carrito: 'M2.5 4h2.2l2.2 10.6a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.5-1.2L20.8 8H5.6M9.5 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8.5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z',
  canasta: 'M3 10h18l-2.2 10H5.2L3 10Zm4.5 0L12 4.5 16.5 10M9.5 13.5v3.5m5-3.5v3.5',
  idioma: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3Z',
  volumen: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Zm11.5-.5a4.5 4.5 0 0 1 0 6m2.5-8.5a8 8 0 0 1 0 11',
  silencio: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Zm11 0 5 5m0-5-5 5',
  'escudo-check': 'M12 2.8 20 6v6.2c0 4.6-3.4 7.9-8 9.3-4.6-1.4-8-4.7-8-9.3V6l8-3.2Zm-3.8 9.4 2.7 2.7 5-5.3',
  auriculares: 'M4.5 14v-2a7.5 7.5 0 0 1 15 0v2m-15 0h2.5v5H5.5a1 1 0 0 1-1-1v-4Zm15 0H17v5h1.5a1 1 0 0 0 1-1v-4ZM17 19c0 1.4-1.6 2-4 2h-1',
  medalla: 'M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-7.4.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3.9-1.8ZM8.5 11.8 5 3h4l3 6 3-6h4l-3.5 8.8',
  tijeras: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2.2-13.2L20 18M8.2 16.2 20 6',
  reloj: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.5V12l3 2',
  camion: 'M2.5 6h11v10h-11V6Zm11 4h4l3 3v3h-7v-6ZM7 18.5a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0Zm12 0a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0Z',
  telefono: 'M5 3.5h3.5l1.5 4.5-2.2 1.5a11 11 0 0 0 6.7 6.7l1.5-2.2 4.5 1.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z',
} as const;

const SOLIDO = {
  facebook: 'M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8v8h3.4Z',
  instagram: 'M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM12 4.6c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1ZM12 3c-2.4 0-2.8 0-3.7.1-3.3.2-5 2-5.2 5.2C3 9.2 3 9.6 3 12s0 2.8.1 3.7c.2 3.3 2 5 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.2 5-2 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7c-.2-3.3-2-5-5.2-5.2C14.8 3 14.4 3 12 3Z',
  diamante: 'M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z',
  pausa: 'M7 4.5h3.5v15H7v-15Zm6.5 0H17v15h-3.5v-15Z',
} as const;

export type IconoEspejoNombre = keyof typeof LINEA | keyof typeof SOLIDO;
export type IconoNombre = IconoEspejoNombre | IconName;
type Props = { nombre: IconoNombre; size?: number; className?: string };

export function esIconoEspejo(nombre: string): nombre is IconoEspejoNombre {
  return nombre in LINEA || nombre in SOLIDO;
}

export default function IconoEspejo({ nombre, size = 20, className }: Props) {
  if (nombre in SOLIDO) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d={SOLIDO[nombre as keyof typeof SOLIDO]}/></svg>;
  }
  if (nombre in LINEA) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={LINEA[nombre as keyof typeof LINEA]}/></svg>;
  }
  return <Icon name={nombre as IconName} size={size} className={className}/>;
}
