import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import BandaTitulo from '@/components/espejo/contenido/BandaTitulo';
import EnlaceDiscreto from '@/components/espejo/contenido/EnlaceDiscreto';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/replica/: lime band "Replicas" and three price headings.
// On the official each heading is followed by a linked image whose picture was deleted (an empty link).
export const metadata: Metadata = { title: 'replica' };

const CATEGORIA = 'https://www.tonysportselsalvador.com/categoria/';
const PRECIOS = [
  { titulo: 'Replicas de $7.99', href: `${CATEGORIA}replicas-bordadas-de-8-50/` },
  { titulo: 'Replica de $8.50', href: `${CATEGORIA}replicas-bordadas/` },
  { titulo: 'replicas de $10', href: `${CATEGORIA}replicas-bordadas-de-futbol-10/` },
];

export default function ReplicaPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    {/* The official page title (h1 "replica") is hidden by the theme. */}
    <h1 className="sr-only">replica</h1>
    <BandaTitulo nivel={2}>Replicas</BandaTitulo>
    <Fila sinPadding className="wb-contenido-fila">
      {PRECIOS.map((p) => <Columna key={p.href} ancho={{ sm: 4 }}>
        <Titulo nivel={2} alinear="centro" color="lima">{p.titulo}</Titulo>
        <EnlaceDiscreto href={p.href}>{p.titulo}</EnlaceDiscreto>
      </Columna>)}
    </Fila>
  </main>;
}
