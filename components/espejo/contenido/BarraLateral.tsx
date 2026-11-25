/*
 * BarraLateral: the theme sidebar of the official pages built with a sidebar (#sidebar, span_1_of_4): the
 * "Buscar" search widget, "Artículos recientes" (empty on the official: the site has no posts) and the
 * "musica de fondo" text widget, whose SoundCloud code the official prints as plain text (mirrored as is).
 * Server component: it resolves the search index from the catalogue.
 */
import { categorias, productos, rutaCategoria, rutaProducto } from '@/lib/oficial/catalogo';
import BuscadorLateral, { type EntradaBusqueda } from './BuscadorLateral';
import './contenido.css';

// Literal text of the official widget (escaped HTML shown as text, with its typographic quotes).
const MUSICA_DE_FONDO = '<iframe width=”100%” height=”166″ scrolling=”no” frameborder=”no” allow=”autoplay” src=”https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1665826062&color=%2322d056&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true”></iframe><div style=”font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;”><a href=”https://soundcloud.com/gustavo-ramon-ramirez-323496687″?rel=0&amp;autoplay=1 title=”Gustavo Ramon Ramirez” target=”_blank” style=”color: #cccccc; text-decoration: none;”>Gustavo Ramon Ramirez</a> · <a href=”https://soundcloud.com/gustavo-ramon-ramirez-323496687/zaki-tony-sport” title=”Zaki – Tony Sport” target=”_blank” style=”color: #cccccc; text-decoration: none;”>Zaki – Tony Sport</a></div>';

function indiceDeBusqueda(): EntradaBusqueda[] {
  return [
    ...productos().map((p) => ({ texto: p.nombre, href: rutaProducto(p) })),
    ...categorias().map((c) => ({ texto: c.nombre, href: rutaCategoria(c) })),
  ];
}

export default function BarraLateral({ className = '' }: { className?: string }) {
  return <aside className={`wb-contenido-lateral ${className}`.trim()} aria-label="Barra lateral">
    <section className="wb-contenido-widget">
      <h2 className="wb-contenido-widget-titulo"><span>Buscar</span></h2>
      <BuscadorLateral indice={indiceDeBusqueda()}/>
    </section>
    <section className="wb-contenido-widget">
      <h2 className="wb-contenido-widget-titulo"><span>Artículos recientes</span></h2>
    </section>
    <section className="wb-contenido-widget">
      <h2 className="wb-contenido-widget-titulo"><span>musica de fondo</span></h2>
      <p className="wb-contenido-widget-texto">{MUSICA_DE_FONDO}</p>
    </section>
  </aside>;
}
