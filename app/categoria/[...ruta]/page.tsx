import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArchivoCatalogo from '@/components/espejo/catalogo/ArchivoCatalogo';
import { opcionesCategoriaLateral, segmentosDeCategoria, tarjetaDeProducto, ultimoProducto } from '@/components/espejo/catalogo/datos';
import SelectorCategoriaLateral from '@/components/espejo/catalogo/SelectorCategoriaLateral';
import UltimosProductos from '@/components/espejo/catalogo/UltimosProductos';
import BuscarProductos from '@/components/espejo/tienda/BuscarProductos';
import { categoriaPorRuta, categorias, localizarHtml, paginar, paginasDeCategorias, productosDeCategoria, rangoDePrecios, rutaCategoria, ultimosProductos } from '@/lib/oficial/catalogo';
import '@/components/espejo/catalogo/catalogo.css';

/*
 * Mirror of the official WooCommerce category archives (/categoria/<slug>/ and /page/<n>/), reference:
 * referencia-oficial/plantillas/categoria-* and principales/rse-tony. Subcategories also answer at the official
 * nested path (/categoria/<padre>/<hija>/), showing the same archive. The theme's title bar (breadcrumbs + h1) is
 * hidden on the official site, so the h1 is only for assistive technology.
 */
export const dynamicParams = false;

type Params = { ruta: string[] };

export function generateStaticParams(): Params[] {
  const planas = paginasDeCategorias().map(({ slug, pagina }) => ({ ruta: pagina > 1 ? [slug, 'page', String(pagina)] : [slug] }));
  const anidadas = categorias()
    .filter((c) => c.padre !== 0)
    .flatMap((c) => {
      const segmentos = segmentosDeCategoria(c);
      if (segmentos.length < 2) return [];
      const total = paginar(productosDeCategoria(c.slug)).totalPaginas;
      return Array.from({ length: total }, (_, i) => ({ ruta: i > 0 ? [...segmentos, 'page', String(i + 1)] : segmentos }));
    });
  return [...planas, ...anidadas];
}

function resolver(ruta: string[]) {
  const encontrada = categoriaPorRuta(ruta);
  if (!encontrada) return null;
  const lista = productosDeCategoria(encontrada.categoria.slug);
  const { totalPaginas } = paginar(lista);
  if (encontrada.pagina > totalPaginas) return null;
  return { ...encontrada, lista, totalPaginas };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ruta } = await params;
  const datos = resolver(ruta);
  if (!datos) return {};
  // Official tab: "<Nombre> | Categorías del producto | TONY SPORTSWEAR EL SALVADOR[ | Page N]" (the page number
  // goes after the site name, so pages > 1 skip the layout's title template).
  const titulo = `${datos.categoria.nombre} | Categorías del producto`;
  return { title: datos.pagina > 1 ? { absolute: `${titulo} | TONY SPORTSWEAR EL SALVADOR | Page ${datos.pagina}` } : titulo };
}

function descripcionHtml(html: string): string {
  const limpio = html.trim();
  if (!limpio) return '';
  return localizarHtml(/^<(p|div|ul|ol|h\d|figure|table)\b/i.test(limpio) ? limpio : `<p>${limpio}</p>`);
}

export default async function CategoriaPage({ params }: { params: Promise<Params> }) {
  const { ruta } = await params;
  const datos = resolver(ruta);
  if (!datos) notFound();
  const { categoria, pagina, lista } = datos;
  const rango = rangoDePrecios(lista);
  const descripcion = pagina === 1 ? descripcionHtml(categoria.descripcion) : '';

  // data-categoria: the footer's «Explora nuestras categorías» preselects it, as on the official site.
  return <main id="contenido" className="wb-catalogo" data-categoria={categoria.slug}>
    <h1 className="tc-sr">{categoria.nombre}</h1>
    <div className="wb-contenedor">
      <ArchivoCatalogo key={ruta.join('/')}
        items={lista.map(tarjetaDeProducto)}
        pagina={pagina}
        base={rutaCategoria(categoria)}
        rango={rango.min === rango.max ? null : { min: rango.min, max: rango.max }}
        etiqueta={`Productos de ${categoria.nombre}`}
        cabecera={descripcion ? <div className="wb-contenido wb-catalogo-descripcion" dangerouslySetInnerHTML={{ __html: descripcion }}/> : null}
        lateralArriba={<>
          {/* Like the official product search, it opens the results in the shop template (/productos/?s=). */}
          <BuscarProductos/>
          <SelectorCategoriaLateral opciones={opcionesCategoriaLateral(categoria)} actual={categoria.slug}/>
        </>}
        lateralAbajo={<UltimosProductos items={ultimosProductos(5).map(ultimoProducto)}/>}
      />
    </div>
  </main>;
}
