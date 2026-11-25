import type { Metadata } from 'next';
import { BandaCTA, Columna, Fila, TituloPagina } from '@/components/espejo';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/promos/promos.css';

export const metadata: Metadata = { title: 'Eventos' };

// tonysportselsalvador.com/eventos/ answers with an Apache «Index of /eventos» (a server folder shadows the
// page), so this rebuilds its WordPress content (paginas-wp.json, slug "eventos") with the layout of its
// sibling /paquetes/: title band, 70 px spacer row, the calendar row (its [ecwd] Event Calendar WD plugin is
// gone, so WordPress prints the shortcode as text, like [flat-price] on /paquetes/) and the green band.
// The band photo (attachment 25128) was never mirrored: TituloPagina falls back to our scale texture.

export default function EventosPage() {
  return <main id="contenido" className="wb-promos wb-promos--banda">
    <TituloPagina titulo="Eventos"/>

    <Fila sinPadding className="wb-promos-fila wb-promos-codigo-fila--eventos">
      <Columna ancho={{ sm: 12 }}>
        <p className="wb-promos-codigo">[ecwd id=”25126″]</p>
      </Columna>
    </Fila>

    <BandaCTA id="aggg" texto="Siempre estamos disponibles para resolver tus dudas"
      boton={{ texto: 'Contáctanos', href: enlaceLocal('/contacto/') }} fondo="lima" variante="contorno"/>
  </main>;
}
