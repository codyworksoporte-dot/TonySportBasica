import type { Metadata } from 'next';
import ArchivoTienda from '@/components/espejo/tienda/ArchivoTienda';

// Official WooCommerce shop archive, page 1 of 21 (12 of the 242 products).
export const metadata: Metadata = { title: 'Productos' };

export default function Productos() {
  return <ArchivoTienda pagina={1}/>;
}
