'use client';
/*
 * MenuEscritorio: the official main menu from 1019 px up. Thirteen entries in two 146 px rows at 1200 px+
 * (seven, then six, like the official at 1440), dropdowns on hover and with the chevron buttons for
 * keyboard and touch (aria-expanded; Escape closes and returns focus). Closed dropdowns are display:none,
 * and an open one flips to the left when the window's edge would cut it. Props: ruta (normalised pathname).
 */
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import Icon from '@/components/Icon';
import { MENU_PRINCIPAL, MENU_PRIMERA_FILA, rutaNormal, type ItemMenu } from '@/lib/oficial/menu';

const idDe = (clave: string) => `wb-sub-${clave}`;

export function EnlaceMenu({ item, className, ruta, onClick }: { item: ItemMenu; className: string; ruta: string; onClick?: () => void }) {
  if (item.externo) return <a className={className} href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClick}>{item.texto}</a>;
  const actual = rutaNormal(item.href) === ruta;
  return <Link className={className} href={item.href} prefetch={false} aria-current={actual ? 'page' : undefined} onClick={onClick}>{item.texto}</Link>;
}

function fuera(event: FocusEvent<HTMLElement>) {
  return !event.currentTarget.contains(event.relatedTarget as Node | null);
}

/** Which side a dropdown opens to: the second level hangs under its entry, the third beside it. */
function useLado(abierto: boolean, nivel: 'n2' | 'n3') {
  const ref = useRef<HTMLUListElement>(null);
  const [lado, setLado] = useState<'derecha' | 'izquierda'>('derecha');
  const medir = useCallback(() => {
    const ul = ref.current, li = ul?.parentElement;
    if (!ul || !li || !ul.offsetWidth) return false;
    const caja = li.getBoundingClientRect();
    const borde = (nivel === 'n3' ? caja.right : caja.left + 2) + ul.offsetWidth;
    setLado(borde > document.documentElement.clientWidth - 8 ? 'izquierda' : 'derecha');
    return true;
  }, [nivel]);
  useLayoutEffect(() => { if (abierto) medir(); }, [abierto, medir]);
  // On hover the dropdown is already displayed; if not yet, measure on the next frame.
  const alEntrar = useCallback(() => { if (!medir()) requestAnimationFrame(() => { medir(); }); }, [medir]);
  return { ref, lado, alEntrar };
}

type SubProps = { item: ItemMenu; clave: string; ruta: string; abiertoSub: string | null; alternarSub: (clave: string | null) => void };

function ItemSubmenu({ item, clave, ruta, abiertoSub, alternarSub }: SubProps) {
  const hijos = item.hijos ?? [];
  const abierto = abiertoSub === clave;
  const { ref, lado, alEntrar } = useLado(abierto, 'n3');
  return <li className={`wb-sub-item${hijos.length ? ' wb-sub-item--padre' : ''}`} data-abierto={abierto || undefined}
    onMouseEnter={hijos.length ? alEntrar : undefined}
    onBlur={hijos.length ? event => { if (abierto && fuera(event)) alternarSub(null); } : undefined}>
    <EnlaceMenu item={item} className="wb-sub-enlace" ruta={ruta}/>
    {hijos.length > 0 && <>
      <button type="button" className="wb-sub-flecha" aria-expanded={abierto} aria-controls={idDe(clave)} aria-label={`Submenú de ${item.texto}`}
        onClick={() => alternarSub(abierto ? null : clave)}>
        <Icon name="right" size={13}/>
      </button>
      <ul ref={ref} id={idDe(clave)} className="wb-submenu wb-submenu--n3" data-lado={lado}>
        {hijos.map((nieto, k) => <li key={k} className="wb-sub-item"><EnlaceMenu item={nieto} className="wb-sub-enlace" ruta={ruta}/></li>)}
      </ul>
    </>}
  </li>;
}

type PrincipalProps = { item: ItemMenu; indice: number; ruta: string; abierto: string | null; abrir: (clave: string | null) => void; cerrar: () => void; abiertoSub: string | null; alternarSub: (clave: string | null) => void };

function ItemPrincipal({ item, indice, ruta, abierto, abrir, cerrar, abiertoSub, alternarSub }: PrincipalProps) {
  const clave = String(indice), hijos = item.hijos ?? [], este = abierto === clave;
  const { ref, lado, alEntrar } = useLado(este, 'n2');
  return <li className={`wb-menu-item${hijos.length ? ' wb-menu-item--padre' : ''}${indice >= MENU_PRIMERA_FILA ? ' wb-menu-item--fila2' : ''}`}
    data-abierto={este || undefined}
    onMouseEnter={() => { if (abierto && abierto !== clave) cerrar(); if (hijos.length) alEntrar(); }}
    onBlur={hijos.length ? event => { if (este && fuera(event)) cerrar(); } : undefined}>
    <EnlaceMenu item={item} className="wb-menu-enlace" ruta={ruta}/>
    {hijos.length > 0 && <>
      <button type="button" className="wb-menu-flecha" aria-expanded={este} aria-controls={idDe(clave)} aria-label={`Submenú de ${item.texto}`}
        onClick={() => { alternarSub(null); abrir(este ? null : clave); }}>
        <Icon name="down" size={14}/>
      </button>
      <ul ref={ref} id={idDe(clave)} className="wb-submenu" data-lado={lado}>
        {hijos.map((hijo, j) => <ItemSubmenu key={j} item={hijo} clave={`${clave}-${j}`} ruta={ruta} abiertoSub={abiertoSub} alternarSub={alternarSub}/>)}
      </ul>
    </>}
  </li>;
}

export default function MenuEscritorio({ ruta }: { ruta: string }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const [abiertoSub, setAbiertoSub] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const cerrar = useCallback(() => { setAbierto(null); setAbiertoSub(null); }, []);

  useEffect(() => { cerrar(); }, [ruta, cerrar]);
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (event: PointerEvent) => { if (nav.current && !nav.current.contains(event.target as Node)) cerrar(); };
    document.addEventListener('pointerdown', alPulsar);
    return () => document.removeEventListener('pointerdown', alPulsar);
  }, [abierto, cerrar]);

  function teclas(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape') return;
    const clave = abiertoSub ?? abierto;
    if (!clave) return;
    event.preventDefault();
    if (abiertoSub) setAbiertoSub(null); else setAbierto(null);
    nav.current?.querySelector<HTMLButtonElement>(`button[aria-controls="${idDe(clave)}"]`)?.focus();
  }

  return <nav ref={nav} className="wb-menu" aria-label="Menú principal" onKeyDown={teclas}>
    <ul className="wb-contenedor wb-menu-lista">
      {MENU_PRINCIPAL.map((item, i) => <ItemPrincipal key={i} item={item} indice={i} ruta={ruta} abierto={abierto} abrir={setAbierto} cerrar={cerrar} abiertoSub={abiertoSub} alternarSub={setAbiertoSub}/>)}
    </ul>
  </nav>;
}
