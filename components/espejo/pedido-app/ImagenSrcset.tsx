/*
 * ImagenSrcset: an official content image with the responsive srcset of its WordPress <img>, built from the
 * mirrored sizes, so phones load the small copy and wide or dense screens the large one.
 * Server component (reads lib/oficial/imagenes). When the main URL is not mirrored it falls back to
 * ImagenOficial, which shows its placeholder and never the official server.
 * Props: url (official full-size URL); variantes? (official sized URLs, e.g. '...-400x400.jpg'); alt; sizes;
 * className?; prioridad? (eager + fetchpriority high, for an image above the fold).
 */
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { imagenOficial } from '@/lib/oficial/imagenes';

type Props = {
  url: string;
  variantes?: readonly string[];
  alt: string;
  sizes: string;
  className?: string;
  prioridad?: boolean;
};

export default function ImagenSrcset({ url, variantes = [], alt, sizes, className, prioridad = false }: Props) {
  const principal = imagenOficial(url);
  if (!principal) return <ImagenOficial url={url} alt={alt} className={className} prioridad={prioridad}/>;
  // One candidate per real width: a size that was not mirrored resolves to the original and is merged.
  const porAncho = new Map<number, string>();
  for (const variante of [...variantes, url]) {
    const imagen = imagenOficial(variante);
    if (imagen) porAncho.set(imagen.w, imagen.src);
  }
  const srcSet = [...porAncho].sort(([a], [b]) => a - b).map(([ancho, src]) => `${src} ${ancho}w`).join(', ');
  return <img src={principal.src} srcSet={srcSet} sizes={sizes} width={principal.w} height={principal.h} alt={alt} className={className}
    loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>;
}
