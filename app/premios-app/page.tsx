import type { Metadata } from 'next';
import PaginaVacia from '@/components/espejo/pedido-app/PaginaVacia';

// Mirror of https://www.tonysportselsalvador.com/premios-app/: a WordPress page (not the product category
// /categoria/premios-app/ of the menu) whose content is empty, with the title band hidden by the theme.
export const metadata: Metadata = { title: 'Premios App' };

export default function PremiosAppPage() {
  return <PaginaVacia titulo="Premios App"/>;
}
