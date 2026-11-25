import type { Metadata } from 'next';
import '@/components/espejo/contenido/contenido.css';

// The official address shows an Apache "Index of /implementos-deportivos" listing (a server folder with the
// same name). The WordPress page "Implementos Deportivos" behind it has no content (paginas-wp.json), so the
// mirror renders it like the official empty pages (/premios-app/, /street-wear/): hidden title and the
// theme's empty content area between header and footer. The products live in /categoria/implementos-deportivos/.
export const metadata: Metadata = { title: 'Implementos Deportivos' };

export default function ImplementosDeportivosPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    <h1 className="sr-only">Implementos Deportivos</h1>
  </main>;
}
