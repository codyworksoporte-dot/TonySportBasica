/*
 * ArchivoTienda: the official WooCommerce shop archive (/productos/ and /productos/page/<n>/). On the official
 * site it is the same template as the category archives, so it shares their layout, card and widgets:
 * left, result count + order select, 3-column loop and pagination; right, Buscar, Categorías (top-level
 * categories, none selected), Filtrar por precio and Últimos productos añadidos. Stacked on phones (sidebar last).
 * The official page title band is hidden, so the h1 is for screen readers only.
 * Props: pagina (1–21).
 */
import Paginacion from '@/components/espejo/Paginacion';
import { opcionesCategoriaLateral, ultimoProducto } from '@/components/espejo/catalogo/datos';
import SelectorCategoriaLateral from '@/components/espejo/catalogo/SelectorCategoriaLateral';
import UltimosProductos from '@/components/espejo/catalogo/UltimosProductos';
import { ultimosProductos } from '@/lib/oficial/catalogo';
import BuscarProductos from './BuscarProductos';
import { indiceTienda, limitesDePrecio, tarjetasDe } from './datos-tienda';
import FiltroPrecio from './FiltroPrecio';
import GrillaTienda from './GrillaTienda';
import ProveedorTienda from './ProveedorTienda';
import ResultadosTienda from './ResultadosTienda';
import { paginarLista, textoConteo } from './tienda-comun';
import '@/components/espejo/catalogo/catalogo.css';
import './tienda.css';

export default function ArchivoTienda({ pagina }: { pagina: number }) {
  const lista = paginarLista(indiceTienda(), pagina);
  const precio = limitesDePrecio();
  const indiceUrl = `${process.env.TONY_ASSET_BASE || ''}/productos/indice.json`;
  return <main id="contenido" className="wb-catalogo wb-tienda">
    <h1 className="tc-sr">Productos</h1>
    <ProveedorTienda>
      <div className="wb-contenedor">
        <div className="wb-catalogo-cols">
          <div className="wb-catalogo-principal">
            <ResultadosTienda conteo={textoConteo(lista)} indiceUrl={indiceUrl}>
              <GrillaTienda productos={tarjetasDe(lista.items)} prioridad={3}/>
              <Paginacion actual={lista.pagina} total={lista.totalPaginas} base="/productos/" className="wb-catalogo-paginacion"/>
            </ResultadosTienda>
          </div>
          <aside className="wb-catalogo-lateral" aria-label="Barra lateral de la tienda">
            <BuscarProductos/>
            <SelectorCategoriaLateral opciones={opcionesCategoriaLateral(null)} actual=""/>
            {precio.min !== precio.max && <FiltroPrecio min={precio.min} max={precio.max}/>}
            <UltimosProductos items={ultimosProductos(5).map(ultimoProducto)}/>
          </aside>
        </div>
      </div>
    </ProveedorTienda>
  </main>;
}
