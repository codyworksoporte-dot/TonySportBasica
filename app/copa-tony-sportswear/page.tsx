import type { Metadata } from 'next';
import { Columna, Fila, Separador } from '@/components/espejo';
import ImagenPromo from '@/components/espejo/promos/ImagenPromo';
import '@/components/espejo/promos/promos.css';

export const metadata: Metadata = { title: 'Copa Tony Sportswear 🏆' };

// Mirror of tonysportselsalvador.com/copa-tony-sportswear/: one WPBakery row, the tournament poster on the
// left; on the right the call to sign up, the prizes and two inner rows («Equipos Participantes» + rule,
// then the 16 teams in two columns).

const POSTER = 'https://www.tonysportselsalvador.com/wp-content/uploads/WhatsApp-Image-2024-01-24-at-11.07.13-AM.jpeg';
const POSTER_MOVIL = 'https://www.tonysportselsalvador.com/wp-content/uploads/WhatsApp-Image-2024-01-24-at-11.07.13-AM-400x400.jpeg';
const INSCRIPCION = 'https://wa.me/50378619673';

const EQUIPOS: [string[], string[]] = [
  ['1- CFC', '2- 7 Guerreros', '3- Reborn Fc', '4- Divina Providencia', '5- Tatas Fc', '6- Red Zone', '7- Newells Fc', '8- Wolf Fc'],
  ['9- Cheros FC', '10- Aston Birria', '11- Vister Fc', '12- Jogo Bonito Fc', '13- La tricolor Fc', '14- Holsteiner', '15- Allans FC', '16- Terce Tiempo Fc'],
];

export default function CopaTonySportswearPage() {
  return <main id="contenido" className="wb-promos">
    <Fila sinPadding pegadas className="wb-promos-fila">
      <Columna ancho={{ sm: 6 }}>
        <ImagenPromo url={POSTER} movil={POSTER_MOVIL} prioridad className="wb-promos-img"
          sizes="(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) calc(50vw - 70px), 585px"
          alt="Afiche de la Copa Tony Sportswear en Gambeta: premios, inicio el 29 de enero e inscripción al 7861-9673"/>
      </Columna>
      <Columna ancho={{ sm: 6 }}>
        <div className="wb-promos-copa-texto">
          <h3 className="wb-promos-copa-h3">
            Únete a la Copa Tony en Gambeta inscribe a tu equipo al{' '}
            <strong><a className="wb-promos-copa-tel" href={INSCRIPCION}>7861-9673</a> </strong>⚽️👊🏼
          </h3>
          <p className="wb-promos-copa-inicio">INICIO 29 DE ENERO 2024</p>
          <p><strong>Premios</strong></p>
          <p>▪︎1° $900 + Trofeo + Medallas<br/>▪︎2° Uniforme Completo + Trofeo + Medallas<br/>▪︎3° Trofeo</p>
          <p><strong>Premios por jornada</strong></p>
          <p>▪︎Portero Menos Vencido<br/>▪︎Jugador de la Jornada</p>
          <p><strong>Premios individuales</strong></p>
          <p>▪︎Portero Menos Vencido del Torneo<br/>▪︎Goleador Del Torneo</p>
          <p><em>SOMOS TONY SPORTSWEAR</em></p>
          <p className="wb-promos-copa-ultimo"><em>¡SI NO LO TENEMOS, TE LO HACEMOS ! </em>🤩🐊</p>
        </div>

        <div className="wb-fila-cols wb-promos-interna">
          <Columna ancho={{ sm: 12 }}>
            <h1 className="wb-promos-copa-h1">Equipos Participantes</h1>
            <Separador tipo="linea" className="wb-promos-linea"/>
          </Columna>
        </div>

        <div className="wb-fila-cols wb-fila-cols--pegadas wb-promos-equipos">
          {EQUIPOS.map((mitad, indice) => <Columna key={indice} ancho={{ sm: 6 }}>
            <ul className="wb-promos-copa-lista">
              {mitad.map(equipo => <li key={equipo}>{equipo}</li>)}
            </ul>
          </Columna>)}
        </div>
      </Columna>
    </Fila>
  </main>;
}
