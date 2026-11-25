import type { Metadata } from 'next';
import { BandaCTA, Columna, Fila, TituloPagina } from '@/components/espejo';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/promos/promos.css';

export const metadata: Metadata = { title: 'Paquetes' };

// Mirror of tonysportselsalvador.com/paquetes/: title band over fondo-catalogo.jpg, a 20 px spacer row, the
// price table row (its [flat-price] plugin is gone, so the official prints the shortcode as text) and the
// green «Estamos a tus órdenes» band.

const FONDO = 'https://www.tonysportselsalvador.com/wp-content/uploads/2017/11/fondo-catalogo.jpg';

export default function PaquetesPage() {
  return <main id="contenido" className="wb-promos wb-promos--banda">
    <TituloPagina titulo="Paquetes" imagen={FONDO}/>

    <Fila sinPadding id="paquetes" className="wb-promos-fila wb-promos-codigo-fila">
      <Columna ancho={{ sm: 12 }}>
        <p className="wb-promos-codigo">[flat-price id=”25283″]</p>
      </Columna>
    </Fila>

    <BandaCTA id="aggg" texto="Estamos a tus órdenes para aclarar tus dudas"
      boton={{ texto: 'Contáctanos', href: enlaceLocal('/contacto/') }} fondo="lima" variante="contorno"/>
  </main>;
}
