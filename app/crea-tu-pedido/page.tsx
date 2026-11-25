import type { Metadata } from 'next';
import Link from 'next/link';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import ImagenSrcset from '@/components/espejo/pedido-app/ImagenSrcset';
import UrlPartida from '@/components/espejo/pedido-app/UrlPartida';
import '@/components/espejo/pedido-app/pedido-app.css';

// Mirror of https://www.tonysportselsalvador.com/crea-tu-pedido/ (one WPBakery row, four text blocks).
export const metadata: Metadata = { title: 'CREÁ TU PEDIDO' };

// The official links open its order mockup; here they open our configurator, keeping their literal text.
const CONFIGURADOR = '/configurador/';
const TEXTO_ENLACE = 'https://tonysportselsalvador.com/mockup-prueba/index.html';
const BANNER = 'https://www.tonysportselsalvador.com/wp-content/uploads/WhatsApp-Image-2026-10-20-at-10.39.52-AM.jpeg';
const BANNER_400 = 'https://www.tonysportselsalvador.com/wp-content/uploads/WhatsApp-Image-2026-10-20-at-10.39.52-AM-400x500.jpeg';

function EnlacePedido() {
  return <Link className="wb-pedido-app-enlace" href={CONFIGURADOR} prefetch={false}><UrlPartida url={TEXTO_ENLACE}/></Link>;
}

export default function CreaTuPedidoPage() {
  return <main id="contenido" className="wb-pedido-app">
    <Fila fondo="oscuro" sinPadding>
      <Columna>
        <div className="wb-pedido-app-bloque wb-pedido-app-texto">
          <h1 className="wb-pedido-app-titulo">¡CREÁ TU PEDIDO A TU MANERA!</h1>
          <p className="wb-pedido-app-14pt"><EnlacePedido/></p>
        </div>
        <div className="wb-pedido-app-bloque wb-pedido-app-texto wb-pedido-app-14pt">
          <span className="wb-pedido-app-linea" aria-hidden="true"/>
          <p>Personalizá tu uniforme con tus logos, patrocinadores, colores, nombres y números. Elegí tus tallas y armalo como vos querás.</p>
          <p>💳 ¡De una vez pagás en línea y creamos tu orden de pedido, sin esperas y sin complicaciones!</p>
          <p>✅ Sin esperar que te contesten. ✅ Sin visitar una tienda.</p>
        </div>
        <div className="wb-pedido-app-bloque">
          <ImagenSrcset url={BANNER} variantes={[BANNER_400]} className="wb-pedido-app-banner" prioridad
            sizes="(max-width: 767px) calc(100vw - 90px), 1122px"
            alt="Creá tu pedido: diseñá, personalizá y elegí tus tallas. Tu diseño, tus logos, tus patrocinadores. Crea tu pedido seleccionando el enlace abajo de esta imagen."/>
        </div>
        <div className="wb-pedido-app-bloque wb-pedido-app-texto">
          <p className="wb-pedido-app-24pt"><EnlacePedido/></p>
        </div>
      </Columna>
    </Fila>
  </main>;
}
