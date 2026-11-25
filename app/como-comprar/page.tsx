import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import TituloPagina from '@/components/espejo/TituloPagina';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/tiendas-contacto/tiendas-contacto.css';

export const metadata: Metadata = { title: 'Cómo comprar' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

// Mirror of https://www.tonysportselsalvador.com/como-comprar/: title band, steps (dark half) next to the photo
// (shown on phones and from 1200 px, hidden in between like the official vc_hidden-sm/md), lime band.
export default function ComoComprarPage() {
  return <main id="contenido">
    <TituloPagina titulo="Cómo comprar" imagen={`${SUBIDAS}como-comprar.jpeg`}/>
    <Fila as="div" anchoCompleto sinPadding pegadas>
      <Columna ancho={{ xs: 12, sm: 12, md: 12, lg: 6 }} fondo="tile" className="wb-tiendas-contacto-pasos">
        {/* The official repeats an h1 here; the page keeps a single h1 (the title band). */}
        <Titulo nivel={2} tamano={42} mayusculas={false} separador="corto">Sigue estos sencillos pasos</Titulo>
        <div className="wb-tiendas-contacto-texto">
          <ol className="wb-tiendas-contacto-pasos-lista">
            <li>Dirígete al apartado para ver los productos.</li>
            <li>Entra a los productos que quieras ver.</li>
            <li>Cuando te decidas por uno (o varios) aprieta el botón <strong>Añadir al carrito</strong>.</li>
            <li>Visualiza tu carrito de compras y verifica que está correcto.</li>
            <li>Finaliza la orden, llena los datos para el envío, selecciona tu método de pago y de envío.</li>
            <li>¡Listo! Ahora solo queda realizar tu pago para que enviemos tu pedido a la brevedad.</li>
          </ol>
          <p className="wb-tiendas-contacto-pasos-nota wb-justificado">¿Te quedó alguna duda?,{' '}contáctanos para que uno de nuestros especialistas te ayude a la brevedad.</p>
        </div>
      </Columna>
      <Columna ancho={{ xs: 12, sm: 6 }} ocultarEn={['sm', 'md']} imagen={`${SUBIDAS}comprar-ahora.jpg`} className="wb-tiendas-contacto-pasos-foto"/>
    </Fila>
    <BandaCTA texto="Conoce todos los productos que tenemos en venta"
      boton={{ texto: 'Productos', href: enlaceLocal('https://www.tonysportselsalvador.com/productos/') }}/>
  </main>;
}
