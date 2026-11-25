/*
 * Galeria: server side of the gallery with lightbox. Resolves the official thumbnails and popup images to their
 * mirrored WebP and hands plain data to GaleriaVisor; it never uses the official server. When an official image
 * is not mirrored, `respaldo` (one of our local drawings, with its own alt) takes its place; without it the
 * browser shows the missing-image placeholder.
 * Props: imagenes ({ url: official thumbnail URL, popup?: official full image URL, alt, titulo?,
 * respaldo?: { src: '/assets/…', w, h, alt, abajo? (drawing cut flat at its base: it rests on the tile's bottom
 * edge) } }[]), etiqueta (accessible name of the grid), visor? (lightbox name).
 */
import { siteAsset } from '@/lib/asset-path';
import { imagenOficial } from '@/lib/oficial/imagenes';
import GaleriaVisor, { type ImagenGaleria } from './GaleriaVisor';

export type RespaldoGaleria = { src: `/assets/${string}`; w: number; h: number; alt: string; abajo?: boolean };
export type ImagenDeGaleria = { url: string; popup?: string; alt: string; titulo?: string; respaldo?: RespaldoGaleria };
type Props = { imagenes: ImagenDeGaleria[]; etiqueta: string; visor?: string };

const archivo = (url: string) => {
  const imagen = imagenOficial(url);
  return imagen ? { src: imagen.src, w: imagen.w, h: imagen.h } : null;
};

export default function Galeria({ imagenes, etiqueta, visor }: Props) {
  const resueltas: ImagenGaleria[] = imagenes.map(({ url, popup, alt, titulo, respaldo }) => {
    const mini = archivo(url), grande = archivo(popup ?? url);
    if (mini || !respaldo) return { mini, grande: grande ?? mini, alt, titulo: titulo ?? alt, original: url };
    const local = { src: siteAsset(respaldo.src), w: respaldo.w, h: respaldo.h };
    return { mini: local, grande: local, alt: respaldo.alt, titulo: respaldo.alt, original: url, dibujo: respaldo.abajo ? 'abajo' : 'centro' };
  });
  // Our drawings sit on our scales, like the store logos of Nuestras tiendas.
  const fondo = resueltas.some(imagen => imagen.dibujo) ? siteAsset('/assets/escamas-tony-base.webp') : undefined;
  return <GaleriaVisor imagenes={resueltas} etiqueta={etiqueta} visor={visor} fondoDibujo={fondo}/>;
}
