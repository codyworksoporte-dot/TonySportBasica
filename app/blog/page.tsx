import type { Metadata } from 'next';
import Form from 'next/form';
import Icon from '@/components/Icon';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// Mirror of https://www.tonysportselsalvador.com/blog/: the posts page has no posts, so it shows the theme's
// "no results" line next to the sidebar (Buscar, Artículos recientes, Musica de fondo). The official title and
// breadcrumb bar are hidden (sr-only h1 here).
// The official posts page adds the site tagline to its tab title.
export const metadata: Metadata = { title: { absolute: 'Blog | TONY SPORTSWEAR EL SALVADOR | SI NO LO TENEMOS, TE LO HACEMOS' } };

// The official "musica de fondo" text widget holds a SoundCloud embed pasted as text, so the page prints the
// code itself; it is reproduced as text, as on the official site.
const CODIGO_MUSICA = '<iframe width=”100%” height=”166″ scrolling=”no” frameborder=”no” allow=”autoplay” src=”https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1665826062&color=%2322d056&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true”></iframe><div style=”font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;”><a href=”https://soundcloud.com/gustavo-ramon-ramirez-323496687″?rel=0&amp;autoplay=1 title=”Gustavo Ramon Ramirez” target=”_blank” style=”color: #cccccc; text-decoration: none;”>Gustavo Ramon Ramirez</a> · <a href=”https://soundcloud.com/gustavo-ramon-ramirez-323496687/zaki-tony-sport” title=”Zaki – Tony Sport” target=”_blank” style=”color: #cccccc; text-decoration: none;”>Zaki – Tony Sport</a></div>';

export default function BlogPage() {
  return <main id="contenido">
    <h1 className="tc-sr">Blog</h1>
    <Fila fondo="oscuro" className="wb-calidad-nosotros-blog-fila">
      <Columna ancho={{ sm: 9 }}>
        <p className="wb-texto wb-calidad-nosotros-blog-vacio">Lo sentimos, no hay publicaciones que coincidan con sus criterios.</p>
      </Columna>
      <Columna ancho={{ sm: 3 }} as="aside" className="wb-calidad-nosotros-blog-lateral">
        <section className="wb-calidad-nosotros-widget" aria-labelledby="blog-buscar">
          <h2 id="blog-buscar" className="wb-calidad-nosotros-widget-titulo">Buscar</h2>
          {/* Static mirror: the search reloads this page, which (like the official, with no posts) has no matches. */}
          <Form action="/blog/" role="search" className="wb-form wb-calidad-nosotros-buscar">
            <label className="tc-sr" htmlFor="blog-s">Buscar:</label>
            <input type="search" name="s" id="blog-s" autoComplete="off"/>
            <button type="submit" className="wb-calidad-nosotros-buscar-boton" aria-label="Buscar"><Icon name="search" size={18}/></button>
          </Form>
        </section>
        <section className="wb-calidad-nosotros-widget" aria-labelledby="blog-recientes">
          <h2 id="blog-recientes" className="wb-calidad-nosotros-widget-titulo">Artículos recientes</h2>
        </section>
        <section className="wb-calidad-nosotros-widget" aria-labelledby="blog-musica">
          <h2 id="blog-musica" className="wb-calidad-nosotros-widget-titulo">musica de fondo</h2>
          <p className="wb-calidad-nosotros-codigo">{CODIGO_MUSICA}</p>
        </section>
      </Columna>
    </Fila>
  </main>;
}
