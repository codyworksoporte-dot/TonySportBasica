import type { Metadata } from 'next';
import { Suspense } from 'react';
import AccountExperience from '@/components/AccountExperience';
import '@/components/espejo/tiendas-contacto/tiendas-contacto.css';

// Official "Mi cuenta" is a WooCommerce page: the theme hides its title bar (as on /carrito/) and shows the
// account content inside the 1200 px container. Here that content is our account experience, the same
// component app/cuenta/page.tsx uses, untouched.
export const metadata: Metadata = { title: 'Mi cuenta', referrer: 'no-referrer' };

export default function MiCuentaPage() {
  return <main id="contenido" className="wb-tiendas-contacto-cuenta">
    <div className="wb-contenedor">
      <Suspense fallback={<p role="status">Cargando tu cuenta…</p>}><AccountExperience/></Suspense>
    </div>
  </main>;
}
