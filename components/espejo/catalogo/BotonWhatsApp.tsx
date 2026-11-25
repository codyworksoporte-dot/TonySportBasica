'use client';
/*
 * BotonWhatsApp: honest replacement of the official "Añadir al carrito" (our cart only stores configurator
 * designs). Opens wa.me/50370155571 with "Hola, Tony. Quiero este producto: <nombre> (<precio>) <URL de la ficha>".
 * The static HTML carries the official permalink; once in the browser the text points to this mirror's page.
 * Props: nombre; precio (current price, '' when none); ruta (local '/producto/<slug>/'); respaldo (official
 * permalink); tamano? ('sm' | 'md', default 'sm'); bloque?; etiquetaCompleta? (accessible name with the product).
 */
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import Boton from '@/components/espejo/Boton';

const NUMERO = '50370155571';

export function enlaceWhatsApp(nombre: string, precio: string, url: string): string {
  const texto = `Hola, Tony. Quiero este producto: ${nombre}${precio ? ` (${precio})` : ''} ${url}`;
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`;
}

type Props = { nombre: string; precio: string; ruta: string; respaldo: string; tamano?: 'sm' | 'md'; bloque?: boolean; etiquetaCompleta?: boolean; className?: string };

export default function BotonWhatsApp({ nombre, precio, ruta, respaldo, tamano = 'sm', bloque = false, etiquetaCompleta = false, className = '' }: Props) {
  const [href, setHref] = useState(() => enlaceWhatsApp(nombre, precio, respaldo));
  useEffect(() => {
    const url = new URL(`${process.env.TONY_ASSET_BASE || ''}${ruta}`, window.location.origin).href;
    setHref(enlaceWhatsApp(nombre, precio, url));
  }, [nombre, precio, ruta]);
  return <Boton href={href} tamano={tamano} flecha={false} bloque={bloque} className={`wb-catalogo-wa ${className}`.trim()}
    ariaLabel={etiquetaCompleta ? `Pedir por WhatsApp: ${nombre} (se abre en otra pestaña)` : undefined}>
    <Icon name="whatsapp-solid" size={18}/>Pedir por WhatsApp
  </Boton>;
}
