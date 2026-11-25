import type { Metadata } from 'next';
import Titulo from '@/components/espejo/Titulo';
import BandaCTAColumna from '@/components/espejo/contenido/BandaCTAColumna';
import BarraLateral from '@/components/espejo/contenido/BarraLateral';
import ImagenAdaptable from '@/components/espejo/contenido/ImagenAdaptable';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/productos/confeccion-de-uniformes-personalizados/
// (enlaceLocal serves it here): page with the theme sidebar. Main column: 80 px spacer, the $9.00 banner
// (fades in) with its green heading, then the CTA band stretched edge to edge.
export const metadata: Metadata = { title: 'Confección de uniformes personalizados' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

export default function ConfeccionDeUniformesPage() {
  return <main id="contenido">
    {/* The official page title is hidden by the theme. */}
    <h1 className="sr-only">Confección de uniformes personalizados</h1>
    <div className="wb-contenedor wb-contenido-lados">
      <div className="wb-contenido-principal">
        <div className="wb-contenido-aparece">
          <ImagenAdaptable url={`${SUBIDAS}CONFECCION-DE-FUTBOL.jpg`} movil={`${SUBIDAS}CONFECCION-DE-FUTBOL-400x250.jpg`}
            alt="Camisa, calzoneta, número y medias por $9.00, Tony El Salvador" sizes="(max-width: 767px) calc(100vw - 90px), 891px" prioridad/>
          <Titulo nivel={2} alinear="centro" color="lima" mayusculas={false}>CAMISA + CALZONETA + NÚMERO + MEDIAS</Titulo>
        </div>
        <BandaCTAColumna texto="¿Tienes alguna duda?, llámanos o mándanos un correo, con gusto te ayudaremos" boton={{ texto: 'Contáctanos', href: enlaceLocal('/contacto/') }}/>
      </div>
      <BarraLateral/>
    </div>
  </main>;
}
