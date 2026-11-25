/*
 * Pie: the official footer. Three columns (contact + audio player, category dropdown, about us with our
 * crocodile drawing in place of the old logo) and the copyright bar. Categories come from
 * data/oficial/categorias.json in the official widget's order.
 * Props: audio?: AudioPie | string | null — local audio (app/layout.tsx passes audioLocalDelPie(), read
 * from data/oficial/medios.json); without it the player is not shown.
 */
import Icon from '@/components/Icon';
import type { AudioPie } from './medios-servidor';
import { TonyBadge } from '@/components/TonyArt';
import categoriasJson from '@/data/oficial/categorias.json';
import { siteAsset } from '@/lib/asset-path';
import { PIE } from '@/lib/oficial/menu';
import IconoEspejo from './Iconos';
import ReproductorAudio from './ReproductorAudio';
import SelectorCategorias, { type OpcionCategoria } from './SelectorCategorias';
import './espejo-chrome.css';

type Categoria = { id: number; name: string; slug: string; parent: number };

const ENTIDADES: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
const decodificar = (texto: string) => texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entera, cuerpo: string) => {
  if (cuerpo[0] !== '#') return ENTIDADES[cuerpo.toLowerCase()] ?? entera;
  const codigo = cuerpo[1].toLowerCase() === 'x' ? parseInt(cuerpo.slice(2), 16) : parseInt(cuerpo.slice(1), 10);
  return Number.isFinite(codigo) ? String.fromCodePoint(codigo) : entera;
});

/** Same order as the official widget: alphabetical (as the API lists them), each parent followed by its children. */
function opcionesCategorias(): OpcionCategoria[] {
  const lista = (categoriasJson as { categories: Categoria[] }).categories;
  const ids = new Set(lista.map(c => c.id));
  const hijos = new Map<number, Categoria[]>();
  for (const c of lista) {
    const padre = ids.has(c.parent) ? c.parent : 0;
    hijos.set(padre, [...(hijos.get(padre) ?? []), c]);
  }
  const salida: OpcionCategoria[] = [];
  const visitar = (padre: number, nivel: number) => {
    for (const c of hijos.get(padre) ?? []) {
      salida.push({ slug: c.slug, nombre: decodificar(c.name), nivel });
      visitar(c.id, nivel + 1);
    }
  };
  visitar(0, 0);
  return salida;
}

export default function Pie({ audio }: { audio?: AudioPie | string | null }) {
  const { informacion: info, categorias, nosotros, barra } = PIE;
  const anio = new Date().getFullYear();
  const sonido = typeof audio === 'string' ? { src: audio } : audio;
  return <footer className="wb-pie">
    <div className="wb-contenedor wb-pie-cols">
      <section className="wb-pie-col" aria-labelledby="wb-pie-t-info">
        <h2 id="wb-pie-t-info" className="wb-pie-titulo">{info.titulo}</h2>
        <div className="wb-pie-texto">
          <p>{info.texto}</p>
          <p>
            {info.contactoIntro}<br/>
            <span className="wb-pie-dato"><Icon name="whatsapp-solid" size={16}/><strong>{info.whatsapp.etiqueta}</strong> {info.whatsapp.texto}</span><br/>
            <span className="wb-pie-dato"><IconoEspejo nombre="correo" size={16}/><strong>{info.correo.etiqueta}</strong> <a href={info.correo.href}>{info.correo.texto}</a></span>
          </p>
          <p><em>{info.lema}</em></p>
        </div>
        {sonido && <ReproductorAudio src={sonido.src} tipo={sonido.tipo} duracion={sonido.duracion} etiqueta={sonido.etiqueta}/>}
      </section>
      <section className="wb-pie-col" aria-labelledby="wb-pie-t-cat">
        <h2 id="wb-pie-t-cat" className="wb-pie-titulo">{categorias.titulo}</h2>
        <SelectorCategorias opciones={opcionesCategorias()} placeholder={categorias.placeholder} idTitulo="wb-pie-t-cat"/>
      </section>
      <section className="wb-pie-col" aria-labelledby="wb-pie-t-nos">
        <h2 id="wb-pie-t-nos" className="wb-pie-titulo">{nosotros.titulo}</h2>
        <div className="wb-pie-texto">
          <p>{nosotros.texto}</p>
          <p>{nosotros.contacto}</p>
        </div>
        <div className="wb-pie-dibujo" style={{ backgroundImage: `url("${siteAsset('/assets/escamas-tony-base.webp')}")` }}>
          <TonyBadge className="wb-pie-insignia" sizes="(max-width: 767px) 240px, 290px"/>
        </div>
      </section>
    </div>
    <div className="wb-pie-barra">
      <div className="wb-contenedor wb-pie-barra-in">
        <a className="wb-pie-social" href={barra.facebook.href} target="_blank" rel="noopener noreferrer" aria-label={`${barra.facebook.etiqueta} (se abre en otra pestaña)`}>
          <IconoEspejo nombre="facebook" size={18}/>
        </a>
        <p className="wb-pie-copy">{barra.copyright} {anio} <u>{barra.dominio}</u>{barra.derechos}</p>
      </div>
    </div>
  </footer>;
}
