'use client';
/*
 * Cabecera: the official header. Desktop (1019 px+): a 146 px row with our logo left and the cart right,
 * then the two-row menu (MenuEscritorio). Phones: one 62 px row with logo, cart and hamburger, and the
 * menu opening below it (MenuMovil). The counter is real (ProveedorCarritoEspejo). No props.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { rutaNormal, WIDGETS } from '@/lib/oficial/menu';
import { useCarritoEspejo } from './CarritoEstado';
import IconoEspejo from './Iconos';
import LogoEspejo from './LogoEspejo';
import MenuEscritorio from './MenuEscritorio';
import MenuMovil from './MenuMovil';
import './espejo-chrome.css';

function CarritoCabecera() {
  const { total, cargando, error } = useCarritoEspejo();
  const etiqueta = error ? 'Carrito: requiere revisión' : cargando ? 'Carrito' : `Carrito: ${total} ${total === 1 ? 'diseño' : 'diseños'}`;
  return <Link href={WIDGETS.carrito.href} prefetch={false} className="wb-carrito-cabecera" aria-label={etiqueta} title="Carrito">
    <IconoEspejo nombre="carrito" size={24}/>
    <span className="wb-carrito-contador" data-error={error ? '' : undefined} aria-hidden="true">{error ? '!' : total}</span>
  </Link>;
}

export default function Cabecera() {
  const ruta = rutaNormal(usePathname() || '/');
  const [abierto, setAbierto] = useState(false);
  const hamburguesa = useRef<HTMLButtonElement>(null);

  useEffect(() => { setAbierto(false); }, [ruta]);
  useEffect(() => {
    const escritorio = matchMedia('(min-width: 1019px)');
    const alCambiar = () => { if (escritorio.matches) setAbierto(false); };
    const alRepetir = () => setAbierto(false);
    escritorio.addEventListener('change', alCambiar);
    window.addEventListener('tony:intro-replay', alRepetir);
    return () => { escritorio.removeEventListener('change', alCambiar); window.removeEventListener('tony:intro-replay', alRepetir); };
  }, []);

  return <header className="wb-cabecera">
    <div className="wb-contenedor wb-cabecera-fila">
      <LogoEspejo/>
      <div className="wb-cabecera-acciones">
        <CarritoCabecera/>
        <button ref={hamburguesa} type="button" className="wb-hamburguesa" aria-expanded={abierto} aria-controls="wb-menu-movil" aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setAbierto(valor => !valor)}>
          <Icon name={abierto ? 'close' : 'menu'} size={30}/>
        </button>
      </div>
    </div>
    <MenuEscritorio ruta={ruta}/>
    <MenuMovil id="wb-menu-movil" abierto={abierto} ruta={ruta} onCerrar={() => { setAbierto(false); hamburguesa.current?.focus(); }} onNavegar={() => setAbierto(false)}/>
  </header>;
}
