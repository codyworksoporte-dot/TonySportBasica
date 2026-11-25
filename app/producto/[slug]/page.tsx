import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import BotonWhatsApp from '@/components/espejo/catalogo/BotonWhatsApp';
import { disponibleParaReserva, pidePorWhatsApp, tarjetaDeProducto, tituloDeNavegacion } from '@/components/espejo/catalogo/datos';
import GaleriaProducto, { type ImagenGaleria } from '@/components/espejo/catalogo/GaleriaProducto';
import NavegacionProductos, { type ProductoVecino } from '@/components/espejo/catalogo/NavegacionProductos';
import TarjetaCatalogo from '@/components/espejo/catalogo/TarjetaCatalogo';
import {
  fotoProducto,
  localizarHtml,
  miniaturaProducto,
  precioPartes,
  producto,
  productos,
  productosRelacionados,
  rutaCategoria,
  rutaProducto,
  slugsDeProductos,
  type ProductoOficial,
} from '@/lib/oficial/catalogo';
import '@/components/espejo/catalogo/catalogo.css';

/*
 * Mirror of the official WooCommerce product page (/producto/<slug>/), reference: referencia-oficial/plantillas/
 * producto-*. Gallery + summary (title, price, short description, meta), the "Descripción" tab when the product
 * has a long description, "Productos relacionados" and the theme's previous/next product tabs. The official
 * "Añadir al carrito" form becomes "Pedir por WhatsApp" (our cart only stores configurator designs).
 */
export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return slugsDeProductos().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = producto(slug);
  // Official tab: "<Nombre> | TONY SPORTSWEAR EL SALVADOR".
  return p ? { title: p.nombre } : {};
}

const RELACIONADOS = { '--wb-g-xs': 2, '--wb-g-sm': 2, '--wb-g-md': 4, '--wb-g-lg': 4 } as CSSProperties;

function galeria(p: ProductoOficial): ImagenGaleria[] {
  return p.imagenes.flatMap((im, i) => {
    const grande = fotoProducto(p, i);
    const mini = miniaturaProducto(p, i) ?? grande;
    return grande && mini ? [{ grande, mini, alt: im.alt }] : [];
  });
}

function vecino(p: ProductoOficial | undefined): ProductoVecino | null {
  if (!p) return null;
  const imagen = miniaturaProducto(p, 0);
  return { nombre: p.nombre, titulo: tituloDeNavegacion(p.nombre), ruta: rutaProducto(p), imagen: imagen ? { src: imagen.src, w: imagen.w, h: imagen.h } : null };
}

export default async function ProductoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = producto(slug);
  if (!p) notFound();
  const precio = precioPartes(p);
  const lista = productos();
  const posicion = lista.findIndex((x) => x.id === p.id);
  const relacionados = productosRelacionados(p, 4);
  const corta = p.descripcionCorta.trim();
  const larga = p.descripcion.trim();

  return <main id="contenido" className="wb-ficha">
    <div className="wb-contenedor">
      <div className="wb-ficha-producto">
        <div className="wb-ficha-galeria">
          <GaleriaProducto imagenes={galeria(p)} nombre={p.nombre} oferta={p.enOferta}/>
        </div>
        <div className="wb-ficha-resumen">
          <h1 className="wb-ficha-titulo">{p.nombre}</h1>
          {precio.actual && <p className="wb-ficha-precio">
            {precio.anterior && <del><span className="tc-sr">Precio anterior: </span>{precio.anterior}</del>}
            <ins><span className="tc-sr">{precio.anterior ? 'Precio actual: ' : 'Precio: '}</span>{precio.actual}</ins>
          </p>}
          {corta && <div className="wb-contenido wb-ficha-html wb-ficha-corta" dangerouslySetInnerHTML={{ __html: localizarHtml(corta) }}/>}
          {pidePorWhatsApp(p) && <div className="wb-ficha-accion">
            {disponibleParaReserva(p) && <p className="wb-ficha-stock">Disponible para reserva</p>}
            <BotonWhatsApp nombre={p.nombre} precio={precio.actual} ruta={rutaProducto(p)} respaldo={p.permalink}/>
          </div>}
          <div className="wb-ficha-meta">
            {p.sku && <span>SKU: <span>{p.sku}</span></span>}
            {p.categorias.length > 0 && <span>{p.categorias.length > 1 ? 'Categorías:' : 'Categoría:'}{' '}
              {p.categorias.map((c, i) => <span key={c.id}>{i > 0 && ', '}<Link href={rutaCategoria(c.slug)} prefetch={false} rel="tag">{c.nombre}</Link></span>)}
            </span>}
            {p.etiquetas.length > 0 && <span>{p.etiquetas.length > 1 ? 'Etiquetas:' : 'Etiqueta:'} {p.etiquetas.map((t) => t.nombre).join(', ')}</span>}
          </div>
        </div>
      </div>

      {larga && <section className="wb-ficha-pestanas" aria-labelledby="wb-ficha-t-descripcion">
        <h2 className="wb-ficha-pestana" id="wb-ficha-t-descripcion">Descripción</h2>
        <div className="wb-contenido wb-ficha-html wb-ficha-panel" dangerouslySetInnerHTML={{ __html: localizarHtml(larga) }}/>
      </section>}

      {relacionados.length > 0 && <section className="wb-ficha-relacionados" aria-labelledby="wb-ficha-t-relacionados">
        <h2 className="wb-ficha-relacionados-titulo" id="wb-ficha-t-relacionados">Productos relacionados</h2>
        <ul className="wb-productos" style={RELACIONADOS}>
          {relacionados.map((r) => <li key={r.id} className="wb-productos-item"><TarjetaCatalogo item={tarjetaDeProducto(r)} nivel={3}/></li>)}
        </ul>
      </section>}
    </div>
    <NavegacionProductos anterior={vecino(lista[posicion + 1])} siguiente={posicion > 0 ? vecino(lista[posicion - 1]) : null}/>
  </main>;
}
