import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import ImagenEnlazada from '@/components/espejo/contenido/ImagenEnlazada';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/uniformes-bkb/: one row of three green headings with their
// linked picture.
export const metadata: Metadata = { title: 'Uniformes BKB' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const PRODUCTO = 'https://www.tonysportselsalvador.com/producto/';
const TAMANOS = '(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) 30vw, 380px';

const UNIFORMES = [
  { titulo: 'Uniforme BKB full sublimado', archivo: 'WhatsApp-Image-2024-11-05-at-3.32.42-PM', href: `${PRODUCTO}click-aca-para-ver-los-disenos-de-este-album-001-uniformes-bkb-linea-modern-carving-3/` },
  { titulo: 'Centro full sublimado con calzoneta de tela', archivo: 'WhatsApp-Image-2024-11-05-at-3.32.42-PM-1', href: `${PRODUCTO}uniforme-basketball-linea-modern-carving/` },
  { titulo: 'BKB sublimado frontal y calzoneta de tela', archivo: 'WhatsApp-Image-2024-11-05-at-3.32.42-PM-2', href: `${PRODUCTO}click-aca-para-ver-los-disenos-de-este-album-001-uniformes-bkb-linea-modern-carving/` },
];

export default function UniformesBkbPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    {/* The official page title (h1 "Uniformes BKB") is hidden by the theme. */}
    <h1 className="sr-only">Uniformes BKB</h1>
    <Fila sinPadding className="wb-contenido-fila">
      {UNIFORMES.map((u) => <Columna key={u.href} ancho={{ sm: 4 }}>
        <Titulo nivel={2} alinear="centro" color="lima" className="wb-contenido-dos-lineas">{u.titulo}</Titulo>
        {/* The official phone layout loads the -400x400 copy. */}
        <ImagenEnlazada href={u.href} url={`${SUBIDAS}${u.archivo}.jpeg`} movil={`${SUBIDAS}${u.archivo}-400x400.jpeg`} alt={u.titulo} sizes={TAMANOS} prioridad/>
      </Columna>)}
    </Fila>
  </main>;
}
