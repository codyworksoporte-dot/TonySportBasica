import type { Metadata } from 'next';
import PaginaProductos from '@/components/espejo/tienda/PaginaProductos';

// Official «Productos» page of the menu.
export const metadata: Metadata = { title: 'Productos' };

export default function Productos3() {
  return <PaginaProductos/>;
}
