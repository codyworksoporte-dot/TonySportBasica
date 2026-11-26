'use client';
/*
 * ResultadosTienda: result count, order select, product loop and pagination of the shop archive
 * (same classes as the category archives).
 * Without query it shows the static page it receives (children). With the official query vars
 * (?s=, ?min_price=/max_price=, ?orderby=, ?paged=) it loads /productos/indice.json once and lists the
 * matching products like WooCommerce would, 12 per page.
 * Props: conteo (static result count text); indiceUrl (index URL with the site prefix); children.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Paginacion from '@/components/espejo/Paginacion';
import GrillaTienda from './GrillaTienda';
import OrdenTienda from './OrdenTienda';
import { useParametrosTienda } from './ProveedorTienda';
import { aTarjeta, filtrarYOrdenar, paginarLista, pideResultados, textoConteo, urlTienda, type ProductoIndice } from './tienda-comun';

export default function ResultadosTienda({ conteo, indiceUrl, children }: { conteo: string; indiceUrl: string; children: ReactNode }) {
  const p = useParametrosTienda();
  const activo = pideResultados(p);
  const [indice, setIndice] = useState<ProductoIndice[] | null>(null);
  const [fallo, setFallo] = useState(false);
  const tituloOriginal = useRef<string | null>(null);

  // Official search results tab: "<búsqueda> | Resultados de la búsqueda | TONY SPORTSWEAR EL SALVADOR".
  useEffect(() => {
    if (!p.listo) return;
    if (tituloOriginal.current === null) tituloOriginal.current = document.title;
    document.title = p.s ? `${p.s} | Resultados de la búsqueda | TONY SPORTSWEAR EL SALVADOR` : tituloOriginal.current;
  }, [p.listo, p.s]);

  useEffect(() => {
    if (!activo || indice || fallo) return;
    let vigente = true;
    fetch(indiceUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((datos: { productos: ProductoIndice[] }) => { if (vigente) setIndice(datos.productos); })
      .catch(() => { if (vigente) setFallo(true); });
    return () => { vigente = false; };
  }, [activo, indice, fallo, indiceUrl]);

  const barra = (texto: string) => <div className="wb-catalogo-barra">
    <p className="wb-catalogo-conteo" role="status">{texto}</p>
    <OrdenTienda/>
  </div>;

  if (!activo || fallo) return <>{barra(conteo)}{children}</>;
  if (!indice) return <>{barra(conteo)}<div className="wb-tienda-cargando" aria-busy="true">{children}</div></>;

  const pagina = paginarLista(filtrarYOrdenar(indice, p), p.paged);
  // WooCommerce replaces the count and the order select with this notice when nothing matches.
  if (pagina.total === 0) return <p className="wb-aviso wb-catalogo-aviso" role="status">{textoConteo(pagina)}</p>;
  return <>
    {barra(textoConteo(pagina))}
    <GrillaTienda productos={pagina.items.map(aTarjeta)} prioridad={3}/>
    <Paginacion actual={pagina.pagina} total={pagina.totalPaginas} hrefPagina={(n) => urlTienda({ ...p, paged: n })} className="wb-catalogo-paginacion"/>
  </>;
}
