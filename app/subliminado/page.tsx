import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import BandaTitulo from '@/components/espejo/contenido/BandaTitulo';
import CajaImagen from '@/components/espejo/contenido/CajaImagen';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/subliminado/: lime title band and two rows of two image boxes.
export const metadata: Metadata = { title: 'subliminado' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const CATEGORIA = 'https://www.tonysportselsalvador.com/categoria/';

const FILAS = [
  [
    { titulo: 'Uniforme full sublimado camisa y calzoneta', imagen: `${SUBIDAS}WhatsApp-Image-2022-04-13-at-9.18.20-AM-1-600x380.jpeg`, href: `${CATEGORIA}camisa-full-sublimada-y-calzoneta-full-sublimada-personalizados/` },
    { titulo: 'Diferentes estilos equipacion para damas', imagen: `${SUBIDAS}3-6-600x380.jpg`, href: `${CATEGORIA}compra-en-linea/uniformes-deportivos-para-dama/` },
  ],
  [
    { titulo: 'Uniforme full sublimado y calzoneta lisa', imagen: `${SUBIDAS}272259982_597472911691802_6852869880968398914_n-600x380.jpg`, href: `${CATEGORIA}uniformes-de-futbol-sublimado-camisa-y-calzoneta-de-tela-personalizados/` },
    { titulo: 'Camisa sublimado frontal y calzoneta lisa', imagen: `${SUBIDAS}267522776_282651407150032_4528644429592734651_n-600x380.jpg`, href: `${CATEGORIA}confeccion-uniforme-sublimado-frontal-calzoneta-de-tela-personalizados/` },
  ],
];

export default function SubliminadoPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    <BandaTitulo nivel={1}>Confección uniformes de futbol</BandaTitulo>
    {FILAS.map((fila, i) => <Fila key={i} sinPadding className="wb-contenido-fila">
      {fila.map((caja) => <Columna key={caja.href} ancho={{ sm: 6 }}>
        <CajaImagen href={caja.href} titulo={caja.titulo} imagen={caja.imagen} nivel={2} prioridad={i === 0}/>
      </Columna>)}
    </Fila>)}
  </main>;
}
