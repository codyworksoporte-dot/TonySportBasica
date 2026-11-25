'use client';
/*
 * MenuMovil: the official phone menu (up to 1018 px). Drops over the page under the header row without
 * pushing it down, like the official; texts keep their original case, entries with children expand inline
 * with a chevron (aria-expanded).
 * Props: id, abierto, ruta (normalised pathname), onCerrar (Escape: close and refocus the toggle),
 * onNavegar (a link was followed).
 */
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { MENU_PRINCIPAL, type ItemMenu } from '@/lib/oficial/menu';
import { EnlaceMenu } from './MenuEscritorio';

type Props = { id: string; abierto: boolean; ruta: string; onCerrar: () => void; onNavegar: () => void };
type ItemProps = { item: ItemMenu; clave: string; nivel: number; ruta: string; expandidos: ReadonlySet<string>; alternar: (clave: string) => void; onNavegar: () => void };

function ItemMovil({ item, clave, nivel, ruta, expandidos, alternar, onNavegar }: ItemProps) {
  const hijos = item.hijos ?? [];
  const abierto = expandidos.has(clave);
  return <li className={`wb-mm-item wb-mm-item--n${nivel}`}>
    <div className="wb-mm-fila">
      <EnlaceMenu item={item} className="wb-mm-enlace" ruta={ruta} onClick={onNavegar}/>
      {hijos.length > 0 && <button type="button" className="wb-mm-toggle" aria-expanded={abierto} aria-controls={`wb-mm-${clave}`} aria-label={`Submenú de ${item.texto}`} onClick={() => alternar(clave)}>
        <Icon name="down" size={16}/>
      </button>}
    </div>
    {hijos.length > 0 && <ul id={`wb-mm-${clave}`} className="wb-mm-sub" hidden={!abierto}>
      {hijos.map((hijo, j) => <ItemMovil key={j} item={hijo} clave={`${clave}-${j}`} nivel={nivel + 1} ruta={ruta} expandidos={expandidos} alternar={alternar} onNavegar={onNavegar}/>)}
    </ul>}
  </li>;
}

export default function MenuMovil({ id, abierto, ruta, onCerrar, onNavegar }: Props) {
  const [expandidos, setExpandidos] = useState<ReadonlySet<string>>(() => new Set());
  useEffect(() => { if (!abierto) setExpandidos(new Set()); }, [abierto]);

  // Closing an entry also closes everything below it.
  const alternar = (clave: string) => setExpandidos(previos => {
    const siguientes = new Set(previos);
    if (siguientes.has(clave)) { for (const k of previos) if (k === clave || k.startsWith(`${clave}-`)) siguientes.delete(k); }
    else siguientes.add(clave);
    return siguientes;
  });

  return <nav id={id} className="wb-menu-movil" aria-label="Menú principal" hidden={!abierto}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); onCerrar(); } }}>
    <ul className="wb-mm-lista">
      {MENU_PRINCIPAL.map((item, i) => <ItemMovil key={i} item={item} clave={String(i)} nivel={1} ruta={ruta} expandidos={expandidos} alternar={alternar} onNavegar={onNavegar}/>)}
    </ul>
  </nav>;
}
