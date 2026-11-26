'use client';
/*
 * BuscarProductos: the sidebar «Buscar» widget (WooCommerce product search) of the shop and of every
 * category archive. The official form sends ?s= to the WordPress product search, which lists the results
 * in the shop template; here it opens the shop with ?s=, where ResultadosTienda lists the matches.
 * next/form adds the site prefix and navigates without a full reload. Inside the shop it shows the
 * current search (ProveedorTienda); elsewhere it starts empty.
 * Props: id? (unique prefix for the heading and the field).
 */
import Form from 'next/form';
import Boton from '@/components/espejo/Boton';
import { useParametrosTienda } from './ProveedorTienda';

export default function BuscarProductos({ id = 'wb-buscar' }: { id?: string }) {
  const { s } = useParametrosTienda();
  return <section className="wb-catalogo-widget" aria-labelledby={`${id}-t`}>
    <h2 className="wb-catalogo-widget-titulo" id={`${id}-t`}><span>Buscar</span></h2>
    <Form action="/productos/" role="search" className="wb-form wb-catalogo-buscar">
      <label className="tc-sr" htmlFor={`${id}-campo`}>Buscar por:</label>
      {/* key: the field shows the current search after each navigation. */}
      <input key={s} type="search" id={`${id}-campo`} name="s" placeholder="Buscar productos…" defaultValue={s} autoComplete="off"/>
      {/* The official BUSCAR button is the dark one, not the teal of FILTRAR. */}
      <Boton type="submit" variante="contorno" tamano="sm" flecha={false} className="wb-catalogo-buscar-boton">Buscar</Boton>
    </Form>
  </section>;
}
