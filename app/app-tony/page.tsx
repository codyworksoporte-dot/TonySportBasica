import type { Metadata } from 'next';
import Columna from '@/components/espejo/Columna';
import Fila from '@/components/espejo/Fila';
import Titulo from '@/components/espejo/Titulo';
import ImagenSrcset from '@/components/espejo/pedido-app/ImagenSrcset';
import UrlPartida from '@/components/espejo/pedido-app/UrlPartida';
import '@/components/espejo/pedido-app/pedido-app.css';

// Mirror of https://www.tonysportselsalvador.com/app-tony/ (three WPBakery rows: heading, Android, iOS).
export const metadata: Metadata = { title: 'App Tony' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id=com.tonysports.customer';
const APP_STORE = 'https://apps.apple.com/us/app/tony/id1528399939';
// Phone banners: full size plus the WordPress sizes of their srcset.
const variantes = (base: string) => [`${SUBIDAS}${base}-400x400.jpg`, `${SUBIDAS}${base}-768x768.jpg`];
const ANDROID = '918b8379-1d7a-457a-8405-a49a7c628184';
const IOS = '0115071f-3a32-4757-a1ec-1bc1a9db28dc';

function Premios() {
  return <>
    <p>TODAS LAS COMPRAS EN TONY TIENEN PREMIOS 🤩<br/>
      PEDI TUS PUNTOS AL COMPRAR PORQUE TENEMOS PREMIOS UNICOS PARA TU EQUIPO, QUE NO TE DAN EN NINGÚN OTRO LUGAR. 😎</p>
    <p>DESCARGA LA APP Y DESDE YA TE DAMOS PUNTOS DE BIENVENIDA! 📲</p>
  </>;
}

export default function AppTonyPage() {
  return <main id="contenido" className="wb-pedido-app">
    <Fila fondo="oscuro" sinPadding>
      <Columna>
        <Titulo nivel={1} alinear="centro" color="lima" className="wb-pedido-app-titular">DESCARGA NUESTRA APP Y GANA PREMIOS CON TONY</Titulo>
      </Columna>
    </Fila>

    <Fila fondo="oscuro" sinPadding>
      <Columna>
        <div className="wb-pedido-app-bloque wb-pedido-app-texto">
          <Premios/>
          <p>👉🏻 PARA ANDROID<br/>
            <a className="wb-pedido-app-enlace" href={GOOGLE_PLAY}><UrlPartida url={GOOGLE_PLAY}/></a></p>
          <p><ImagenSrcset url={`${SUBIDAS}${ANDROID}.jpg`} variantes={variantes(ANDROID)} className="wb-pedido-app-imagen wb-pedido-app-imagen--490"
            sizes="(max-width: 767px) calc(100vw - 90px), 490px" alt="Descarga la app para Android"/></p>
        </div>
        <span className="wb-pedido-app-espaciado" aria-hidden="true"/>
      </Columna>
    </Fila>

    <Fila fondo="oscuro" sinPadding>
      <Columna>
        <div className="wb-pedido-app-bloque wb-pedido-app-texto">
          <Premios/>
          <p>👉🏻 PARA iOS<br/>
            <a className="wb-pedido-app-enlace" href={APP_STORE}><UrlPartida url={APP_STORE}/></a></p>
          <span className="wb-pedido-app-linea" aria-hidden="true"/>
          <p><ImagenSrcset url={`${SUBIDAS}${IOS}.jpg`} variantes={variantes(IOS)} className="wb-pedido-app-imagen wb-pedido-app-imagen--532"
            sizes="(max-width: 767px) calc(100vw - 90px), 532px" alt="Descarga la app para iOS"/></p>
        </div>
      </Columna>
    </Fila>
  </main>;
}
