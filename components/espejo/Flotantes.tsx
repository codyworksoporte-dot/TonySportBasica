'use client';
/*
 * Flotantes: the three official floating widgets (WhatsApp bubble, IDIOMA », floating cart). On the protected
 * order tool (/configurador) they stay mounted but hidden, as the redesign's assistant did, so they never
 * cover its sticky step bar or its controls. Props: ocultarEn? (path prefixes, default ['/configurador']).
 */
import { usePathname } from 'next/navigation';
import CarritoFlotante from './CarritoFlotante';
import Idioma from './Idioma';
import WhatsAppFlotante from './WhatsAppFlotante';

export default function Flotantes({ ocultarEn = ['/configurador'] }: { ocultarEn?: string[] }) {
  const ruta = usePathname() || '/';
  const oculto = ocultarEn.some(prefijo => ruta === prefijo || ruta.startsWith(`${prefijo.replace(/\/$/, '')}/`));
  return <div className="wb-flotantes" hidden={oculto}>
    <WhatsAppFlotante/>
    <Idioma/>
    <CarritoFlotante/>
  </div>;
}
