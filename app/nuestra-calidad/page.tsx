import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import CajaImagen from '@/components/espejo/calidad-nosotros/CajaImagen';
import ImagenAdaptable from '@/components/espejo/calidad-nosotros/ImagenAdaptable';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// Mirror of https://www.tonysportselsalvador.com/nuestra-calidad/ (same blocks, order, images and links).
export const metadata: Metadata = { title: 'NUESTRA CALIDAD' };

const U = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const P = 'https://www.tonysportselsalvador.com/producto/';
const CUADRADA = '(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) 45vw, 585px';

type Linea = { href: string; alt: string; urls: string[]; recorte?: boolean };
// Fabric lines: two columns, in the official order (left column first, then right).
const IZQUIERDA: Linea[] = [
  { href: `${P}slim-fit/`, alt: 'Línea Slim-Fit', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-1-400x400.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-1.jpeg`] },
  { href: `${P}linea-modern-carving/`, alt: 'Línea Modern Carving', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-400x400.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM.jpeg`] },
  { href: `${P}linea-dry-fit/`, alt: 'Línea Dry-Fit', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.58.12-PM-600x380.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.58.12-PM.jpeg`], recorte: true },
];
const DERECHA: Linea[] = [
  { href: `${P}slim-pro/`, alt: 'Línea Slim-Pro', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-3-400x400.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-3.jpeg`] },
  { href: `${P}linea-premier/`, alt: 'Línea Premier', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-2-400x400.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-2.jpeg`] },
  { href: `${P}dry-cool/`, alt: 'Línea Dry-Cool', urls: [`${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-4-400x400.jpeg`, `${U}WhatsApp-Image-2024-09-25-at-4.43.31-PM-4.jpeg`] },
];

/** Official green title band (55 px, full width). */
function Banda({ children }: { children: ReactNode }) {
  return <Fila fondo="lima" sinPadding className="wb-calidad-nosotros-banda">
    <Columna><Titulo nivel={2} alinear="centro" className="wb-calidad-nosotros-banda-titulo">{children}</Titulo></Columna>
  </Fila>;
}

function Lineas({ lista, prioridad = false }: { lista: Linea[]; prioridad?: boolean }) {
  return <div className="wb-calidad-nosotros-pila">
    {lista.map((linea, i) => <Link key={linea.href} href={enlaceLocal(linea.href)} prefetch={false}
      className={`wb-calidad-nosotros-enlace-img${linea.recorte ? ' wb-calidad-nosotros-recorte' : ''}`}>
      <ImagenAdaptable urls={linea.urls} alt={linea.alt} sizes={CUADRADA} prioridad={prioridad && i === 0}
        {...(linea.recorte ? { ancho: 600, alto: 380 } : {})}/>
    </Link>)}
  </div>;
}

/** One image box in the left half, like the official single vc_col-sm-6 rows. */
function Caja({ href, titulo, urls }: { href: string; titulo: string; urls: string[] }) {
  return <Fila fondo="oscuro" className="wb-calidad-nosotros-bloque">
    <Columna ancho={{ sm: 6 }}><CajaImagen href={enlaceLocal(href)} titulo={titulo} urls={urls}/></Columna>
  </Fila>;
}

export default function NuestraCalidadPage() {
  return <main id="contenido">
    <h1 className="tc-sr">Nuestra Calidad</h1>
    <Banda>Líneas de Tela</Banda>
    <Fila fondo="oscuro" className="wb-calidad-nosotros-bloque">
      <Columna ancho={{ sm: 6 }}><Lineas lista={IZQUIERDA} prioridad/></Columna>
      <Columna ancho={{ sm: 6 }}><Lineas lista={DERECHA}/></Columna>
    </Fila>
    <Banda>nuestra confecion</Banda>
    <Caja href={`${P}costura-reinforced/`} titulo="COSTURA REINFORCED" urls={[`${U}1-12-600x380.jpg`, `${U}1-12.jpg`]}/>
    <Banda>Malla Anti-Traspirante</Banda>
    <Caja href={`${P}malla-anti-transpirante-suplex/`} titulo="MALLA ANTI-TRANSPIRANTE SUPLEX" urls={[`${U}1-11-600x380.jpg`, `${U}1-11.jpg`]}/>
    <Banda>decoración deportiva</Banda>
    <Caja href={`${P}vinyl-textil/`} titulo="Vinyl Textil" urls={[`${U}1-13-600x380.jpg`, `${U}1-13.jpg`]}/>
  </main>;
}
