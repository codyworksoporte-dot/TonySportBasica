/*
 * FichaTienda: one row of the official /nuestras-tiendas/ page (vc_row with two vc_col-sm-6 columns).
 * Left: the store picture (our logo, see LogoTienda) and its video (VideoOficial). Right: heading, divider,
 * text, contact lines and Google map. Columns stack on phones in the same order.
 * Props: tienda (Tienda from ./tiendas).
 */
import type { CSSProperties } from 'react';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import MapaEmbed from '@/components/espejo/MapaEmbed';
import Titulo from '@/components/espejo/Titulo';
import EnlacesRedes from './EnlacesRedes';
import LogoTienda from './LogoTienda';
import type { Tienda } from './tiendas';
import VideoOficial from './VideoOficial';
import './tiendas-contacto.css';

// Official 36 px (h1) and 27 px (h2) headings in our display face (x1.15, like the base scale).
const TAMANOS = { grande: 42, mediano: 31 } as const;

export default function FichaTienda({ tienda: t }: { tienda: Tienda }) {
  const izquierda = t.espacioIzquierda ? ({ paddingBottom: `${t.espacioIzquierda}px` } as CSSProperties) : undefined;
  return <Fila as="div" sinPadding pegadas id={`tienda-${t.id}`}
    className={`wb-tiendas-contacto-tienda${t.separacion === 'amplia' ? ' wb-tiendas-contacto-tienda--amplia' : ''}`}>
    <Columna ancho={{ sm: 6 }} style={izquierda}>
      <LogoTienda ancho={t.imagen.ancho} alto={t.imagen.alto}/>
      {t.video && <VideoOficial className="wb-tiendas-contacto-tienda-video" url={t.video.url} ancho={t.video.ancho} alto={t.video.alto} contexto={`de ${t.titulo}`}/>}
    </Columna>
    <Columna ancho={{ sm: 6 }}>
      <Titulo nivel={2} color="lima" tamano={TAMANOS[t.tamano]} alinear={t.alinear} className={t.margenMovil ? 'wb-tiendas-contacto-titulo-movil' : undefined}>{t.titulo}</Titulo>
      <span className={`wb-tiendas-contacto-divisor wb-tiendas-contacto-divisor--${t.divisor}`} aria-hidden="true"/>
      <div className="wb-tiendas-contacto-texto wb-justificado">
        <p>{t.descripcion}</p>
        <p><em><strong>{t.invitacion}</strong></em></p>
      </div>
      <EnlacesRedes lineas={t.redes}/>
      {t.mapa && <MapaEmbed className="wb-tiendas-contacto-mapa" src={t.mapa.src} titulo={`Mapa de ${t.titulo}`}
        alto={`var(--wb-tiendas-contacto-mapa-alto, ${t.mapa.alto}px)`}/>}
    </Columna>
  </Fila>;
}
