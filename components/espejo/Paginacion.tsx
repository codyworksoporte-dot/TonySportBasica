/*
 * Paginacion: WooCommerce pagination ("1 2 3 4 →"): small square links, current page highlighted, ← and →
 * at the ends, "…" gaps for long runs (end_size 3, mid_size 3 like WordPress).
 * Props: actual (1-based); total (pages); and either base (listing URL, e.g. '/categoria/implementos-deportivos/':
 * page 1 = base, page n = `${base}page/${n}/`, the official pattern) or hrefPagina ((n) => string; only from
 * server components or client code, functions cannot cross into client components); etiqueta? (nav name,
 * default 'Paginación de productos'); className?.
 */
import Link from 'next/link';
import './espejo-componentes.css';

type Props = { actual: number; total: number; etiqueta?: string; className?: string }
  & ({ base: string; hrefPagina?: undefined } | { hrefPagina: (pagina: number) => string; base?: undefined });

function paginas(actual: number, total: number): (number | 'hueco')[] {
  const extremos = 3, medio = 3, salida: (number | 'hueco')[] = [];
  for (let n = 1; n <= total; n++) {
    const cerca = n <= extremos || n > total - extremos || Math.abs(n - actual) <= medio;
    if (cerca) salida.push(n);
    else if (salida[salida.length - 1] !== 'hueco') salida.push('hueco');
  }
  return salida;
}

export default function Paginacion({ actual, total, base, hrefPagina, etiqueta = 'Paginación de productos', className = '' }: Props) {
  if (total <= 1) return null;
  const pagina = Math.min(Math.max(1, Math.round(actual)), total);
  const raiz = (base ?? '/').endsWith('/') ? (base ?? '/') : `${base}/`;
  const href = hrefPagina ?? ((n: number) => (n === 1 ? raiz : `${raiz}page/${n}/`));
  return <nav className={`wb-paginacion ${className}`.trim()} aria-label={etiqueta}>
    <ul>
      {pagina > 1 && <li><Link className="wb-paginacion-enlace" href={href(pagina - 1)} prefetch={false} aria-label="Página anterior">←</Link></li>}
      {paginas(pagina, total).map((n, i) => <li key={n === 'hueco' ? `h${i}` : n}>
        {n === 'hueco' ? <span className="wb-paginacion-hueco" aria-hidden="true">…</span>
          : n === pagina ? <span className="wb-paginacion-enlace" aria-current="page">{n}</span>
          : <Link className="wb-paginacion-enlace" href={href(n)} prefetch={false} aria-label={`Página ${n}`}>{n}</Link>}
      </li>)}
      {pagina < total && <li><Link className="wb-paginacion-enlace" href={href(pagina + 1)} prefetch={false} aria-label="Página siguiente">→</Link></li>}
    </ul>
  </nav>;
}
