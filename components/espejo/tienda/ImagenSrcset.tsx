/*
 * ImagenSrcset: an official image with every mirrored size of it in srcset (e.g. -400x400 and the full
 * file), so phones and HiDPI screens get a sharp copy and plain screens the light one.
 * Falls back to ImagenOficial (placeholder) when none of the URLs is mirrored.
 * Props: urls (official URLs of the same picture), alt, sizes, className?, prioridad?.
 */
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { imagenOficial, type ImagenOficial as Imagen } from '@/lib/oficial/imagenes';

type Props = { urls: string[]; alt: string; sizes: string; className?: string; prioridad?: boolean };

export default function ImagenSrcset({ urls, alt, sizes, className, prioridad = false }: Props) {
  const vistas = new Map<string, Imagen>();
  for (const url of urls) {
    const imagen = imagenOficial(url);
    if (imagen && !vistas.has(imagen.src)) vistas.set(imagen.src, imagen);
  }
  const lista = [...vistas.values()].sort((a, b) => a.w - b.w);
  if (!lista.length) return <ImagenOficial url={urls[0]} alt={alt} className={className} prioridad={prioridad}/>;
  const mayor = lista[lista.length - 1];
  return <img src={lista[0].src} srcSet={lista.length > 1 ? lista.map((i) => `${i.src} ${i.w}w`).join(', ') : undefined}
    sizes={lista.length > 1 ? sizes : undefined} width={mayor.w} height={mayor.h} alt={alt} className={className}
    loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>;
}
