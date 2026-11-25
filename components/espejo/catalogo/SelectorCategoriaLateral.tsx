'use client';
/*
 * SelectorCategoriaLateral: the sidebar "Categorías" widget (WooCommerce product_cat dropdown with select2).
 * The current category is selected; choosing another one with the mouse opens it, with the keyboard the arrows
 * only move and Enter opens it. The select2 "×" (shown while a category is selected) clears it and opens the
 * shop, as on the official site.
 * Props: opciones ({ slug, nombre, nivel }[], hierarchical order); actual (selected slug, '' for none); id?.
 */
import { useRouter } from 'next/navigation';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import Icon from '@/components/Icon';
import type { OpcionCategoriaLateral } from './tipos';

type Props = { opciones: OpcionCategoriaLateral[]; actual: string; id?: string };

const TECLAS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);
const TIENDA = '/productos/';

export default function SelectorCategoriaLateral({ opciones, actual, id = 'wb-catalogo-categorias' }: Props) {
  const router = useRouter();
  const conTeclado = useRef(false);
  const seleccion = opciones.some((o) => o.slug === actual) ? actual : '';
  const ir = (slug: string) => {
    if (slug === seleccion) return;
    router.push(slug ? `/categoria/${slug}/` : TIENDA);
  };
  function alCambiar(event: ChangeEvent<HTMLSelectElement>) {
    if (!conTeclado.current) ir(event.target.value);
  }
  function alPulsarTecla(event: KeyboardEvent<HTMLSelectElement>) {
    if (event.key === 'Enter') { event.preventDefault(); ir(event.currentTarget.value); return; }
    if (TECLAS.has(event.key) || event.key.length === 1) conTeclado.current = true;
  }
  return <section className="wb-catalogo-widget" aria-labelledby={`${id}-t`}>
    <h2 className="wb-catalogo-widget-titulo" id={`${id}-t`}><span>Categorías</span></h2>
    <div className={`wb-form wb-catalogo-categorias${seleccion ? ' wb-catalogo-categorias--con-valor' : ''}`}>
      <select key={seleccion} id={id} name="product_cat" defaultValue={seleccion} aria-labelledby={`${id}-t`}
        onChange={alCambiar} onKeyDown={alPulsarTecla}
        onPointerDown={() => { conTeclado.current = false; }} onBlur={() => { conTeclado.current = false; }}>
        <option value="">Elige una categoría</option>
        {opciones.map((o) => <option key={o.slug} value={o.slug}>{`${' '.repeat(o.nivel * 3)}${o.nombre}`}</option>)}
      </select>
      {seleccion && <button type="button" className="wb-catalogo-limpiar" onClick={() => router.push(TIENDA)}
        aria-label="Quitar la categoría y ver todos los productos"><Icon name="close" size={14}/></button>}
    </div>
  </section>;
}
