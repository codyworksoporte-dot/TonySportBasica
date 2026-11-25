import type { Metadata } from 'next';
import PaginaVacia from '@/components/espejo/tienda/PaginaVacia';

// Official «Camisas venta individual» (child of Tienda en línea): published without content.
export const metadata: Metadata = { title: 'Camisas venta individual' };

export default function CamisasVentaIndividual() {
  return <PaginaVacia titulo="Camisas venta individual"/>;
}
