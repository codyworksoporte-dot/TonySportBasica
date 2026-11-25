'use client';
/*
 * BuscarProductos: the sidebar «Buscar» widget (WooCommerce product search). The official form sends
 * ?s= to the WordPress search; here it opens the shop with ?s=, where ResultadosTienda lists the matches.
 * next/form adds the site prefix and navigates without a full reload.
 */
import Form from 'next/form';
import Boton from '@/components/espejo/Boton';
import { useParametrosTienda } from './ProveedorTienda';

export default function BuscarProductos({ id = 'wb-tienda-buscar' }: { id?: string }) {
  const { s } = useParametrosTienda();
  return <Form action="/productos/" role="search" className="wb-form wb-tienda-buscar">
    <label className="tc-sr" htmlFor={id}>Buscar por:</label>
    {/* key: the field shows the current search after each navigation. */}
    <input key={s} type="search" id={id} name="s" placeholder="Buscar productos…" defaultValue={s} autoComplete="off"/>
    <Boton type="submit" tamano="sm" flecha={false} className="wb-tienda-buscar-boton">Buscar</Boton>
  </Form>;
}
