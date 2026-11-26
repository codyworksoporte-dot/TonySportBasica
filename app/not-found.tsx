import type { Metadata } from 'next';
import AvisoCerrable from '@/components/espejo/AvisoCerrable';

// The official 404 page (Elegante theme): its title bar is hidden and the closable warning sits under the header
// in the content area, which keeps the 596 px of the empty pages before the footer.
export const metadata: Metadata = { title: 'Página no encontrada' };

export default function NotFound() {
  return <main id="contenido" className="wb-no-encontrada">
    <h1 className="tc-sr">404 Página no encontrada</h1>
    <div className="wb-contenedor">
      <AvisoCerrable>¡La página a la que intentas acceder no existe!</AvisoCerrable>
    </div>
  </main>;
}
