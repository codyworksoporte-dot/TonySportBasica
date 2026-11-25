/*
 * PaginaVacia: official WordPress pages published without content (Tienda en línea › Street Wear,
 * Camisas venta individual). The official shows only its hidden title band and an empty content area
 * (596 px between header and footer); the mirror keeps the same empty area, with the title for screen readers.
 * Props: titulo (official page title).
 */
import './tienda.css';

export default function PaginaVacia({ titulo }: { titulo: string }) {
  return <main id="contenido" className="wb-tienda-vacia">
    <h1 className="tc-sr">{titulo}</h1>
  </main>;
}
