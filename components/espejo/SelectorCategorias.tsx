'use client';
/*
 * SelectorCategorias: the footer's "Elige una categoría" dropdown (WooCommerce product_cat widget).
 * Choosing with the mouse navigates to /categoria/<slug>/; with the keyboard, arrows only move and
 * Enter navigates, so browsing the list never leaves the page by accident.
 * Props: opciones ({ slug, nombre, nivel }[] in official order), placeholder, idTitulo (labelling heading).
 */
import { useRouter } from 'next/navigation';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';

export type OpcionCategoria = { slug: string; nombre: string; nivel: number };
type Props = { opciones: OpcionCategoria[]; placeholder: string; idTitulo: string };

const TECLAS_DE_NAVEGACION = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

export default function SelectorCategorias({ opciones, placeholder, idTitulo }: Props) {
  const router = useRouter();
  const conTeclado = useRef(false);
  const ir = (slug: string) => { if (slug) router.push(`/categoria/${slug}/`); };

  function alCambiar(event: ChangeEvent<HTMLSelectElement>) {
    if (conTeclado.current) return;
    ir(event.target.value);
  }
  function alPulsarTecla(event: KeyboardEvent<HTMLSelectElement>) {
    if (event.key === 'Enter') { event.preventDefault(); ir(event.currentTarget.value); return; }
    if (TECLAS_DE_NAVEGACION.has(event.key) || event.key.length === 1) conTeclado.current = true;
  }

  return <div className="wb-form wb-pie-selector">
    <select id="wb-pie-categorias" name="product_cat" defaultValue="" aria-labelledby={idTitulo}
      onChange={alCambiar} onKeyDown={alPulsarTecla}
      onPointerDown={() => { conTeclado.current = false; }} onBlur={() => { conTeclado.current = false; }}>
      <option value="">{placeholder}</option>
      {opciones.map(opcion => <option key={opcion.slug} value={opcion.slug}>{`${' '.repeat(opcion.nivel * 3)}${opcion.nombre}`}</option>)}
    </select>
  </div>;
}
