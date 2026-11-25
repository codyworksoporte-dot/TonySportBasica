/*
 * ImagenPromo: an official image plus its WordPress -400x400 copy as a srcset candidate, so phones load the
 * small file and desktops the full one (the official serves the same pair). Falls back to ImagenOficial when
 * the small copy is missing. Server component (reads the image map).
 * Props: url (official full-size URL), movil? (official -400x400 URL), alt, sizes, className?, prioridad?.
 */
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { imagenOficial } from '@/lib/oficial/imagenes';

type Props = {
  url: string;
  movil?: string;
  alt: string;
  sizes: string;
  className?: string;
  prioridad?: boolean;
};

export default function ImagenPromo({ url, movil, alt, sizes, className, prioridad = false }: Props) {
  const grande = imagenOficial(url);
  const chica = movil ? imagenOficial(movil) : null;
  // imagenOficial() falls back to the original when a WordPress size is missing: only list a smaller file.
  if (!grande || !chica || chica.w >= grande.w) {
    return <ImagenOficial url={url} alt={alt} className={className} prioridad={prioridad}/>;
  }
  return <img src={grande.src} srcSet={`${chica.src} ${chica.w}w, ${grande.src} ${grande.w}w`} sizes={sizes}
    width={grande.w} height={grande.h} alt={alt} className={className}
    loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>;
}
