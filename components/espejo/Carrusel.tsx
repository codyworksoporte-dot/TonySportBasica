/*
 * Carrusel: replaces the official Slider Revolution. Full-width slides (image + optional link) that fade,
 * autoplay, arrows, dots, swipe on touch, arrow keys; pauses on hover, on focus, while the tab is hidden and
 * with its pause button; no autoplay or fades with prefers-reduced-motion or html[data-tony-effects=off].
 * Server component: it resolves the official images here and hands plain data to CarruselCliente, so the
 * image map stays out of the browser (use it from server components / pages).
 * Props: slides ({ imagen: official URL, alt, href? }[]); alto? ({ xs?, sm?, md?, lg? }: number = px or any
 * CSS length; defaults follow the official home: 39.74vw on phones, 44.24vw from 768 px); intervalo? (ms,
 * default 7000); etiqueta? (accessible name, default 'Diapositivas'); prioridad? (first image eager +
 * fetchpriority high, default true); ajuste? 'cubrir' | 'contener' (default 'cubrir'); className?; id?.
 */
import { imagenOficial } from '@/lib/oficial/imagenes';
import { esExterno } from './Boton';
import CarruselCliente, { type DiapositivaResuelta } from './CarruselCliente';

export type Diapositiva = { imagen: string; alt: string; href?: string };
type Alto = number | string;
type Props = {
  slides: Diapositiva[];
  alto?: { xs?: Alto; sm?: Alto; md?: Alto; lg?: Alto };
  intervalo?: number;
  etiqueta?: string;
  prioridad?: boolean;
  ajuste?: 'cubrir' | 'contener';
  className?: string;
  id?: string;
};

const medida = (valor: Alto) => (typeof valor === 'number' ? `${valor}px` : valor);

export default function Carrusel({ slides, alto = {}, intervalo = 7000, etiqueta = 'Diapositivas', prioridad = true, ajuste = 'cubrir', className, id }: Props) {
  const resueltas: DiapositivaResuelta[] = slides.map(slide => {
    const imagen = imagenOficial(slide.imagen);
    return { src: imagen?.src ?? null, w: imagen?.w, h: imagen?.h, alt: slide.alt, href: slide.href, externo: slide.href ? esExterno(slide.href) : undefined, original: slide.imagen };
  });
  const sm = alto.sm ?? alto.md ?? alto.lg ?? '44.24vw', md = alto.md ?? alto.lg ?? sm, lg = alto.lg ?? md;
  const alturas = { xs: medida(alto.xs ?? '39.74vw'), sm: medida(sm), md: medida(md), lg: medida(lg) };
  return <CarruselCliente slides={resueltas} alturas={alturas} intervalo={intervalo} etiqueta={etiqueta} prioridad={prioridad} ajuste={ajuste} className={className} id={id}/>;
}
