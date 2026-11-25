/*
 * ImagenAdaptable: an official image from the local mirror with the official phone variant in srcset, so a
 * phone downloads the small file (e.g. -400x400) and a desktop the large one. Without a mirrored variant it
 * is a plain ImagenOficial (placeholder if the image is not mirrored; never the official server).
 * Props: url (official URL of the large image); movil? (official URL of the phone variant); alt; sizes?;
 * prioridad?; className?.
 */
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { imagenOficial } from '@/lib/oficial/imagenes';
import './contenido.css';

type Props = { url: string; movil?: string; alt: string; sizes?: string; prioridad?: boolean; className?: string };

export default function ImagenAdaptable({ url, movil, alt, sizes = '100vw', prioridad = false, className = 'wb-contenido-img' }: Props) {
  const grande = imagenOficial(url);
  const chica = movil ? imagenOficial(movil) : null;
  if (!grande || !chica || chica.w >= grande.w) return <ImagenOficial url={url} alt={alt} className={className} prioridad={prioridad}/>;
  return <img src={grande.src} srcSet={`${chica.src} ${chica.w}w, ${grande.src} ${grande.w}w`} sizes={sizes} width={grande.w} height={grande.h} alt={alt}
    className={className || undefined} loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>;
}
