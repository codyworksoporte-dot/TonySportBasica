/*
 * PaginaVacia: an official page whose WordPress content is empty and whose theme title band is hidden, so the
 * official shows only a blank page body between the menu and the footer. Mirrors that blank body and keeps
 * the official title as the page's h1 for screen readers only, like the hidden one of the theme.
 * Props: titulo (official page title).
 */
import './pedido-app.css';

export default function PaginaVacia({ titulo }: { titulo: string }) {
  return <main id="contenido" className="wb-pedido-app-vacia">
    <h1 className="tc-sr">{titulo}</h1>
  </main>;
}
