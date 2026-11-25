/*
 * Galeria: server side of the gallery with lightbox. Resolves the official thumbnails and popup images to their
 * mirrored WebP (or null, so the browser shows the placeholder and never the official server) and hands plain
 * data to GaleriaVisor.
 * Props: imagenes ({ url: official thumbnail URL, popup?: official full image URL, alt, titulo? }[]),
 * etiqueta (accessible name of the grid), visor? (accessible name of the lightbox).
 */
import { imagenOficial } from '@/lib/oficial/imagenes';
import GaleriaVisor, { type ImagenGaleria } from './GaleriaVisor';

export type ImagenDeGaleria = { url: string; popup?: string; alt: string; titulo?: string };
type Props = { imagenes: ImagenDeGaleria[]; etiqueta: string; visor?: string };

const archivo = (url: string) => {
  const imagen = imagenOficial(url);
  return imagen ? { src: imagen.src, w: imagen.w, h: imagen.h } : null;
};

export default function Galeria({ imagenes, etiqueta, visor }: Props) {
  const resueltas: ImagenGaleria[] = imagenes.map(({ url, popup, alt, titulo }) => ({
    mini: archivo(url), grande: archivo(popup ?? url), alt, titulo: titulo ?? alt, original: url,
  }));
  return <GaleriaVisor imagenes={resueltas} etiqueta={etiqueta} visor={visor}/>;
}
