/*
 * ImagenOficial: <img> for an image of the official site, served from its local mirror (lib/oficial/imagenes):
 * real width/height, loading="lazy" and decoding="async" (prioridad: eager + fetchpriority high).
 * When the URL was not mirrored it renders `respaldo` (a local /assets/... path) or a visible placeholder
 * marked data-falta-imagen, never the official server.
 * Props: url (official URL), alt, className?, prioridad?, sizes?, respaldo? (`/assets/${string}`),
 * ancho?/alto? (placeholder proportions), style?.
 */
import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { siteAsset } from '@/lib/asset-path';
import { imagenOficial } from '@/lib/oficial/imagenes';
import './espejo-componentes.css';

export type ImagenOficialProps = {
  url: string | null | undefined;
  alt: string;
  className?: string;
  prioridad?: boolean;
  sizes?: string;
  respaldo?: `/assets/${string}`;
  ancho?: number;
  alto?: number;
  style?: CSSProperties;
};

export default function ImagenOficial({ url, alt, className = '', prioridad = false, sizes, respaldo, ancho, alto, style }: ImagenOficialProps) {
  const imagen = imagenOficial(url);
  const carga: ImgHTMLAttributes<HTMLImageElement> = { loading: prioridad ? 'eager' : 'lazy', decoding: 'async', fetchPriority: prioridad ? 'high' : undefined };
  if (imagen) return <img src={imagen.src} width={imagen.w} height={imagen.h} alt={alt} sizes={sizes} className={className || undefined} style={style} {...carga}/>;
  if (respaldo) return <img src={siteAsset(respaldo)} width={ancho} height={alto} alt={alt} className={className || undefined} style={style} {...carga}/>;
  return <span className={`wb-img-falta ${className}`.trim()} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}
    data-falta-imagen={url || ''} style={{ ...(ancho && alto ? { aspectRatio: `${ancho} / ${alto}` } : {}), ...style }}/>;
}
