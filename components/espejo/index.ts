/*
 * Mirror components (prefix wb-). Chrome is mounted by app/layout.tsx; pages build with the base components.
 * Server-only helpers (medios-servidor.ts, node:fs) are deliberately not exported here.
 *
 * Components that resolve official images (Fila, Carrusel, ImagenOficial, TituloPagina, TarjetaProducto,
 * GrillaProductos, CirculoIcono, BandaParallax) read lib/oficial/imagenes (a ~1.8 MB map): render them from
 * server components (pages are server components by default). A 'use client' file that imports them, or
 * imports anything from this index, would ship that map to the browser: client files import single modules
 * by path instead (e.g. '@/components/espejo/Boton').
 */

// Chrome
export { default as BarraSuperior } from './BarraSuperior';
export { default as Cabecera } from './Cabecera';
export { default as LogoEspejo } from './LogoEspejo';
export { default as MenuEscritorio, EnlaceMenu } from './MenuEscritorio';
export { default as MenuMovil } from './MenuMovil';
export { default as Pie } from './Pie';
export { default as SelectorCategorias, type OpcionCategoria } from './SelectorCategorias';
export { default as ReproductorAudio } from './ReproductorAudio';
export { default as Flotantes } from './Flotantes';
export { default as WhatsAppFlotante } from './WhatsAppFlotante';
export { default as CarritoFlotante } from './CarritoFlotante';
export { default as Idioma } from './Idioma';
export { default as TituloPagina } from './TituloPagina';
export { ProveedorCarritoEspejo, useCarritoEspejo, type EstadoCarrito } from './CarritoEstado';
export { default as PreferenciaEfectos } from './PreferenciaEfectos';

// Base components
export { default as Fila, type FilaProps, type FondoFila } from './Fila';
export { default as Columna, type ColumnaProps, type Ancho, type Breakpoint, type Desplazamiento } from './Columna';
export { default as Titulo } from './Titulo';
export { default as Separador } from './Separador';
export { default as Boton, esExterno, type BotonProps } from './Boton';
export { default as CirculoIcono } from './CirculoIcono';
export { default as BandaCTA } from './BandaCTA';
export { default as BandaParallax } from './BandaParallax';
export { default as Carrusel, type Diapositiva } from './Carrusel';
export { default as CarruselCliente, type DiapositivaResuelta } from './CarruselCliente';
export { default as ImagenOficial, type ImagenOficialProps } from './ImagenOficial';
export { default as TarjetaProducto, formatearPrecio, type ProductoTarjeta } from './TarjetaProducto';
export { default as GrillaProductos } from './GrillaProductos';
export { default as Paginacion } from './Paginacion';
export { default as Migas, type Miga } from './Migas';
export { default as MapaEmbed } from './MapaEmbed';
export { default as VideoEmbed, urlEmbebida } from './VideoEmbed';
export { default as IconoEspejo, esIconoEspejo, type IconoNombre, type IconoEspejoNombre } from './Iconos';
