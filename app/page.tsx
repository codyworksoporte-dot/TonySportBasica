import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { BandaCTA, BandaParallax, Boton, Carrusel, CirculoIcono, Columna, Fila, Separador, Titulo } from '@/components/espejo';
import CajaIcono from '@/components/espejo/inicio/CajaIcono';
import { DIAPOSITIVAS } from '@/components/espejo/inicio/diapositivas';
import { siteAsset } from '@/lib/asset-path';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/inicio/inicio.css';

// Mirror of the official home (tonysportselsalvador.com, page «Inicio»): its six rows in the official order.
export const metadata: Metadata = {
  title: { absolute: 'TONY SPORTSWEAR EL SALVADOR | SI NO LO TENEMOS, TE LO HACEMOS' },
  description: 'SI NO LO TENEMOS, TE LO HACEMOS',
};

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const CONTACTO = enlaceLocal('https://www.tonysportselsalvador.com/contacto/');

export default function Inicio() {
  return <main id="contenido" className="wb-inicio">
    {/* Slider Revolution «portada»: 19 slides, 4 s each (official duration:4000); from 1200 px it keeps the official 637 px height. */}
    <Carrusel id="deslizador" slides={DIAPOSITIVAS} alto={{ sm: '44.24vw', md: '44.24vw', lg: 637 }} intervalo={4000} etiqueta="Portada" className="wb-inicio-carrusel"/>

    <Fila fondo="oscuro" sinPadding className="wb-inicio-circulos">
      <Columna ancho={{ sm: 4 }}>
        <CirculoIcono icono="escudo-check" titulo="Calidad" texto={<p>Ofrecemos productos y servicios de la más alta calidad. ¡Conócenos!</p>}/>
      </Columna>
      <Columna ancho={{ sm: 4 }}>
        <CirculoIcono icono="auriculares" titulo="Atención personalizada" texto={<p>Te asesoramos personalmente para saber cuál es la mejor opción según tus necesidades.</p>}/>
      </Columna>
      <Columna ancho={{ sm: 4 }}>
        <CirculoIcono icono="medalla" titulo="Experiencia" texto={<p>Tenemos amplia experiencia y trayectoria, somos profesionales en lo que hacemos.</p>}/>
      </Columna>
    </Fila>

    <Fila fondo="negro" sinPadding pegadas id="servicios" className="wb-inicio-bienvenida">
      <Columna ancho={{ sm: 5 }} className="wb-inicio-bienvenida-media">
        {/* Official: the old logo on leather. Ours: the 2026 logo on our scales. */}
        <div className="wb-inicio-logo" style={{ backgroundImage: `url("${siteAsset('/assets/escamas-tony-base.webp')}")` } as CSSProperties}>
          <img src={siteAsset('/assets/brand/tony-logo.webp')}
            srcSet={`${siteAsset('/assets/brand/tony-logo-480.webp')} 480w, ${siteAsset('/assets/brand/tony-logo.webp')} 1200w`}
            sizes="(max-width: 767px) 240px, 380px" width={1200} height={1079} alt="Logo de TONY SPORTSWEAR" loading="lazy" decoding="async"/>
        </div>
      </Columna>
      <Columna ancho={{ sm: 7 }} className="wb-inicio-bienvenida-texto">
        <Titulo nivel={1} alinear="centro" color="lima" mayusculas={false}>BIENVENIDO A TONY SPORTSWEAR EL SALVADOR</Titulo>
        <span className="wb-espacio" style={{ '--alto': '10px' } as CSSProperties} aria-hidden="true"/>
        <Separador tipo="linea"/>
        <p className="wb-inicio-subtitulo">Esperamos que nuestra página web sea de tu agrado</p>
        <Titulo nivel={2} mayusculas={false}>Sobre nosotros</Titulo>
        <p className="wb-inicio-parrafo">Nos dedicamos a la venta y confección de uniformes deportivos, brindando una amplia gama de diseños a tu disposición, con precios accesibles acorde a nuestra calidad, contamos con diferentes tiendas a nivel nacional como también contamos con servicio a domicilio a nivel nacional.</p>
        <Boton href={enlaceLocal('/productos/')} tamano="sm">Ver Productos</Boton>
      </Columna>
    </Fila>

    <BandaParallax imagen={`${SUBIDAS}cotnainio.jpg`} className="wb-inicio-banda"
      titulo="¿Requieres más información? Contáctanos, con gusto te atenderemos" boton={{ texto: 'Contáctanos', href: CONTACTO }}/>

    <Fila fondo="tile" anchoCompleto sinPadding pegadas id="distingue" className="wb-inicio-distingue">
      <Columna ancho={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
        <div className="wb-inicio-distingue-in">
          <Titulo nivel={2} alinear="centro" color="lima" mayusculas={false} className="wb-inicio-h1">LO QUE NOS DISTINGUE</Titulo>
          <Separador/>
          <Titulo nivel={3} alinear="centro" color="lima" className="wb-inicio-h4">NUESTRA CALIDAD</Titulo>
          <CajaIcono icono="tijeras">Contamos con procesos de confección y materia prima de la más alta calidad del mercado acorde al precio que el cliente solicite, nuestra excelente mano de obra con maquinaria y equipo muy eficiente.</CajaIcono>
          <Titulo nivel={3} alinear="centro" color="lima" className="wb-inicio-h4">Atención Personalizada</Titulo>
          <CajaIcono icono="check" className="wb-inicio-caja--check">Ponemos a tu disposición nuestras diferentes tiendas, como también nuestro servicio a domicilio para todo El Salvador ambas opciones con una excelente atención personalizada basada en asesorarte en lo que más necesites cumpliendo tus expectativas y deseos.</CajaIcono>
        </div>
      </Columna>
      {/* The sewing photo: half of the row on large screens, under the text on phones, hidden in between (as official). */}
      <Columna ancho={{ xs: 12, sm: 6 }} ocultarEn={['sm', 'md']} imagen={`${SUBIDAS}distin.jpg`} className="wb-inicio-distingue-foto"/>
    </Fila>

    <BandaCTA id="aggg" texto="Si tienes alguna duda estamos a tus órdenes" boton={{ texto: 'Contáctanos', href: CONTACTO }}/>
  </main>;
}
