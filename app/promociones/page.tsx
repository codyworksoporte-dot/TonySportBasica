import type { Metadata } from 'next';
import '@/components/espejo/promos/promos.css';

export const metadata: Metadata = { title: 'Promociones' };

// Mirror of tonysportselsalvador.com/promociones/: the official page is empty (its content is "<p></p>" and
// the theme hides the page title and breadcrumb), so only the band between header and footer shows. The
// promotions themselves live in the menu's child, /categoria/promo-inicio-de-ano/.
export default function PromocionesPage() {
  return <main id="contenido" className="wb-promos wb-promos-vacia">
    <h1 className="tc-sr">Promociones</h1>
  </main>;
}
