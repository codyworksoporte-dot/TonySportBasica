import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import BandaTitulo from '@/components/espejo/contenido/BandaTitulo';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/replica/: lime band "Replicas" and three price headings.
// On the official each heading is followed by an empty link (its picture was deleted) to a category that no
// longer exists (404 there too); the mirror leaves those dead, invisible links out.
export const metadata: Metadata = { title: 'replica' };

const PRECIOS = ['Replicas de $7.99', 'Replica de $8.50', 'replicas de $10'];

export default function ReplicaPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    {/* The official page title (h1 "replica") is hidden by the theme. */}
    <h1 className="sr-only">replica</h1>
    <BandaTitulo nivel={2}>Replicas</BandaTitulo>
    <Fila sinPadding className="wb-contenido-fila">
      {PRECIOS.map((titulo) => <Columna key={titulo} ancho={{ sm: 4 }}>
        <Titulo nivel={2} alinear="centro" color="lima">{titulo}</Titulo>
      </Columna>)}
    </Fila>
  </main>;
}
