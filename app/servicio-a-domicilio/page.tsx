import type { Metadata } from 'next';
import { TonyBadge } from '@/components/TonyArt';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import ImagenOficial from '@/components/espejo/ImagenOficial';
import Titulo from '@/components/espejo/Titulo';
import TituloPagina from '@/components/espejo/TituloPagina';
import EnlacesRedes, { type LineaRed } from '@/components/espejo/tiendas-contacto/EnlacesRedes';
import VideoOficial from '@/components/espejo/tiendas-contacto/VideoOficial';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/tiendas-contacto/tiendas-contacto.css';

export const metadata: Metadata = { title: 'Servicio a domicilio' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

// Official lines: the network names are the (bold, green) links; "E-mail" links to ventas@ and the address to info@.
const REDES: LineaRed[] = [
  { icono: 'facebook', partes: [{ texto: 'Facebook', href: 'https://www.facebook.com/Tony-sportwear-631037254185787', lima: true, negrita: true, nueva: true }] },
  { icono: 'instagram', partes: [{ texto: 'Instagram', href: 'https://www.instagram.com/tonysportwear/', lima: true, negrita: true, nueva: true }] },
  { icono: 'whatsapp', partes: [{ texto: 'Cel/WhatsApp', href: 'https://wa.me/50370155571', lima: true, negrita: true, nueva: true }] },
  { icono: 'correo', partes: [
    { texto: 'E-mail', href: 'mailto:ventas@tonysportselsalvador.com', lima: true, negrita: true, nueva: true },
    { texto: ':', negrita: true, pegado: true },
    { texto: 'info@tonysportselsalvador.com', href: 'mailto:info@tonysportselsalvador.com', lima: true },
  ] },
];

// Mirror of https://www.tonysportselsalvador.com/servicio-a-domicilio/.
export default function ServicioADomicilioPage() {
  return <main id="contenido">
    <TituloPagina titulo="Servicio a Domicilio" imagen={`${SUBIDAS}dlei-1.jpg`}/>
    <div className="wb-tiendas-contacto-servicio">
      <Fila as="div" sinPadding pegadas className="wb-tiendas-contacto-servicio-fila">
        <Columna ancho={{ sm: 6 }}>
          <ImagenOficial url={`${SUBIDAS}adads.jpg`} alt="Entrega a domicilio de un pedido Tony Sportswear" className="wb-tiendas-contacto-servicio-foto"/>
          <Titulo nivel={2} color="lima" tamano={31} className="wb-tiendas-contacto-servicio-lema">¡Si no lo tenemos, te lo hacemos!</Titulo>
        </Columna>
        <Columna ancho={{ sm: 6 }}>
          <Titulo nivel={2} color="lima" tamano={36} alinear="centro" mayusculas={false} className="wb-tiendas-contacto-titulo-movil">SERVICIO A DOMICILIO A TODO EL SALVADOR</Titulo>
          <span className="wb-tiendas-contacto-divisor wb-tiendas-contacto-divisor--fino" aria-hidden="true"/>
          <div className="wb-tiendas-contacto-texto wb-justificado">
            <p><strong>Para realizar tu pedido solo tienes que:</strong></p>
            <p>1.- Ver nuestro video del servicio a domicilio en esta web</p>
            <p>2.- Agregarnos a nuestro WhatsApp <em><a className="wb-tiendas-contacto-enlace" href="https://wa.me/50370155571">7015-5571</a></em></p>
            <p>3.- Contactarnos y explicarnos que diseño te interesa más</p>
            <p>4.- Uno de nuestros asesores de ventas te atenderá en el momento</p>
            <p>5.- Estamos para servirte</p>
          </div>
          <EnlacesRedes lineas={REDES}/>
        </Columna>
      </Fila>
      <Fila as="div" sinPadding>
        <Columna>
          <Titulo nivel={2} color="lima" tamano={40} alinear="centro" mayusculas={false} className="wb-tiendas-contacto-titulo-movil">Dale play, te explicamos en 5 pasos nuestro servicio full a domicilio</Titulo>
          <span className="wb-tiendas-contacto-divisor wb-tiendas-contacto-divisor--fino" aria-hidden="true"/>
          <div className="wb-tiendas-contacto-servicio-video">
            <VideoOficial url={`${SUBIDAS}WhatsApp-Video-2020-09-06-at-11.17.11.mp4`} ancho={600} alto={330}
              contexto="del servicio a domicilio en 5 pasos" dibujo={<TonyBadge sizes="(max-width: 767px) 160px, 300px"/>} anchoDibujo={50}/>
          </div>
        </Columna>
      </Fila>
    </div>
    <BandaCTA texto="Ponte en contacto con nosotros si requieres más información"
      boton={{ texto: 'Contáctanos', href: enlaceLocal('https://www.tonysportselsalvador.com/contacto/') }}/>
  </main>;
}
