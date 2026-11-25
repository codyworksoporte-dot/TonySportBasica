/*
 * PaginaProductos: the official «Productos» page of the menu (/productos3/), also served at /producto
 * (the protected cart links there). One row with two inner rows of four columns: green title and, when the
 * official has one, the linked square picture; then the green «¿Tienes alguna duda?» band.
 * Official quirks kept: three columns show their title with no picture (empty link on the official) and
 * the eighth column is empty. The official shows no h1 (its title band is hidden): ours is for screen readers.
 */
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import Link from 'next/link';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import ImagenSrcset from './ImagenSrcset';
import './tienda.css';

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

type Linea = { titulo: string; href?: string; imagen?: string[] };

// Official order and texts (CSS puts them in capitals). Images: full file + mirrored -400x400 copy.
const FILAS: Linea[][] = [
  [
    { titulo: 'Confección de Uniformes de futbol' },
    { titulo: 'Confección de Uniformes basketball', href: 'https://www.tonysportselsalvador.com/uniformes-bkb/', imagen: [`${SUBIDAS}WhatsApp-Image-2024-09-29-at-9.57.55-AM-400x400.jpeg`, `${SUBIDAS}WhatsApp-Image-2024-09-29-at-9.57.55-AM.jpeg`] },
    { titulo: 'Replicas bordadas de futbol' },
    { titulo: 'Implementos deportivos variedad', href: 'https://www.tonysportselsalvador.com/categoria/implementos-deportivos/', imagen: [`${SUBIDAS}Implementos-deportivos-Web-400x400.png`, `${SUBIDAS}Implementos-deportivos-Web.png`] },
  ],
  [
    { titulo: 'Línea Racing Car Show', href: 'https://www.tonysportselsalvador.com/producto/camisas-racing/', imagen: [`${SUBIDAS}WhatsApp-Image-2024-09-28-at-11.53.59-PM-400x400.jpeg`, `${SUBIDAS}WhatsApp-Image-2024-09-28-at-11.53.59-PM.jpeg`] },
    { titulo: 'Linea Racing Motorcycle', href: 'https://www.tonysportselsalvador.com/producto/racing-motorcycle/', imagen: [`${SUBIDAS}WhatsApp-Image-2024-09-28-at-11.53.59-PM-1-400x400.jpeg`, `${SUBIDAS}WhatsApp-Image-2024-09-28-at-11.53.59-PM-1.jpeg`] },
    { titulo: 'Línea Empresarial' },
    { titulo: '' },
  ],
];

const TAMANOS = '(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) calc(25vw - 30px), 278px';

export default function PaginaProductos() {
  return <main id="contenido" className="wb-productos3">
    <h1 className="tc-sr">Productos</h1>
    <Fila sinPadding className="wb-productos3-fila">
      <Columna>
        {FILAS.map((fila, i) => <div key={i} className="wb-fila-cols wb-productos3-interior">
          {fila.map((linea, j) => <Columna key={j} ancho={{ sm: 3 }} className="wb-productos3-col">
            {linea.titulo && <Titulo nivel={2} alinear="centro" color="lima" className="wb-productos3-titulo">{linea.titulo}</Titulo>}
            {linea.href && linea.imagen && <Link href={enlaceLocal(linea.href)} prefetch={false} className="wb-productos3-enlace">
              <ImagenSrcset urls={linea.imagen} alt={linea.titulo} sizes={TAMANOS} className="wb-productos3-img"/>
            </Link>}
          </Columna>)}
        </div>)}
      </Columna>
    </Fila>
    <BandaCTA texto="¿Tienes alguna duda?, llámanos o mándanos un correo, con gusto te ayudaremos" boton={{ texto: 'Contáctanos', href: '/contacto/' }}/>
  </main>;
}
