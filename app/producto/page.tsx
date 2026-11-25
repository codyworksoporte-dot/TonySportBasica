import type { Metadata } from 'next';
import PaginaProductos from '@/components/espejo/tienda/PaginaProductos';

// /producto: the route the protected cart links to («ver productos»). It shows the official «Productos»
// page of the menu, the same as /productos3/.
export const metadata: Metadata = { title: 'Productos' };

export default function Producto() {
  return <PaginaProductos/>;
}
