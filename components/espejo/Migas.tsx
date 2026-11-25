/*
 * Migas: breadcrumbs like the theme's ("Inicio › Contacto"); the last item is the current page.
 * Props: items ({ texto, href? }[]), className?, centrado? (centre them, as inside TituloPagina).
 * Note: the official pages hide their breadcrumb bar; use these only where the official shows them.
 */
import Link from 'next/link';
import './espejo-componentes.css';

export type Miga = { texto: string; href?: string };
type Props = { items: Miga[]; className?: string; centrado?: boolean };

export default function Migas({ items, className = '', centrado = false }: Props) {
  if (!items.length) return null;
  return <nav className={`wb-migas${centrado ? ' wb-migas--centro' : ''} ${className}`.trim()} aria-label="Migas de pan">
    <ol>
      {items.map((miga, i) => {
        const ultima = i === items.length - 1;
        return <li key={`${miga.texto}-${i}`}>
          {miga.href && !ultima ? <Link href={miga.href} prefetch={false}>{miga.texto}</Link> : <span aria-current={ultima ? 'page' : undefined}>{miga.texto}</span>}
        </li>;
      })}
    </ol>
  </nav>;
}
