'use client';
/*
 * ArchivoCatalogo: the WooCommerce category archive of the theme. Main column (description, result count,
 * "Ordenar por" select, 3-column loop, pagination) and the sidebar (widgets passed from the server plus the
 * "Filtrar por precio" slider, which shares state with the loop).
 * The static HTML is the official page N in the official order. Ordering and the price filter work in the
 * browser like the official query strings (?orderby=price&min_price=10&max_price=20): they sort/filter the whole
 * category, keep the query in the address and in the pagination links, and go back to page 1 as WooCommerce does.
 * Props: items (whole category, official order); pagina (static page, 1-based); base ('/categoria/<slug>/');
 * rango (price slider bounds, null hides the widget like WooCommerce when min = max); cabecera? (term description);
 * lateralArriba? / lateralAbajo? (widgets before/after the price filter); etiqueta (accessible name of the list).
 */
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Boton from '@/components/espejo/Boton';
import Paginacion from '@/components/espejo/Paginacion';
import TarjetaCatalogo from './TarjetaCatalogo';
import { ORDENES, POR_PAGINA_CATALOGO, SIN_RESULTADOS, textoConteo, type Orden, type TarjetaDatos } from './tipos';

type Rango = { min: number; max: number };
type Props = {
  items: TarjetaDatos[];
  pagina: number;
  base: string;
  rango: Rango | null;
  cabecera?: ReactNode;
  lateralArriba?: ReactNode;
  lateralAbajo?: ReactNode;
  etiqueta: string;
};

const ORDEN_VALIDO = new Set<string>(ORDENES.map((o) => o.valor));
const COLUMNAS = { '--wb-g-xs': 1, '--wb-g-sm': 2, '--wb-g-md': 3, '--wb-g-lg': 3 } as CSSProperties;

function filtrar(lista: TarjetaDatos[], filtro: Rango | null): TarjetaDatos[] {
  if (!filtro) return lista;
  // WooCommerce keeps products whose price falls inside the range; products without any price drop out.
  return lista.filter((p) => p.valor !== null && p.valor >= filtro.min && p.valor <= filtro.max);
}

function ordenar(lista: TarjetaDatos[], orden: Orden): TarjetaDatos[] {
  // 'date' is the official order; 'popularity' has no sales data in the snapshot and keeps it too.
  if (orden === 'date' || orden === 'popularity') return lista;
  if (orden === 'oldest_to_recent') return [...lista].reverse();
  const signo = orden === 'price' ? 1 : -1;
  return [...lista].sort((a, b) => {
    if (a.valor === b.valor) return signo * (a.id - b.id);
    if (a.valor === null) return -signo;
    if (b.valor === null) return signo;
    return signo * (a.valor - b.valor);
  });
}

function consulta(orden: Orden, filtro: Rango | null): string {
  const q = new URLSearchParams();
  if (orden !== 'date') q.set('orderby', orden);
  if (filtro) {
    q.set('min_price', String(filtro.min));
    q.set('max_price', String(filtro.max));
  }
  const texto = q.toString();
  return texto ? `?${texto}` : '';
}

function leerConsulta(rango: Rango | null): { orden: Orden; filtro: Rango | null } {
  const q = new URLSearchParams(window.location.search);
  const valor = q.get('orderby') ?? '';
  const orden = (ORDEN_VALIDO.has(valor) ? valor : 'date') as Orden;
  if (!q.has('min_price') && !q.has('max_price')) return { orden, filtro: null };
  const min = Number(q.get('min_price'));
  const max = Number(q.get('max_price'));
  return {
    orden,
    filtro: {
      min: q.has('min_price') && Number.isFinite(min) ? min : rango?.min ?? 0,
      max: q.has('max_price') && Number.isFinite(max) ? max : rango?.max ?? Number.MAX_SAFE_INTEGER,
    },
  };
}

function FiltroPrecio({ rango, filtro, onFiltrar }: { rango: Rango; filtro: Rango | null; onFiltrar: (r: Rango) => void }) {
  const [desde, setDesde] = useState(Math.max(rango.min, Math.min(filtro?.min ?? rango.min, rango.max)));
  const [hasta, setHasta] = useState(Math.min(rango.max, Math.max(filtro?.max ?? rango.max, rango.min)));
  const amplitud = Math.max(1, rango.max - rango.min);
  const pos = (v: number) => `${((v - rango.min) / amplitud) * 100}%`;
  const estilo = { '--desde': pos(desde), '--hasta': pos(hasta) } as CSSProperties;
  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onFiltrar({ min: desde, max: hasta });
  }
  return <section className="wb-catalogo-widget" aria-labelledby="wb-catalogo-t-precio">
    <h2 className="wb-catalogo-widget-titulo" id="wb-catalogo-t-precio"><span>Filtrar por precio</span></h2>
    <form className="wb-catalogo-precio" onSubmit={enviar}>
      <div className="wb-catalogo-deslizador" style={estilo}>
        <input type="range" name="min_price" min={rango.min} max={rango.max} step={10} value={desde}
          aria-label="Precio mínimo" aria-valuetext={`$${desde}`}
          className={desde > rango.min + amplitud / 2 ? 'wb-catalogo-deslizador-arriba' : undefined}
          onChange={(e) => setDesde(Math.min(Number(e.target.value), hasta))}/>
        <input type="range" name="max_price" min={rango.min} max={rango.max} step={10} value={hasta}
          aria-label="Precio máximo" aria-valuetext={`$${hasta}`}
          onChange={(e) => setHasta(Math.max(Number(e.target.value), desde))}/>
      </div>
      <div className="wb-catalogo-precio-fila">
        <p className="wb-catalogo-precio-etiqueta">Precio: <span>${desde}</span> — <span>${hasta}</span></p>
        <Boton type="submit" tamano="sm" flecha={false} className="wb-catalogo-precio-boton">Filtrar</Boton>
      </div>
    </form>
  </section>;
}

export default function ArchivoCatalogo({ items, pagina, base, rango, cabecera, lateralArriba, lateralAbajo, etiqueta }: Props) {
  const router = useRouter();
  const [orden, setOrden] = useState<Orden>('date');
  const [filtro, setFiltro] = useState<Rango | null>(null);
  const rangoMin = rango?.min;
  const rangoMax = rango?.max;

  // Apply ?orderby / ?min_price / ?max_price from the address (also after back/forward).
  useEffect(() => {
    const limites = rangoMin === undefined || rangoMax === undefined ? null : { min: rangoMin, max: rangoMax };
    const sincronizar = () => {
      const leido = leerConsulta(limites);
      setOrden(leido.orden);
      setFiltro(leido.filtro);
    };
    sincronizar();
    window.addEventListener('popstate', sincronizar);
    return () => window.removeEventListener('popstate', sincronizar);
  }, [rangoMin, rangoMax]);

  const lista = useMemo(() => ordenar(filtrar(items, filtro), orden), [items, filtro, orden]);
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA_CATALOGO));
  const actual = Math.min(Math.max(1, pagina), totalPaginas);
  const visibles = lista.slice((actual - 1) * POR_PAGINA_CATALOGO, actual * POR_PAGINA_CATALOGO);
  const sufijo = consulta(orden, filtro);
  const hrefPagina = (n: number) => `${n === 1 ? base : `${base}page/${n}/`}${sufijo}`;

  function aplicar(nuevoOrden: Orden, nuevoFiltro: Rango | null) {
    const q = consulta(nuevoOrden, nuevoFiltro);
    // Like WooCommerce, a new ordering or filter starts again on page 1.
    if (pagina > 1) {
      router.push(`${base}${q}`);
      return;
    }
    setOrden(nuevoOrden);
    setFiltro(nuevoFiltro);
    window.history.pushState(null, '', `${window.location.pathname}${q}`);
  }

  return <div className="wb-catalogo-cols">
    <div className="wb-catalogo-principal">
      {cabecera}
      {lista.length === 0
        ? <p className="wb-aviso wb-catalogo-aviso" role="status">{SIN_RESULTADOS}</p>
        : <>
          <div className="wb-catalogo-barra">
            <p className="wb-catalogo-conteo" aria-live="polite">{textoConteo(lista.length, actual)}</p>
            <form className="wb-form wb-catalogo-orden" onSubmit={(e) => e.preventDefault()}>
              <select name="orderby" aria-label="Pedido de la tienda" value={orden}
                onChange={(e) => aplicar(e.target.value as Orden, filtro)}>
                {ORDENES.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
              </select>
            </form>
          </div>
          <ul className="wb-productos wb-catalogo-grilla" style={COLUMNAS} aria-label={etiqueta}>
            {visibles.map((item, i) => <li key={item.id} className="wb-productos-item">
              <TarjetaCatalogo item={item} prioridad={i < 3}/>
            </li>)}
          </ul>
          <Paginacion actual={actual} total={totalPaginas} hrefPagina={hrefPagina} className="wb-catalogo-paginacion"/>
        </>}
    </div>
    <aside className="wb-catalogo-lateral" aria-label="Barra lateral de la tienda">
      {lateralArriba}
      {rango && <FiltroPrecio key={filtro ? `${filtro.min}-${filtro.max}` : 'todo'} rango={rango} filtro={filtro}
        onFiltrar={(nuevo) => aplicar(orden, nuevo)}/>}
      {lateralAbajo}
    </aside>
  </div>;
}
