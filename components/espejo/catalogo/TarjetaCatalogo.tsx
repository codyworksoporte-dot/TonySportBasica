/*
 * TarjetaCatalogo: one product of the WooCommerce loop (li.product) with the base card look (.wb-producto):
 * square image with the "¡Oferta!" flash, name and price inside the product link, then the button. Purchasable
 * products get "Pedir por WhatsApp" where the official prints "Añadir al carrito"; the others keep
 * "Más información" to the product page. Client-safe (resolved values only): used by the archive (client) and
 * by the related products of the product page (server).
 * Props: item (TarjetaDatos); nivel? (heading of the name, default 2); prioridad? (eager image).
 */
import Link from 'next/link';
import Boton from '@/components/espejo/Boton';
import { siteAsset } from '@/lib/asset-path';
import BotonWhatsApp from './BotonWhatsApp';
import PrecioOferta from './PrecioOferta';
import type { TarjetaDatos } from './tipos';
import '@/components/espejo/espejo-componentes.css';

type Props = { item: TarjetaDatos; nivel?: 2 | 3; prioridad?: boolean };

export function SinFoto({ className = '' }: { className?: string }) {
  // WooCommerce placeholder -> our 2026 logo on a dark tile.
  return <span className={`wb-catalogo-sin-foto ${className}`.trim()} aria-hidden="true">
    <img src={siteAsset('/assets/brand/tony-logo-480.webp')} width={480} height={432} alt="" loading="lazy" decoding="async"/>
  </span>;
}

export default function TarjetaCatalogo({ item, nivel = 2, prioridad = false }: Props) {
  const Encabezado = `h${nivel}` as 'h2';
  return <div className="wb-producto wb-catalogo-tarjeta">
    <Link className="wb-producto-enlace" href={item.ruta} prefetch={false}>
      <span className="wb-producto-media">
        {item.oferta && <span className="wb-producto-etiqueta wb-catalogo-oferta">¡Oferta!</span>}
        {item.imagen
          ? <img className="wb-producto-img" src={item.imagen.src} width={item.imagen.w} height={item.imagen.h} alt=""
            loading={prioridad ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridad ? 'high' : undefined}/>
          : <SinFoto/>}
      </span>
      <Encabezado className="wb-producto-nombre">{item.nombre}</Encabezado>
      {item.precio && <span className="wb-producto-precio">
        {item.anterior ? <PrecioOferta anterior={item.anterior} actual={item.precio}/> : item.precio}
      </span>}
    </Link>
    {item.whatsapp
      ? <BotonWhatsApp nombre={item.nombre} precio={item.precio} ruta={item.ruta} respaldo={item.permalink} etiquetaCompleta className="wb-producto-boton"/>
      : <Boton href={item.ruta} tamano="sm" flecha={false} className="wb-producto-boton" ariaLabel={`Lee más sobre “${item.nombre}”`}>Más información</Boton>}
  </div>;
}
