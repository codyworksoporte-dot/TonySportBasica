import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import TituloPagina from '@/components/espejo/TituloPagina';
import Galeria, { type RespaldoGaleria } from '@/components/espejo/calidad-nosotros/Galeria';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// The official /galeria/ answers with an Apache "Index of" listing (a folder of the same name hides the page),
// so this route rebuilds its WordPress content (referencia-oficial/paginas-wp.json, slug "galeria") with the
// layout of its sibling pages: title band, Robo Gallery with lightbox, CTA band.
export const metadata: Metadata = { title: 'Galería' };

const U = 'https://www.tonysportselsalvador.com/wp-content/uploads/2017/07/';
// The three theme demo photos (imagen-demo-1/2/3.jpg) were never mirrored: our drawings take their place.
const DIBUJOS: RespaldoGaleria[] = [
  { src: '/assets/brand/tony-logo.webp', w: 1200, h: 1079, alt: 'Logo de Tony Sportswear con el cocodrilo Tony' },
  { src: '/assets/brand/tony-head.webp', w: 512, h: 512, alt: 'Cabeza del cocodrilo Tony rugiendo', abajo: true },
  { src: '/assets/brand/tony-peek.webp', w: 900, h: 342, alt: 'El cocodrilo Tony asomándose', abajo: true },
];
const IMAGENES = DIBUJOS.map((respaldo, i) => ({ url: `${U}imagen-demo-${i + 1}.jpg`, alt: `imagen-demo-${i + 1}`, respaldo }));

export default function GaleriaPage() {
  return <main id="contenido">
    {/* The official title photo (attachment 24529) is not in the references: TituloPagina falls back to our texture. */}
    <TituloPagina titulo="Galería"/>
    <Fila fondo="oscuro" className="wb-calidad-nosotros-galeria-fila">
      <Columna>
        <Galeria imagenes={IMAGENES} etiqueta="Galería" visor="Galería: imagen ampliada"/>
      </Columna>
    </Fila>
    <BandaCTA texto="Estamos a tus órdenes para aclarar tus dudas" boton={{ texto: 'Contáctanos', href: '/contacto/' }}/>
  </main>;
}
