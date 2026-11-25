import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import BandaTitulo from '@/components/espejo/contenido/BandaTitulo';
import CajaImagen from '@/components/espejo/contenido/CajaImagen';
import ImagenEnlazada from '@/components/espejo/contenido/ImagenEnlazada';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/tipo-de-sublimando/: lime title band and two rows of two
// green headings with their linked picture.
export const metadata: Metadata = { title: 'tipo de sublimando' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const SITIO = 'https://www.tonysportselsalvador.com/';
const TAMANOS = '(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) 45vw, 585px';

type Tipo = { titulo: string; imagen: string; href: string };
const tipo = (titulo: string, archivo: string, ruta: string): Tipo => ({ titulo, imagen: `${SUBIDAS}${archivo}`, href: `${SITIO}${ruta}` });

const FILAS: Tipo[][] = [
  [
    tipo('Camisa sublimada frontal', 'WhatsApp-Image-2021-11-02-at-4.26.11-AM-3-1.jpeg', 'categoria/camisas-o-promocionales/'),
    tipo('Camisa polo sublimada frontal', 'WhatsApp-Image-2022-04-12-at-9.33.19-AM-1-1.jpeg', 'producto/camisa-sublimado-frontal-tipo-polo/'),
  ],
  [
    tipo('camisa polo full sublimada', 'WhatsApp-Image-2022-04-12-at-9.31.49-AM-1-1.jpeg', 'producto/album-001-de-camisas-de-presentacion-tipo-polo-full-sublimadas/'),
    tipo('Uniformes de presentación polo', 'WhatsApp-Image-2021-10-12-at-7.53.47-AM-1-1.jpeg', 'producto/uniformes-de-presentacion-tipo-polo/'),
  ],
];

// The official phone layout loads the -400x400 copy of each picture.
const movil = (imagen: string) => imagen.replace(/\.jpeg$/, '-400x400.jpeg');

export default function TipoDeSublimandoPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    <BandaTitulo nivel={1} divisor>Tipos de Personalizado Camisas</BandaTitulo>
    {FILAS.map((fila, i) => <Fila key={i} sinPadding className="wb-contenido-fila">
      {fila.map((t, j) => <Columna key={t.href} ancho={{ sm: 6 }}>
        <Titulo nivel={2} alinear="centro" color="lima">{t.titulo}</Titulo>
        <ImagenEnlazada href={t.href} url={t.imagen} movil={movil(t.imagen)} alt={t.titulo} sizes={TAMANOS} prioridad={i === 0}/>
        {/* Official image box with no picture (its product no longer exists): only reachable with the keyboard. */}
        {i === 0 && j === 1 && <CajaImagen href={`${SITIO}producto/album-001-de-camisas-full-sublimadas-linea-slim-fit/`} titulo="Camisa Full Sublimadas" nivel={3}/>}
      </Columna>)}
    </Fila>)}
  </main>;
}
