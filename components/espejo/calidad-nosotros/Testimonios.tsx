/*
 * Testimonios: server side of the testimonial carousel. Resolves each official photo to its mirrored WebP
 * and hands plain data to CarruselTestimonios, so the image map never reaches the browser.
 * Props: testimonios ({ texto, nombre, lugar, foto: official URL }[]), intervalo? (ms, default 6000 like the
 * official), etiqueta? (accessible name, default 'Testimoniales').
 */
import { imagenOficial } from '@/lib/oficial/imagenes';
import CarruselTestimonios, { type TestimonioResuelto } from './CarruselTestimonios';

export type Testimonio = { texto: string; nombre: string; lugar: string; foto: string };
type Props = { testimonios: Testimonio[]; intervalo?: number; etiqueta?: string };

export default function Testimonios({ testimonios, intervalo = 6000, etiqueta = 'Testimoniales' }: Props) {
  const resueltos: TestimonioResuelto[] = testimonios.map(({ texto, nombre, lugar, foto }) => {
    const imagen = imagenOficial(foto);
    return { texto, nombre, lugar, foto: imagen ? { src: imagen.src, w: imagen.w, h: imagen.h } : null, original: foto };
  });
  return <CarruselTestimonios testimonios={resueltos} intervalo={intervalo} etiqueta={etiqueta}/>;
}
