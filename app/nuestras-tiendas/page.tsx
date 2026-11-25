import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import TituloPagina from '@/components/espejo/TituloPagina';
import FichaTienda from '@/components/espejo/tiendas-contacto/FichaTienda';
import { TIENDAS } from '@/components/espejo/tiendas-contacto/tiendas';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/tiendas-contacto/tiendas-contacto.css';

// The official description is the site's own ("SI NO LO TENEMOS, TE LO HACEMOS"), inherited from the layout.
export const metadata: Metadata = { title: 'Nuestras tiendas' };

// Mirror of https://www.tonysportselsalvador.com/nuestras-tiendas/: title band, contact band and the 14 stores.
export default function NuestrasTiendasPage() {
  return <main id="contenido">
    <TituloPagina titulo="Nuestras tiendas" imagen="https://www.tonysportselsalvador.com/wp-content/uploads/das.jpg"/>
    <BandaCTA className="wb-tiendas-contacto-banda" texto="Ponte en contacto con nosotros si requieres más información"
      boton={{ texto: 'Contáctanos', href: enlaceLocal('https://www.tonysportselsalvador.com/contacto/') }}/>
    <div className="wb-tiendas-contacto-lista">
      {TIENDAS.map(tienda => <FichaTienda key={tienda.id} tienda={tienda}/>)}
    </div>
  </main>;
}
