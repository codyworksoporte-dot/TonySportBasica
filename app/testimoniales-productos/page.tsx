import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Testimonios from '@/components/espejo/calidad-nosotros/Testimonios';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// Mirror of https://www.tonysportselsalvador.com/testimoniales-productos/: one photo band with the testimonial
// carousel and the empty space the official leaves before the footer. The official shows no title (sr-only h1).
export const metadata: Metadata = { title: 'Testimoniales (productos)' };

const U = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

export default function TestimonialesProductosPage() {
  return <main id="contenido">
    <h1 className="tc-sr">Testimoniales (productos)</h1>
    <Fila imagen={`${U}2017/11/fondo-catalogo.jpg`} trama velo={0.45} className="wb-calidad-nosotros-testimonios-fila">
      <Columna>
        <Testimonios testimonios={[
          { texto: 'Gente muy profesional que desde el inicio se tomaron el tiempo de resolver todas mis dudas, son muy cumplidos y realmente estoy satisfecha.', nombre: 'Yolanda Cisneros', lugar: 'Guadalajara, JAL.', foto: `${U}2017/10/testimonial-1.jpg` },
          { texto: 'Fueron muy rápidos en el envío y lo mejor, excelente calidad en sus productos, nuestra experiencia con ellos fue positiva, los recomendaría sin duda alguna.', nombre: 'Carlos Martínez', lugar: 'Guadalajara, JAL.', foto: `${U}2017/10/testimonial-2.jpg` },
          { texto: 'Cumplieron mis expectativas totalmente, estoy contento con mi compra y el servicio que me brindaron, son muy serios y siempre responden las llamadas a la brevedad.', nombre: 'Jorge Carmona', lugar: 'Guadalajara, JAL.', foto: `${U}2017/10/testimonial-3.jpg` },
        ]}/>
      </Columna>
    </Fila>
    <div className="wb-calidad-nosotros-hueco" aria-hidden="true"/>
  </main>;
}
