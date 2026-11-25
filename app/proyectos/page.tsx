import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Separador from '@/components/espejo/Separador';
import Titulo from '@/components/espejo/Titulo';
import TituloPagina from '@/components/espejo/TituloPagina';
import '@/components/espejo/calidad-nosotros/calidad-nosotros.css';

// Mirror of https://www.tonysportselsalvador.com/proyectos/ (title band, three placeholder projects, CTA).
// Each official project also carries an empty image gallery (<img src="">); it shows nothing there and is left out.
export const metadata: Metadata = { title: 'Proyectos' };

const PROYECTOS = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];

export default function ProyectosPage() {
  return <main id="contenido">
    <TituloPagina titulo="Proyectos" imagen="https://www.tonysportselsalvador.com/wp-content/uploads/2017/11/fondo-catalogo.jpg"/>
    <Fila fondo="oscuro" className="wb-calidad-nosotros-proyectos">
      <Columna alinear="centro">
        {PROYECTOS.map(nombre => <div key={nombre} className="wb-calidad-nosotros-proyecto">
          <Titulo nivel={2} color="lima" alinear="centro" mayusculas={false}>{nombre}</Titulo>
          <Separador tipo="corto" alinear="centro" color="lima" className="wb-calidad-nosotros-divisor-ancho"/>
          <p className="wb-texto wb-centro wb-calidad-nosotros-proyecto-texto">Descripción…</p>
        </div>)}
      </Columna>
    </Fila>
    <BandaCTA texto="Ponte en contacto con nosotros si requieres más información" boton={{ texto: 'Contáctanos', href: '/contacto/' }}/>
  </main>;
}
