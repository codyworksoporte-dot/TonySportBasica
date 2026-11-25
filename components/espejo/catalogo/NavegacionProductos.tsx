/*
 * NavegacionProductos: the theme's previous/next product tabs (nav.product-navigation): fixed on the left and
 * right edges of the desktop window, only their arrow showing; hover or keyboard focus slides them in with the
 * thumbnail and the shortened name ("PROMO IMPLEMENTOS..."). "Anterior" is the older product, "siguiente" the
 * newer one, as on the official site. Hidden on phones and tablets, like the official.
 * Props: anterior? / siguiente? ({ nombre, titulo (shortened), ruta, imagen }).
 */
import Link from 'next/link';
import Icon from '@/components/Icon';
import type { ImagenResuelta } from './tipos';

export type ProductoVecino = { nombre: string; titulo: string; ruta: string; imagen: ImagenResuelta | null };

function Pestana({ vecino, lado }: { vecino: ProductoVecino; lado: 'anterior' | 'siguiente' }) {
  const flecha = <span className="wb-ficha-nav-flecha" aria-hidden="true"><Icon name={lado === 'anterior' ? 'left' : 'right'} size={20}/></span>;
  const contenido = <>
    {vecino.imagen
      ? <img src={vecino.imagen.src} width={vecino.imagen.w} height={vecino.imagen.h} alt="" loading="lazy" decoding="async"/>
      : <span className="wb-ficha-nav-vacia" aria-hidden="true"/>}
    <span className="wb-ficha-nav-titulo" aria-hidden="true">{vecino.titulo}</span>
  </>;
  return <Link href={vecino.ruta} prefetch={false} rel={lado === 'anterior' ? 'prev' : 'next'}
    className={`wb-ficha-nav-enlace wb-ficha-nav-enlace--${lado}`}
    aria-label={`${lado === 'anterior' ? 'Producto anterior' : 'Producto siguiente'}: ${vecino.nombre}`}>
    {lado === 'anterior' ? <>{contenido}{flecha}</> : <>{flecha}{contenido}</>}
  </Link>;
}

export default function NavegacionProductos({ anterior, siguiente }: { anterior?: ProductoVecino | null; siguiente?: ProductoVecino | null }) {
  if (!anterior && !siguiente) return null;
  return <nav className="wb-ficha-nav" aria-label="Productos anterior y siguiente">
    {anterior && <Pestana vecino={anterior} lado="anterior"/>}
    {siguiente && <Pestana vecino={siguiente} lado="siguiente"/>}
  </nav>;
}
