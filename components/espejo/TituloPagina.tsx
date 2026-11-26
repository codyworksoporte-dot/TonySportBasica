/*
 * TituloPagina: the title band of the official inner pages (Contacto, Quiénes somos, Política…): a photo
 * under the theme's overlay pattern (patterns/01.png, a flat 40 % black veil), the page name centred in
 * capitals; 274 px tall (240 on phones). The theme's breadcrumb bar is hidden on the official site, so
 * `migas` is optional.
 * Props: titulo, imagen? (official image URL; without a local copy it falls back to our scale texture),
 * migas? (Miga[]), alto? ({ escritorio?: number; movil?: number } px), nivel? (1 | 2, default 1), className?, id?.
 */
import type { CSSProperties } from 'react';
import { siteAsset } from '@/lib/asset-path';
import { srcOficial } from '@/lib/oficial/imagenes';
import Migas, { type Miga } from './Migas';
import './espejo-chrome.css';

/** The official band overlay (upb_bg_overlay_pattern): a 2×2 tile of rgba(0,0,0,.5) shown at 80 % opacity. */
const PATRON = 'https://www.tonysportselsalvador.com/wp-content/plugins/parallax_video_backgrounds_vc/assets/images/patterns/01.png';

type Props = {
  titulo: string;
  imagen?: string | null;
  migas?: Miga[];
  alto?: { escritorio?: number; movil?: number };
  nivel?: 1 | 2;
  className?: string;
  id?: string;
};

export default function TituloPagina({ titulo, imagen, migas, alto, nivel = 1, className = '', id }: Props) {
  const foto = imagen ? srcOficial(imagen) : '';
  const fondo = foto || siteAsset('/assets/escamas-tony-base.webp');
  const patron = foto ? srcOficial(PATRON) : '';
  const estilo = {
    backgroundImage: `url("${fondo}")`,
    ...(alto?.escritorio ? { '--wb-tp-alto': `${alto.escritorio}px` } : {}),
    ...(alto?.movil ? { '--wb-tp-alto-movil': `${alto.movil}px` } : {}),
  } as CSSProperties;
  const Encabezado = nivel === 1 ? 'h1' : 'h2';
  const variante = !foto ? ' wb-titulo-pagina--sin-foto' : patron ? ' wb-titulo-pagina--patron' : '';
  return <section id={id} className={`wb-titulo-pagina${variante} ${className}`.trim()} style={estilo}>
    {patron && <span className="wb-titulo-pagina-patron" aria-hidden="true" style={{ backgroundImage: `url("${patron}")` }}/>}
    <div className="wb-contenedor wb-titulo-pagina-in">
      <Encabezado className="wb-titulo-pagina-h">{titulo}</Encabezado>
      {migas && migas.length > 0 && <Migas items={migas} centrado/>}
    </div>
  </section>;
}
