'use client';
/*
 * CategoriasTienda: the sidebar «Categorías» dropdown of the shop (WooCommerce product_cat widget; on the
 * shop root it lists the top-level categories). A mouse choice opens /categoria/<slug>/; with the keyboard
 * the arrows only move and Enter opens. Same behaviour as the footer dropdown, with its own id.
 * Props: opciones ({ slug, nombre }[] in official order); idTitulo (labelling heading); id?.
 */
import { useRouter } from 'next/navigation';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';

type Opcion = { slug: string; nombre: string };

const TECLAS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']);

export default function CategoriasTienda({ opciones, idTitulo, id = 'wb-tienda-categorias' }: { opciones: Opcion[]; idTitulo: string; id?: string }) {
  const router = useRouter();
  const conTeclado = useRef(false);
  const ir = (slug: string) => { if (slug) router.push(`/categoria/${slug}/`); };

  const alCambiar = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!conTeclado.current) ir(event.target.value);
  };
  const alPulsar = (event: KeyboardEvent<HTMLSelectElement>) => {
    if (event.key === 'Enter') { event.preventDefault(); ir(event.currentTarget.value); return; }
    if (TECLAS.has(event.key) || event.key.length === 1) conTeclado.current = true;
  };

  return <div className="wb-form wb-tienda-categorias">
    <select id={id} name="product_cat" defaultValue="" aria-labelledby={idTitulo} onChange={alCambiar} onKeyDown={alPulsar}
      onPointerDown={() => { conTeclado.current = false; }} onBlur={() => { conTeclado.current = false; }}>
      <option value="">Elige una categoría</option>
      {opciones.map((o) => <option key={o.slug} value={o.slug}>{o.nombre}</option>)}
    </select>
  </div>;
}
