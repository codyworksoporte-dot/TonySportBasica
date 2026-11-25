import type { Metadata } from 'next';
import PaginaVacia from '@/components/espejo/tienda/PaginaVacia';

// Official «Street Wear» (child of Tienda en línea): published without content.
export const metadata: Metadata = { title: 'Street Wear' };

export default function StreetWear() {
  return <PaginaVacia titulo="Street Wear"/>;
}
