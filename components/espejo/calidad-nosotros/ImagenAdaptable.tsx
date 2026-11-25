/*
 * ImagenAdaptable: one official image offered in the sizes the mirror holds (srcset with width descriptors),
 * e.g. WordPress's 400x400 crop for phones and the full file for wide or high-density screens.
 * Server component (reads lib/oficial/imagenes). Without any mirrored size it falls back to ImagenOficial,
 * which shows its placeholder and never the official server.
 * Props: urls (official URLs of the same picture), alt, sizes, className?, prioridad?, ancho?/alto? (intrinsic
 * size to declare, e.g. the official 600x380 crop when CSS crops the full file with object-fit).
 */
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { imagenOficial, type ImagenOficial as Resuelta } from '@/lib/oficial/imagenes';

type Props = {
  urls: string[];
  alt: string;
  sizes: string;
  className?: string;
  prioridad?: boolean;
  ancho?: number;
  alto?: number;
};

export default function ImagenAdaptable({ urls, alt, sizes, className, prioridad = false, ancho, alto }: Props) {
  const porSrc = new Map<string, Resuelta>();
  for (const url of urls) {
    const imagen = imagenOficial(url);
    if (imagen && !porSrc.has(imagen.src)) porSrc.set(imagen.src, imagen);
  }
  const lista = [...porSrc.values()].sort((a, b) => a.w - b.w);
  if (!lista.length) return <ImagenOficial url={urls[0]} alt={alt} className={className} prioridad={prioridad} ancho={ancho} alto={alto}/>;
  // Plain src for old browsers: the first size that covers a 600 px column, else the largest.
  const base = lista.find(imagen => imagen.w >= 600) ?? lista[lista.length - 1];
  const mayor = lista[lista.length - 1];
  return <img src={base.src} srcSet={lista.length > 1 ? lista.map(imagen => `${imagen.src} ${imagen.w}w`).join(', ') : undefined}
    sizes={lista.length > 1 ? sizes : undefined} width={ancho ?? mayor.w} height={alto ?? mayor.h} alt={alt} className={className}
    loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>;
}
