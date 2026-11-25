import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import TituloPagina from '@/components/espejo/TituloPagina';
import Galeria from '@/components/espejo/calidad-nosotros/Galeria';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// The official /galeria/ answers with an Apache "Index of" listing (a folder of the same name hides the page),
// so this route rebuilds its WordPress content (referencia-oficial/paginas-wp.json, slug "galeria") with the
// layout of its sibling pages: title band, Robo Gallery with lightbox, CTA band.
export const metadata: Metadata = { title: 'Galería' };

const U = 'https://www.tonysportselsalvador.com/wp-content/uploads/2017/07/';
const IMAGENES = [1, 2, 3].map(n => ({ url: `${U}imagen-demo-${n}.jpg`, alt: `imagen-demo-${n}` }));

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
