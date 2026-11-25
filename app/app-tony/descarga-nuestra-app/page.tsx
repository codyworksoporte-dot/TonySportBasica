import type { Metadata } from 'next';
import PaginaVacia from '@/components/espejo/pedido-app/PaginaVacia';

// Mirror of https://www.tonysportselsalvador.com/app-tony/descarga-nuestra-app/: its WordPress content is
// empty and the theme hides the title band, so the official shows a blank body.
export const metadata: Metadata = { title: 'DESCARGA NUESTRA APP' };

export default function DescargaNuestraAppPage() {
  return <PaginaVacia titulo="DESCARGA NUESTRA APP"/>;
}
