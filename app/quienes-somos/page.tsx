import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Separador from '@/components/espejo/Separador';
import Titulo from '@/components/espejo/Titulo';
import TituloPagina from '@/components/espejo/TituloPagina';
import ImagenAdaptable from '@/components/espejo/calidad-nosotros/ImagenAdaptable';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// Mirror of https://www.tonysportselsalvador.com/quienes-somos/ (title band, about us, mission and vision, CTA).
export const metadata: Metadata = { title: 'Quiénes somos' };

const U = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

export default function QuienesSomosPage() {
  return <main id="contenido">
    <TituloPagina titulo="Quiénes somos" imagen={`${U}2017/11/fondo-quienes-somos.jpeg`}/>

    <Fila fondo="oscuro" className="wb-calidad-nosotros-sobre">
      <Columna ancho={{ sm: 6 }} alinear="centro" className="wb-calidad-nosotros-equipo">
        <ImagenAdaptable urls={[`${U}2017/01/equipo-de-trabajo-400x275.png`, `${U}2017/01/equipo-de-trabajo.png`]}
          alt="Equipo de trabajo revisando un proyecto en la computadora" className="wb-calidad-nosotros-img" sizes="(max-width: 767px) calc(100vw - 90px), 585px"/>
      </Columna>
      <Columna ancho={{ sm: 6 }}>
        <Titulo nivel={2} color="lima" mayusculas={false} className="wb-calidad-nosotros-titulo-grande">Sobre nosotros</Titulo>
        <Separador tipo="corto" color="lima" className="wb-calidad-nosotros-divisor-ancho"/>
        <div className="wb-contenido wb-justificado">
          <p>Somos una empresa 100% mexicana dedicada a ESPECIALIDAD, tenemos más de X años de experiencia al servicio de nuestros clientes, posicionándonos como empresa líder en el mercado gracias a la preferencia de nuestros clientes.</p>
          <p>Todos nuestros SERVICIOS/PRODUCTOS están garantizados, recibirás la mejor atención y te ayudaremos a encontrar la solución más adecuada para tus necesidades.</p>
          <p>¿Tienes alguna duda o requieres más información?, ponte en contacto con nosotros, con gusto te asesoraremos y resolveremos tus dudas.</p>
        </div>
      </Columna>
    </Fila>

    <Fila fondo="oscuro" anchoCompleto sinPadding pegadas>
      <Columna ancho={{ xs: 12, sm: 12, md: 12, lg: 6 }} fondo="tile" alinear="centro" className="wb-calidad-nosotros-mision">
        <Titulo nivel={2} alinear="centro" mayusculas={false} className="wb-calidad-nosotros-titulo-grande">Misión</Titulo>
        <Separador tipo="corto" alinear="centro"/>
        <div className="wb-contenido wb-justificado">
          <p>Estamos seguros que como empresa lograremos establecer relaciones fuertes y duraderas con nuestros clientes. Somos profesionales en lo que hacemos y tenemos amplia experiencia ofreciendo SERVICIOS/PRODUCTOS de la más alta calidad.</p>
        </div>
        <span className="wb-espacio" style={{ '--alto': '20px' } as CSSProperties}/>
        <Titulo nivel={2} alinear="centro" mayusculas={false} className="wb-calidad-nosotros-titulo-grande">Visión</Titulo>
        <Separador tipo="corto" alinear="centro"/>
        <div className="wb-contenido wb-justificado">
          <p>Brindar a nuestros clientes la atención y respaldo que corresponde, es lo que nos permite poder seguir creciendo día a día.</p>
        </div>
      </Columna>
      <Columna ancho={{ xs: 12, sm: 6 }} ocultarEn={['sm', 'md']} imagen={`${U}2017/01/negocios.jpg`} className="wb-calidad-nosotros-negocios"/>
    </Fila>

    <BandaCTA texto="Siempre estamos disponibles para resolver tus dudas" boton={{ texto: 'Contáctanos', href: '/contacto/' }}/>
  </main>;
}
