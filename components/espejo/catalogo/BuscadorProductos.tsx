'use client';
/*
 * BuscadorProductos: the sidebar "Buscar" widget (WooCommerce product search). The official sends the words to
 * its search results page; this static mirror has none, so the same form lists the matching products right under
 * it (every word must appear in the name, accents and case ignored), with the official result-count texts.
 * Props: productos (name + slug of every product); id (unique prefix for the field and heading).
 */
import Link from 'next/link';
import { useMemo, useState, type FormEvent } from 'react';
import Boton from '@/components/espejo/Boton';
import { normalizarTexto, POR_PAGINA_CATALOGO, textoConteo, type ProductoBusqueda } from './tipos';

type Props = { productos: ProductoBusqueda[]; id?: string };

export default function BuscadorProductos({ productos, id = 'wb-catalogo-buscar' }: Props) {
  const [texto, setTexto] = useState('');
  const [consulta, setConsulta] = useState<string | null>(null);
  const indice = useMemo(() => productos.map((p) => ({ ...p, clave: normalizarTexto(p.n) })), [productos]);
  const encontrados = useMemo(() => {
    if (consulta === null) return [];
    const palabras = normalizarTexto(consulta).split(/\s+/).filter(Boolean);
    return indice.filter((p) => palabras.every((w) => p.clave.includes(w)));
  }, [consulta, indice]);

  function buscar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConsulta(texto.trim());
  }

  return <section className="wb-catalogo-widget" aria-labelledby={`${id}-t`}>
    <h2 className="wb-catalogo-widget-titulo" id={`${id}-t`}><span>Buscar</span></h2>
    <form role="search" className="wb-form wb-catalogo-buscar" onSubmit={buscar}>
      <label className="tc-sr" htmlFor={`${id}-campo`}>Buscar por:</label>
      <input type="search" id={`${id}-campo`} name="s" placeholder="Buscar productos…" value={texto} autoComplete="off"
        onChange={(e) => setTexto(e.target.value)}/>
      <Boton type="submit" variante="contorno" tamano="sm" flecha={false} className="wb-catalogo-buscar-boton">Buscar</Boton>
    </form>
    <div className="wb-catalogo-resultados" aria-live="polite">
      {consulta !== null && <>
        <p className="wb-catalogo-resultados-conteo">{textoConteo(encontrados.length, 1)}</p>
        {encontrados.length > 0 && <ul className="wb-catalogo-resultados-lista">
          {encontrados.slice(0, POR_PAGINA_CATALOGO).map((p) => <li key={p.s}>
            <Link href={`/producto/${p.s}/`} prefetch={false}>{p.n}</Link>
          </li>)}
        </ul>}
      </>}
    </div>
  </section>;
}
