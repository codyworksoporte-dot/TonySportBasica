import type { Metadata } from 'next';
import Link from 'next/link';
import { Columna, Fila, Separador } from '@/components/espejo';
import ImagenPromo from '@/components/espejo/promos/ImagenPromo';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/promos/promos.css';

export const metadata: Metadata = { title: 'Patrocinio' };

// Mirror of tonysportselsalvador.com/patrocinadores/ (menu: «Patrocinio»). Six WPBakery rows: title + rule,
// three club names, their three banners, the fourth club, its banner, rule + closing text.

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const CAMISAS_OFICIALES = enlaceLocal('https://www.tonysportselsalvador.com/categoria/camisas-oficiales-de-equipos-nacionales/');
// The official link is a Bing redirect to laprimera.com.sv; kept as published (new tab, like the official).
const PRIMERA_DIVISION = 'https://www.bing.com/ck/a?!&&p=31038f52b7262b15JmltdHM9MTcwMDA5MjgwMCZpZ3VpZD0yMTBlZjQ5ZC0xYWQzLTZiZjgtMTQxOS1lN2YyMWIyZTZhMjUmaW5zaWQ9NTY3OA&ptn=3&ver=2&hsh=3&fclid=210ef49d-1ad3-6bf8-1419-e7f21b2e6a25&psq=liga+salvadore%c3%b1a&u=a1aHR0cHM6Ly9iaW5nLmNvbS9hbGluay9saW5rP3VybD1odHRwcyUzYSUyZiUyZmxhcHJpbWVyYS5jb20uc3YlMmYmc291cmNlPXNlcnAtcnImaD1jR1N3UUZ1UFdqZzkxb1lCUllJNklXZGNWT3cxMnZHJTJmeTNaNGNKNEg3cmclM2QmcD1rY29mZmNpYWx3ZWJzaXRl&ntb=1';
const FACEBOOK_TONY = 'https://www.facebook.com/profile.php?id=100085923971490';
const TAMANOS = '(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) calc(25vw - 50px), 278px';

type Club = { nombre: string; facebook: string; clase?: string; banner: string };

const CLUBES: Club[] = [
  { nombre: 'C.D Dragón', facebook: 'https://www.facebook.com/cd.dragon.slv/?locale=es_LA', banner: 'WhatsApp-Image-2024-09-28-at-11.48.03-PM' },
  { nombre: 'C.D Platense', facebook: 'https://www.facebook.com/platensezacatecoluca/?locale=es_LA', clase: 'wb-promos-club--platense', banner: 'WhatsApp-Image-2024-09-28-at-11.48.03-PM-1' },
  { nombre: 'C.D Cacahuatique', facebook: 'https://m.facebook.com/Cacahuatique/', clase: 'wb-promos-club--cacahuatique', banner: 'WhatsApp-Image-2024-09-28-at-11.48.04-PM' },
  { nombre: 'C.F Marte Soyapango', facebook: 'https://www.facebook.com/share/14FKpg8xmWp/', clase: 'wb-promos-club--marte', banner: '585b21d6-52bc-4c0f-a507-efa0ab067d7d' },
];

function NombreClub({ club }: { club: Club }) {
  return <Columna ancho={{ sm: 3 }} alinear="centro">
    <p className={`wb-promos-equipo ${club.clase ?? ''}`.trim()}><strong><a href={club.facebook}>{club.nombre}</a></strong></p>
  </Columna>;
}

function BannerClub({ club }: { club: Club }) {
  return <Columna ancho={{ sm: 3 }}>
    <Link className="wb-promos-img-enlace" href={CAMISAS_OFICIALES} prefetch={false}>
      <ImagenPromo url={`${SUBIDAS}${club.banner}.jpeg`} movil={`${SUBIDAS}${club.banner}-400x400.jpeg`} sizes={TAMANOS}
        alt={`Patrocinador oficial: Tony Sportswear x ${club.nombre}`} className="wb-promos-img"/>
    </Link>
  </Columna>;
}

export default function PatrocinadoresPage() {
  const [dragon, platense, cacahuatique, marte] = CLUBES;
  return <main id="contenido" className="wb-promos">
    <Fila sinPadding className="wb-promos-fila">
      <Columna ancho={{ sm: 12 }}>
        <h1 className="wb-promos-patro-h1">
          Tony Sportswear nos complace ser oficialmente patrocinadores de cuatro equipos de la{' '}
          <a className="wb-promos-enlace" href={PRIMERA_DIVISION} title="Primera División de El Salvador" target="_blank" rel="noopener noreferrer">
            Primera División de El Salvador<span className="tc-sr"> (se abre en otra pestaña)</span>
          </a>
        </h1>
        <Separador tipo="linea" className="wb-promos-linea"/>
      </Columna>
    </Fila>

    <Fila sinPadding pegadas className="wb-promos-fila">
      <NombreClub club={dragon}/>
      <NombreClub club={platense}/>
      <NombreClub club={cacahuatique}/>
    </Fila>

    <Fila sinPadding pegadas className="wb-promos-fila">
      <BannerClub club={dragon}/>
      <BannerClub club={platense}/>
      <BannerClub club={cacahuatique}/>
    </Fila>

    <Fila sinPadding pegadas className="wb-promos-fila">
      <NombreClub club={marte}/>
    </Fila>

    <Fila sinPadding pegadas className="wb-promos-fila">
      <BannerClub club={marte}/>
    </Fila>

    <Fila sinPadding className="wb-promos-fila">
      <Columna ancho={{ sm: 12 }}>
        <Separador tipo="linea" className="wb-promos-linea"/>
        <h3 className="wb-promos-patro-cierre">
          Estos equipos profesionales confían en nuestra marca y reputación, ofrecemos diseños únicos en el mercado
          cumpliendo los mas altos estándares de calidad en indumentaria deportiva. Si quieres ser ganador, tienes que
          estar vestido por <a className="wb-promos-enlace" href={FACEBOOK_TONY}>Tony Sportswear</a>. {'​🏆​ ​🐊​'}
        </h3>
      </Columna>
    </Fila>
  </main>;
}
