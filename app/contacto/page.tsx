import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import IconoEspejo from '@/components/espejo/Iconos';
import ImagenOficial from '@/components/espejo/ImagenOficial';
import Titulo from '@/components/espejo/Titulo';
import TituloPagina from '@/components/espejo/TituloPagina';
import FormularioContacto from '@/components/espejo/tiendas-contacto/FormularioContacto';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/tiendas-contacto/tiendas-contacto.css';

export const metadata: Metadata = { title: 'Contacto' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

type Dato = { titulo: string; icono: ReactNode; texto: string; href: string; nueva?: boolean };

// "Datos de Contacto" in the official order; the official colour icons become ours (lime bevelled tiles).
const DATOS: Dato[] = [
  { titulo: 'Cel/WhatsApp', icono: <IconoEspejo nombre="whatsapp-solid"/>, texto: '7015-5571', href: 'https://api.whatsapp.com/send?phone=50370155571', nueva: true },
  { titulo: 'Facebook', icono: <IconoEspejo nombre="facebook"/>, texto: 'Tony Sportswear', href: 'https://www.facebook.com/profile.php?id=100085923971490' },
  { titulo: 'Instagram', icono: <IconoEspejo nombre="instagram"/>, texto: 'Tony Sportswear', href: 'https://www.instagram.com/tonysportwear/' },
  { titulo: 'E-mail', icono: <IconoEspejo nombre="correo"/>, texto: 'info@tonysportselsalvador.com', href: 'mailto:info@tonysportselsalvador.com' },
];

// Mirror of https://www.tonysportselsalvador.com/contacto/: title band, form box + contact data, lime band.
export default function ContactoPage() {
  return <main id="contenido">
    <TituloPagina titulo="Contacto" imagen={`${SUBIDAS}2017/10/banner-contacto-1.jpg`}/>
    <Fila fondo="negro" className="wb-tiendas-contacto-fila-contacto" pegadas>
      <Columna ancho={{ sm: 8 }} fondo="tile" className="wb-tiendas-contacto-caja">
        <Titulo nivel={2} tamano={31} mayusculas={false} separador="corto">Formulario de Contacto</Titulo>
        <ImagenOficial url={`${SUBIDAS}banner-contacto.jpg`} alt="Persona escribiendo un mensaje en su celular" className="wb-tiendas-contacto-caja-foto"/>
        <div className="wb-tiendas-contacto-texto wb-justificado">
          <p>Si tienes alguna duda puedes llamarnos a nuestro teléfono o llenar el siguiente formulario, te daremos una respuesta a la brevedad, gracias.</p>
        </div>
        <FormularioContacto/>
      </Columna>
      <Columna ancho={{ sm: 4 }} className="wb-tiendas-contacto-datos">
        <Titulo nivel={2} tamano={31} mayusculas={false}>Datos de Contacto</Titulo>
        <ul className="wb-tiendas-contacto-datos-lista">
          {DATOS.map(dato => <li key={dato.titulo} className="wb-tiendas-contacto-dato">
            <span className="wb-tiendas-contacto-dato-icono" aria-hidden="true">{dato.icono}</span>
            <div>
              <h3 className="wb-tiendas-contacto-dato-titulo">{dato.titulo}</h3>
              <a className="wb-tiendas-contacto-enlace wb-tiendas-contacto-enlace--lima wb-tiendas-contacto-dato-texto" href={dato.href}
                {...(dato.nueva ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {dato.texto}{dato.nueva && <span className="tc-sr"> (se abre en otra pestaña)</span>}
              </a>
            </div>
          </li>)}
        </ul>
      </Columna>
    </Fila>
    <BandaCTA texto="Explora nuestra página web para conocer todo lo que te ofrecemos"
      boton={{ texto: 'Inicio', href: enlaceLocal('https://www.tonysportselsalvador.com/') }}/>
  </main>;
}
