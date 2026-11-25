/*
 * ArchivoTienda: the official WooCommerce shop archive (/productos/ and /productos/page/<n>/).
 * Left (3/4): result count + order select, 3-column product loop, pagination. Right (1/4): sidebar with
 * Buscar, Categorías, Filtrar por precio and Últimos productos añadidos. Stacked on phones (sidebar last).
 * The official page title band is hidden, so the h1 is for screen readers only.
 * Props: pagina (1–21).
 */
import Paginacion from '@/components/espejo/Paginacion';
import BuscarProductos from './BuscarProductos';
import CategoriasTienda from './CategoriasTienda';
import { categoriasDelLateral, indiceTienda, limitesDePrecio, tarjetasDe, ultimosDelLateral } from './datos-tienda';
import FiltroPrecio from './FiltroPrecio';
import GrillaTienda from './GrillaTienda';
import ProveedorTienda from './ProveedorTienda';
import ResultadosTienda from './ResultadosTienda';
import { paginarLista, textoConteo } from './tienda-comun';
import UltimosProductos from './UltimosProductos';
import './tienda.css';

export default function ArchivoTienda({ pagina }: { pagina: number }) {
  const lista = paginarLista(indiceTienda(), pagina);
  const precio = limitesDePrecio();
  const indiceUrl = `${process.env.TONY_ASSET_BASE || ''}/productos/indice.json`;
  return <main id="contenido" className="wb-tienda">
    <h1 className="tc-sr">Productos</h1>
    <ProveedorTienda>
      <div className="wb-contenedor wb-tienda-cols">
        <div className="wb-tienda-principal">
          <ResultadosTienda conteo={textoConteo(lista)} indiceUrl={indiceUrl}>
            <GrillaTienda productos={tarjetasDe(lista.items)} prioridad={3}/>
            <Paginacion actual={lista.pagina} total={lista.totalPaginas} base="/productos/" className="wb-tienda-paginacion"/>
          </ResultadosTienda>
        </div>
        <aside className="wb-tienda-lateral" aria-label="Barra lateral de la tienda">
          <section className="wb-tienda-widget" aria-labelledby="wb-tienda-t-buscar">
            <h2 id="wb-tienda-t-buscar" className="wb-tienda-widget-titulo"><span>Buscar</span></h2>
            <BuscarProductos/>
          </section>
          <section className="wb-tienda-widget" aria-labelledby="wb-tienda-t-categorias">
            <h2 id="wb-tienda-t-categorias" className="wb-tienda-widget-titulo"><span>Categorías</span></h2>
            <CategoriasTienda opciones={categoriasDelLateral()} idTitulo="wb-tienda-t-categorias"/>
          </section>
          <section className="wb-tienda-widget" aria-labelledby="wb-tienda-t-precio">
            <h2 id="wb-tienda-t-precio" className="wb-tienda-widget-titulo"><span>Filtrar por precio</span></h2>
            <FiltroPrecio min={precio.min} max={precio.max}/>
          </section>
          <section className="wb-tienda-widget" aria-labelledby="wb-tienda-t-ultimos">
            <h2 id="wb-tienda-t-ultimos" className="wb-tienda-widget-titulo"><span>Últimos productos añadidos</span></h2>
            <UltimosProductos productos={ultimosDelLateral(5)}/>
          </section>
        </aside>
      </div>
    </ProveedorTienda>
  </main>;
}
