import type { Metadata } from 'next';
import Link from 'next/link';
import Boton from '@/components/espejo/Boton';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/tienda/tienda.css';

// Official «TIENDA EN LINEA»: one row of three columns (picture + button). Its title band is hidden on the
// official site, so the h1 is for screen readers. Only the first picture is a link, as on the official.
// On phones the columns stack with no gap: each picture starts right under the previous button.
export const metadata: Metadata = { title: 'TIENDA EN LINEA' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const CATEGORIA = 'https://www.tonysportselsalvador.com/categoria/';

const COLUMNAS = [
  { imagen: `${SUBIDAS}4-Equipos-LMF-copia-1-600x380.png`, alt: 'Camisas oficiales de equipos nacionales', enlazada: true, boton: 'Camisas oficiales de equipos Nacionales', href: `${CATEGORIA}camisas-oficiales-de-equipos-nacionales/`, tamano: 'sm' as const },
  { imagen: `${SUBIDAS}Jersey-Web-600x380.png`, alt: 'Jerseys de fútbol', enlazada: false, boton: 'Jerseys de fútbol Selección VARIEDAD', href: `${CATEGORIA}jerseys-de-futbol/`, tamano: 'md' as const },
  { imagen: `${SUBIDAS}Implementos-deportivos-Web-600x380.png`, alt: 'Implementos deportivos', enlazada: false, boton: 'Implementos Deportivos VARIEDAD', href: `${CATEGORIA}implementos-deportivos/`, tamano: 'md' as const },
];

export default function TiendaEnLinea() {
  return <main id="contenido" className="wb-tel">
    <h1 className="tc-sr">TIENDA EN LINEA</h1>
    <Fila sinPadding pegadas>
      {COLUMNAS.map((c, i) => <Columna key={c.href} ancho={{ sm: 4 }}>
        <div className="wb-tel-figura">
          {c.enlazada
            ? <Link href={enlaceLocal(c.href)} prefetch={false} className="wb-tel-enlace"><ImagenOficial url={c.imagen} alt={c.alt} prioridad={i === 0} ancho={600} alto={380}/></Link>
            : <ImagenOficial url={c.imagen} alt={c.alt} prioridad ancho={600} alto={380}/>}
        </div>
        <Boton href={enlaceLocal(c.href)} tamano={c.tamano} flecha={false} className="wb-tel-boton">{c.boton}</Boton>
      </Columna>)}
    </Fila>
  </main>;
}
