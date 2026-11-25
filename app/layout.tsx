import type { Metadata } from 'next';
import localFont from 'next/font/local';
import AccountProvider from '@/components/AccountProvider';
import CartFeedback from '@/components/CartFeedback';
import LagartoIntroBootstrap from '@/components/LagartoIntroBootstrap';
import LagartoIntro from '@/components/LagartoIntro';
import RouteTransition from '@/components/RouteTransition';
import './globals.css';
import '@/components/buttons.css';
import '@/components/section-images.css';
import '@/components/mobile-refinements.css';
import './tony-c.css';
import './espejo.css';
// The mirror's components come after the global skin, so their stylesheets win ties with espejo.css.
import BarraSuperior from '@/components/espejo/BarraSuperior';
import Cabecera from '@/components/espejo/Cabecera';
import { ProveedorCarritoEspejo } from '@/components/espejo/CarritoEstado';
import Flotantes from '@/components/espejo/Flotantes';
import Pie from '@/components/espejo/Pie';
import PreferenciaEfectos from '@/components/espejo/PreferenciaEfectos';
import { audioLocalDelPie } from '@/components/espejo/medios-servidor';

// Display: Barlow Condensed (official Montserrat headings and menu); 600 stands in for Montserrat Regular.
const display=localFont({src:[
  {path:'../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2',weight:'500',style:'normal'},
  {path:'../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',weight:'600',style:'normal'},
  {path:'../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2',weight:'700',style:'normal'},
  {path:'../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-italic.woff2',weight:'700',style:'italic'},
],variable:'--font-display',display:'swap'});
// Text: Archivo (official Lato).
const archivo=localFont({src:[
  {path:'../node_modules/@fontsource/archivo/files/archivo-latin-400-normal.woff2',weight:'400',style:'normal'},
  {path:'../node_modules/@fontsource/archivo/files/archivo-latin-400-italic.woff2',weight:'400',style:'italic'},
  {path:'../node_modules/@fontsource/archivo/files/archivo-latin-500-normal.woff2',weight:'500',style:'normal'},
  {path:'../node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff2',weight:'600',style:'normal'},
  {path:'../node_modules/@fontsource/archivo/files/archivo-latin-700-normal.woff2',weight:'700',style:'normal'},
],variable:'--font-body',display:'swap'});

export const metadata: Metadata={
  // Same tab title format as the official site: "Patrocinio | TONY SPORTSWEAR EL SALVADOR".
  title:{default:'TONY SPORTSWEAR EL SALVADOR',template:'%s | TONY SPORTSWEAR EL SALVADOR'},
  description:'SI NO LO TENEMOS, TE LO HACEMOS',
  robots:{index:false,follow:false},
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="es" data-scroll-behavior="smooth" className={`${display.variable} ${archivo.variable}`}>
    <head><LagartoIntroBootstrap/></head>
    <body>
      <AccountProvider>
        <ProveedorCarritoEspejo>
          <a className="skip-link" href="#contenido">Saltar al contenido</a>
          <BarraSuperior/>
          <Cabecera/>
          <CartFeedback/>
          {children}
          <Pie audio={audioLocalDelPie()}/>
          <Flotantes/>
        </ProveedorCarritoEspejo>
        <LagartoIntro/>
        <RouteTransition/>
        <PreferenciaEfectos/>
      </AccountProvider>
    </body>
  </html>;
}
