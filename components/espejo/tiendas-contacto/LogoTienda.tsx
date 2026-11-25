/*
 * LogoTienda: replaces the official store pictures (the old TONY logo on coloured leather) with our 2026
 * logo (TonyBadge, /assets/brand/tony-logo.webp) on our scales, in a box with the official image's proportions.
 * Props: ancho, alto (natural size of the official image, for the proportion); className?.
 * Decorative like the official image (alt=""): the store name is the heading next to it.
 */
import type { CSSProperties } from 'react';
import { TonyBadge } from '@/components/TonyArt';
import { siteAsset } from '@/lib/asset-path';
import './tiendas-contacto.css';

// The badge's own proportion (1200 x 1079): its width for a drawing ~78% of the box height.
const PROPORCION_LOGO = 1200 / 1079;

export default function LogoTienda({ ancho, alto, className = '' }: { ancho: number; alto: number; className?: string }) {
  const anchoLogo = Math.min(78, 78 * (alto / ancho) * PROPORCION_LOGO);
  const estilo = {
    aspectRatio: `${ancho} / ${alto}`,
    backgroundImage: `url("${siteAsset('/assets/escamas-tony-base.webp')}")`,
    '--wb-tiendas-contacto-logo-ancho': `${anchoLogo.toFixed(2)}%`,
  } as CSSProperties;
  return <div className={`wb-tiendas-contacto-logo ${className}`.trim()} style={estilo}>
    <TonyBadge className="wb-tiendas-contacto-logo-dibujo" sizes="(max-width: 767px) 200px, 340px" imgProps={{ loading: 'lazy' }}/>
  </div>;
}
