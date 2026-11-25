import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import TituloPagina from '@/components/espejo/TituloPagina';
import '@/components/espejo/tienda/tienda.css';

// Official «Catálogo»: photo band with the title, a 70 px spacer, the catalogue viewer and the green
// «¿Tienes alguna duda?» band. The official viewer is an <object> pointing at Google's document viewer
// with the placeholder «url=URL», so it only ever shows «No hay una vista previa disponible.»: the mirror
// keeps that same empty viewer, drawn locally (no request to Google), square and fitted to the screen.
export const metadata: Metadata = { title: 'Catálogo' };

export default function Catalogo() {
  return <main id="contenido">
    <TituloPagina titulo="Catálogo" imagen="https://www.tonysportselsalvador.com/wp-content/uploads/2017/11/fondo-catalogo.jpg"/>
    <div className="wb-catalogo-espacio" aria-hidden="true"/>
    <Fila className="wb-catalogo-fila">
      <Columna>
        <figure className="wb-catalogo-visor" aria-label="Visor del catálogo">
          <p>No hay una vista previa disponible.</p>
        </figure>
      </Columna>
    </Fila>
    <BandaCTA texto="¿Tienes alguna duda?, llámanos o mándanos un correo, con gusto te ayudaremos" boton={{ texto: 'Contáctanos', href: '/contacto/' }}/>
  </main>;
}
