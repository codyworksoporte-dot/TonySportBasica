/*
 * ImagenEnlazada: WPBakery single image with a link (official vc_single_image-wrapper): the picture fills
 * its column and opens the official destination, localised with enlaceLocal (next/link inside the mirror).
 * Props: href (official URL); url (official image URL); movil? (official phone variant for srcset); alt
 * (also the link's name: the official alt is empty); sizes?; prioridad? (above the fold); className?.
 */
import Link from 'next/link';
import { enlaceLocal, esExterno } from '@/lib/oficial/enlaces';
import ImagenAdaptable from './ImagenAdaptable';
import './contenido.css';

type Props = { href: string; url: string; movil?: string; alt: string; sizes?: string; prioridad?: boolean; className?: string };

export default function ImagenEnlazada({ href, url, movil, alt, sizes, prioridad = false, className = '' }: Props) {
  const destino = enlaceLocal(href);
  const imagen = <ImagenAdaptable url={url} movil={movil} alt={alt} sizes={sizes} prioridad={prioridad}/>;
  const clases = `wb-contenido-imagen ${className}`.trim();
  if (esExterno(destino)) return <a className={clases} href={destino} target="_blank" rel="noopener noreferrer">{imagen}</a>;
  return <Link className={clases} href={destino} prefetch={false}>{imagen}</Link>;
}
