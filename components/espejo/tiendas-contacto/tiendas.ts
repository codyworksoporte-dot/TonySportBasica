/*
 * The 14 stores of the official /nuestras-tiendas/ page, in its order, with its literal texts and links
 * (referencia-oficial/principales/nuestras-tiendas). Each official row: picture + video (left column),
 * heading, divider, text, contact lines and Google map (right column).
 * Official quirks kept on purpose: link colours (green or white), links that open a new tab or not, the San
 * Vicente "+503" linking to another number and the e-mails whose mailto differs from the visible address.
 */
import type { LineaRed, ParteRed } from './EnlacesRedes';

export type Tienda = {
  id: string;
  /** Heading as the official DOM has it (the theme shows it in capitals). */
  titulo: string;
  /** Official h1 36 px ('grande') or h2 27 px ('mediano'). */
  tamano: 'grande' | 'mediano';
  alinear: 'centro' | 'izquierda';
  /** Heading with the theme's .titulo-servicio: 20 px above it on phones. */
  margenMovil: boolean;
  divisor: 'corto' | 'medio' | 'fino';
  /** Official picture (old logo on leather, replaced by LogoTienda): URL and natural size. */
  imagen: { url: string; ancho: number; alto: number };
  /** Official .mp4 and its player box at 1440 px. */
  video?: { url: string; ancho: number; alto: number };
  /** Empty space the official leaves under the left column (px). */
  espacioIzquierda: number;
  descripcion: string;
  invitacion: string;
  redes: LineaRed[];
  /** Google Maps embed (600 px wide on the official) and its height. */
  mapa?: { src: string; alto: number };
  /** Space below the row: 70 px (rows with vc_custom margin) or 35 px. */
  separacion: 'amplia' | 'normal';
};

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';
const INSTAGRAM_TONY = 'https://instagram.com/tonysportwear?igshid=NTc4MTIwNjQ2YQ==';
const UNO = 'Te invitamos a ingresar a cada uno de nuestras redes sociales:';
const UNA = 'Te invitamos a ingresar a cada una de nuestras redes sociales:';

const linea = (icono: LineaRed['icono'], etiqueta: string, ...enlaces: ParteRed[]): LineaRed => ({ icono, partes: [{ texto: etiqueta, negrita: true }, ...enlaces] });
const verde = (texto: string, href: string, extra: Partial<ParteRed> = {}): ParteRed => ({ texto, href, lima: true, ...extra });
const blanco = (texto: string, href: string, extra: Partial<ParteRed> = {}): ParteRed => ({ texto, href, ...extra });
const mapa = (pb: string, alto = 265) => ({ src: `https://www.google.com/maps/embed?pb=${pb}`, alto });

export const TIENDAS: Tienda[] = [
  {
    id: 'san-salvador',
    titulo: 'TONY SPORTSWEAR SAN SALVADOR', tamano: 'grande', alinear: 'centro', margenMovil: true, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.35-PM-3-1.jpeg`, ancho: 1254, alto: 799 },
    video: { url: `${SUBIDAS}San-salvaador.mp4`, ancho: 500, alto: 281.25 }, espacioIzquierda: 0,
    descripcion: 'Somos la mejor calidad de uniformes de todo el País. Estamos ubicados en Avenida Bernal, a solo 100 metros abajo del Hospital Militar.',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', blanco('Google maps', 'https://maps.app.goo.gl/uuMdZmDrz8aExsEW7', { negrita: true })),
      linea('facebook', 'Facebook:', verde('TonySport El Salvador', 'https://www.facebook.com/Tony-sportswear-San-Salvador-104356981384529/', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport El Salvador', 'https://instagram.com/tonysportswearsansalvador?igshid=17u63d7f8ewvd', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('7865-2339', 'https://wa.me/50370155571', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendaavenidabernal@tonysportselsalvador.com', 'mailto:tiendaavenidabernal@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m23!1m12!1m3!1d2586.9129977555835!2d-89.21665456431457!3d13.71905523350452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x8f63311d9d888521%3A0x9b37bdb4612747ed!2sTony%20Sports%2C%20Urbanizaci%C3%B3n%20Altos%20de%20San%20Luis%20II%2C%20Av.%20Bernal%20casa%205%2C%20San%20Salvador!3m2!1d13.720563499999999!2d-89.21659489999999!5e0!3m2!1ses-419!2ssv!4v1696959153866!5m2!1ses-419!2ssv'),
    separacion: 'amplia',
  },
  {
    id: 'santa-tecla',
    titulo: 'TONY SPORTSWEAR SANTA TECLA', tamano: 'grande', alinear: 'centro', margenMovil: true, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.19-PM-1-1.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}Santa-tecla.mp4`, ancho: 500, alto: 281.25 }, espacioIzquierda: 0,
    descripcion: 'Somos la mejor calidad de uniformes de todo el País. Estamos ubicados en Plaza Novocentro Local #35 Santa Tecla, a solo 2 cuadras del parque Daniel Hernández.',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/F9E21mVsLzLQ4MPy9', { nueva: true })),
      linea('facebook', 'Facebook:', verde('TonySport Santa Tecla', 'https://www.facebook.com/profile.php?id=100085809046172', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport Santa Tecla', 'https://instagram.com/tonysportswearsantatecla?igshid=gcnd7l3cezqx', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('7048-9520', 'https://api.whatsapp.com/send?phone=50370489520', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendasantatecla@tonysportselsalvador.com', 'mailto:Tiendasantatecla@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m21!1m12!1m3!1d407.4930403254156!2d-89.29167436841989!3d13.673021733925093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e0!4m0!4m3!3m2!1d13.6731023!2d-89.2915103!5e0!3m2!1ses-419!2ssv!4v1696959949986!5m2!1ses-419!2ssv'),
    separacion: 'amplia',
  },
  {
    id: 'santa-ana',
    titulo: 'TONY SPORTSWEAR SANTA ANA', tamano: 'grande', alinear: 'izquierda', margenMovil: true, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.19-PM.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2020-06-11-at-13.16.15.mp4`, ancho: 500, alto: 366.25 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear  Santa Ana Somos una empresa de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados en Av. independencia sur entre 31 y 33 calle poniente, 200 metros abajo de Metrocentro y media cuadra abajo de gasolinera UNO. Plaza Belén, segunda planta. Santa Ana.',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', blanco('Google maps', 'https://maps.app.goo.gl/ymZJvoFke2xXKknC6')),
      linea('facebook', 'Facebook:', verde('TonySport Santa Ana', 'https://www.facebook.com/Tony-sportswear-Santa-ana-223042552468175/', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport Santa Ana', 'https://instagram.com/tonysportswearsanta?igshid=1ap9jj10fcnf3', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('7619-0612', 'https://api.whatsapp.com/send?phone=50376190612', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendasantaana@tonysportselsalvador.com', 'mailto:tiendasantaana@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m17!1m8!1m3!1d241.9779941125778!2d-89.5600966!3d13.9795512!3m2!1i1024!2i768!4f13.1!4m6!3e0!4m0!4m3!3m2!1d13.9795374!2d-89.56006889999999!5e0!3m2!1ses-419!2ssv!4v1696959697746!5m2!1ses-419!2ssv'),
    separacion: 'amplia',
  },
  {
    id: 'san-miguel',
    titulo: 'TONY SPORTSWEAR SAN MIGUEL', tamano: 'grande', alinear: 'centro', margenMovil: true, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.20-PM-2.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2023-10-17-at-4.55.19-PM.mp4`, ancho: 585, alto: 321.75 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear  San Miguel Somos una empresa de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: FRENTE A SUPER SELECTOS DEL CENTRO8va calle poniente #305 Local #2 barrio San Felipe, San Miguel',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://goo.gl/maps/sSw5AVgG7pWfXYTz5', { nueva: true })),
      linea('facebook', 'Facebook:', verde('TonySport San Miguel', 'https://www.facebook.com/profile.php?id=100086153911870', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport San Miguel', 'https://www.instagram.com/tonysportswearsanmiguel/', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', blanco('+503 7656-5837', 'http://api.whatsapp.com/send?phone=50376565837', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendasanmiguel@tonysportselsalvador.com', 'mailto:Tiendasanmiguel@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m14!1m8!1m3!1d476.13772671871834!2d-88.1795976!3d13.4847037!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f7b2b335da14b85%3A0x2d19f2c068e56297!2sTONY%20SPORTSWEAR%20SAN%20MIGUEL!5e1!3m2!1ses!2spe!4v1615403200356!5m2!1ses!2spe'),
    separacion: 'amplia',
  },
  {
    id: 'usulutan',
    titulo: 'TONY SPORTSWEAR USULUTAN', tamano: 'grande', alinear: 'izquierda', margenMovil: false, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.20-PM-3.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}USULUTAN.mp4`, ancho: 585, alto: 329.06 }, espacioIzquierda: 75,
    descripcion: 'Somos Tony Sportswear   usulutan una empresa de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: CARRETERA LITORAL HACIA USULUTAN FRENTE A MAXI DESPENSA SEGUNDO NIVEL A SOLO 2 CUADRAS ANTES DE LLEGAR AL CENTRO DE USULUTAN',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://goo.gl/maps/NxioMXhHDAE8WPbb7', { nueva: true })),
      linea('facebook', 'Facebook:', verde('TonySport wear Usulutan', 'https://www.facebook.com/Tony-Sportswear-Usulutan-103160555589254', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport Usulutan', 'https://www.instagram.com/tonysportswearusulutan2022/', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', blanco('+503 7008-3267', 'https://wa.me/message/TAXZK4OUKU5VP1', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendausulutan@tonysportselsalvador.com', 'mailto:Tiendausulutan@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m14!1m8!1m3!1d242.6320558427816!2d-88.43173546344741!3d13.343252945684279!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f7b3952ab5c85bf%3A0x239520a680b5b6d6!2sTonysports%20Wear%20Usulut%C3%A1n!5e0!3m2!1ses-419!2ssv!4v1696960618020!5m2!1ses-419!2ssv'),
    separacion: 'normal',
  },
  {
    id: 'sonsonate',
    titulo: 'TONY SPORTSWEAR SONSONATE', tamano: 'grande', alinear: 'centro', margenMovil: false, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.51-PM.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}sonsonate.mp4`, ancho: 585, alto: 328.04 }, espacioIzquierda: 75,
    descripcion: 'Somos Tony Sportswear  Sonsonate  una empresa de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: Bulevar las Palmeras, reparto Santa Marta sobre la 3ra calle Sonsonate, Local No.3 Frente a Ferrocentro Sonsonate.',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://goo.gl/maps/oiz2hwst1P1SynC29', { nueva: true })),
      linea('facebook', 'Facebook:', verde('TonySport wear Sonsonate', 'https://www.facebook.com/Tony-Sportswear-Sonsonate-102903065915752', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySport Sonsonate', 'https://www.instagram.com/tonysportswearusulutan2022/', { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', blanco('+503 6980-0015', 'https://wa.me/message/55M6TCK4IXCLF1', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendasonsonate@tonysportselsalvador.com', 'mailto:Tiendausulutan@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m18!1m12!1m3!1d242.24507093218682!2d-89.7188352401405!3d13.72322440931123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f62b7cf6406e33d%3A0xf9c7f1fa72770661!2sTONY%20SPORTSWEAR%20SONSONATE!5e0!3m2!1ses!2ssv!4v1696960719952!5m2!1ses!2ssv'),
    separacion: 'normal',
  },
  {
    id: 'zacatecoluca',
    titulo: 'TONY SPORTSWEAR LA ZACATECOLUCA', tamano: 'grande', alinear: 'centro', margenMovil: false, divisor: 'corto',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.35-PM.jpeg`, ancho: 1254, alto: 801 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2023-08-17-at-5.21.03-PM-1.mp4`, ancho: 585, alto: 331.13 }, espacioIzquierda: 75,
    descripcion: 'Somos Tony Sportswear   Zacatecoluca   una empresa de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: ESTAMOS EN CALLE VIEJA ZACATECOLUCA UNA CUADRA ANTES DEL MINISTERIO DE HACIENDA.',
    invitacion: UNO,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://goo.gl/maps/8AUZzVHquS4wMghU9', { nueva: true })),
      linea('facebook', 'Facebook:', verde('TonySport wear Zacatecoluca', 'https://www.facebook.com/profile.php?id=100095678616067&sk=reels_tab', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', blanco('+503 7604-0678', 'https://wa.me/50376043099', { nueva: true })),
      linea('correo', 'E-mail:', verde('Tiendzacatecoluca@tonysportselsalvador.com', 'mailto:Tiendalaunion@tonysportselsalvador.com')),
    ],
    mapa: mapa('!1m18!1m12!1m3!1d407.78466905259694!2d-88.86839978589815!3d13.503437296814848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f7cad80a0769cdb%3A0xb776410ab7ffb8d0!2sTony%20Sportswear%20Zacatecoluca!5e0!3m2!1ses!2ssv!4v1696960806926!5m2!1ses!2ssv'),
    separacion: 'normal',
  },
  {
    id: 'el-triunfo',
    titulo: 'TONY SPORTSWEAR EL TRIUNFO', tamano: 'grande', alinear: 'centro', margenMovil: false, divisor: 'medio',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.20-PM-1.jpeg`, ancho: 1254, alto: 801 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2023-10-17-at-1.52.48-PM.mp4`, ancho: 585, alto: 329.06 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear El Triunfo, una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: EN PLAZA DOWNTOWN LOCAL #1, EL TRIUNFO .',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/4zo6Hojc3PyJe9ccA')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear El Triunfo', 'https://www.facebook.com/profile.php?id=61551211297631', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 7048-9452', 'https://api.whatsapp.com/send/?phone=50370489452&text&type=phone_number&app_absent=0', { negrita: true })),
    ],
    mapa: mapa('!1m14!1m8!1m3!1d969.6589073707248!2d-88.43069899010987!3d13.557929738628408!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f64cb594a169b89%3A0xdb9fc6c1afa97d74!2sTONY%20SPORTSWEAR%20EL%20TRIUNFO!5e0!3m2!1ses!2ssv!4v1697035311450!5m2!1ses!2ssv'),
    separacion: 'normal',
  },
  {
    id: 'santa-rosa-de-lima',
    titulo: 'Tony Sportswear Santa Rosa de Lima', tamano: 'grande', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.35-PM-5.jpeg`, ancho: 1254, alto: 801 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2024-02-21-at-1.29.41-AM.mp4`, ancho: 585, alto: 329.75 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear Santa Rosa de Lima, somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos Ubicados: EN PLAZA SANTA ROSA, SEGUNDO NIVEL LOCAL 9 Y 10 .',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/pQpSNFcy915XJdS47')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear Santa Rosa de Lima', 'https://www.facebook.com/profile.php?id=100095500545490', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 7048-9275', 'https://api.whatsapp.com/send/?phone=50370489275&text&type=phone_number&app_absent=0', { negrita: true })),
    ],
    mapa: mapa('!1m18!1m12!1m3!1d3877.47223092805!2d-87.8924182!3d13.6290138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f653767af67fb0b%3A0x48e3c90928b3dc5e!2sPLAZA%20SANTA%20ROSA!5e0!3m2!1ses!2ssv!4v1708522773522!5m2!1ses!2ssv', 450),
    separacion: 'normal',
  },
  {
    id: 'chapeltique',
    titulo: 'Tony Sportswear Chapeltique', tamano: 'mediano', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.20-PM-3-1.jpeg`, ancho: 1254, alto: 800 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2024-09-25-at-9.39.12-AM.mp4`, ancho: 585, alto: 331.5 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear Chapeltique, somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Estamos ubicados en: 1ra avenida sur, Plaza Centro segundo nivel ,chapeltique. San Miguel.',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/79g92NUuW8WzLLv6A')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear Chapeltique', 'https://www.facebook.com/profile.php?id=61565175221973&mibextid=ZbWKwL', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 7950 5764', 'https://api.whatsapp.com/send/?phone=50379505764&text&type=phone_number&app_absent=0', { negrita: true })),
    ],
    mapa: mapa('!1m17!1m12!1m3!1d3877.365570628623!2d-88.26635062491182!3d13.635512586744332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDM4JzA3LjkiTiA4OMKwMTUnNDkuNiJX!5e0!3m2!1ses!2ssv!4v1727279755314!5m2!1ses!2ssv', 450),
    separacion: 'normal',
  },
  {
    id: 'san-vicente',
    titulo: 'Tony Sportswear San Vicente', tamano: 'mediano', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.35-PM-1.jpeg`, ancho: 1254, alto: 799 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2024-11-01-at-5.57.42-PM.mp4`, ancho: 585, alto: 331.5 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear San Vicente, somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad. Plaza San Carlos Primer Nivel, frente a Centro Judicial , San Vicente.',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/TdCMJRfihiiDTWro8')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear San Vicente', 'https://www.facebook.com/profile.php?id=61567276086857&mibextid=ZbWKwL', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      // Official: "+503" links to the Chapeltique number and "6075 0354" to San Vicente's.
      linea('whatsapp', 'Cel/WhatsApp:',
        verde('+503', 'https://api.whatsapp.com/send/?phone=50379505764&text&type=phone_number&app_absent=0', { negrita: true }),
        verde('6075 0354', 'https://api.whatsapp.com/send/?phone=50360750354&text&type=phone_number&app_absent=0', { negrita: true })),
    ],
    mapa: mapa('!1m17!1m12!1m3!1d3877.186925562189!2d-88.78574162491167!3d13.646390586734562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDM4JzQ3LjAiTiA4OMKwNDYnNTkuNCJX!5e0!3m2!1ses!2ssv!4v1730508971405!5m2!1ses!2ssv', 450),
    separacion: 'normal',
  },
  {
    id: 'san-francisco-gotera',
    titulo: 'Tony Sportswear San Francisco Gotera', tamano: 'mediano', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.35-PM-4.jpeg`, ancho: 1254, alto: 799 },
    espacioIzquierda: 36,
    descripcion: 'Somos Tony Sportswear San Francisco Gotera , somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad.  Estamos ubicados sobre la segunda calle poniente en la plaza La Merced segundo nivel frente al banco Cuscatlán',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/XVYwnQ7ntWRDcYEM7')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear San Francisco Gotera', 'https://www.facebook.com/profile.php?id=61573989657312', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 76048172', 'https://api.whatsapp.com/message/EOZQG6GPXT72F1?autoload=1&app_absent=0', { negrita: true })),
    ],
    mapa: mapa('!1m18!1m12!1m3!1d3876.378635686338!2d-88.10749142491076!3d13.695502786690506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f652939f9a8e26b%3A0xcdc8f2ba9d7d360!2sTONY%20SPORTSWEAR%20SAN%20FRANCISCO%20GOTERA!5e0!3m2!1ses-419!2ssv!4v1748969059760!5m2!1ses-419!2ssv', 450),
    separacion: 'normal',
  },
  {
    id: 'chalatenango',
    titulo: 'Tony Sportswear Chalatenango', tamano: 'mediano', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-8.30.20-PM-1.jpeg`, ancho: 1254, alto: 801 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2025-06-03-at-1.01.24-PM.mp4`, ancho: 585, alto: 329.75 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear Chalatenango , somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad.  Estamos ubicados sobre la carretera troncal del norte Plaza el Coyolito',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://maps.app.goo.gl/1cxG8giT9EnZEsCQA')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear Chalatenango', 'https://www.facebook.com/profile.php?id=61573989657312', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 70155571', 'https://wa.me/50370155571', { negrita: true })),
    ],
    mapa: mapa('!1m17!1m12!1m3!1d3869.760944005425!2d-89.1493406249035!3d14.091284386336921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDA1JzI4LjYiTiA4OcKwMDgnNDguNCJX!5e0!3m2!1ses!2ssv!4v1748970153410!5m2!1ses!2ssv', 450),
    separacion: 'normal',
  },
  {
    id: 'lourdes',
    titulo: 'Tony Sportswear Lourdes', tamano: 'mediano', alinear: 'centro', margenMovil: false, divisor: 'fino',
    imagen: { url: `${SUBIDAS}WhatsApp-Image-2026-06-11-at-5.30.50-PM.jpeg`, ancho: 1254, alto: 1254 },
    video: { url: `${SUBIDAS}WhatsApp-Video-2025-06-03-at-1.01.24-PM.mp4`, ancho: 585, alto: 329.75 }, espacioIzquierda: 0,
    descripcion: 'Somos Tony Sportswear Lourdes , somos una empresa de creación y venta de uniformes deportivos, tenemos una gran variedad de diseños para que te vistas con calidad.  Estamos ubicados sobre la carretera Panamericana,  plaza Lourdes, segundo nivel a un costado de le  café Lourdes',
    invitacion: UNA,
    redes: [
      linea('ubicacion', 'Ubicación:', verde('Google maps', 'https://www.google.com/maps/search/13.723901,+-89.369489')),
      linea('facebook', 'Facebook:', verde('Tony Sportwear Lourdes', 'https://www.facebook.com/profile.php?id=61593823553127&locale=es_LA', { nueva: true })),
      linea('instagram', 'Instagram:', verde('TonySportwear', INSTAGRAM_TONY, { nueva: true })),
      linea('whatsapp', 'Cel/WhatsApp:', verde('+503 70155571', 'https://wa.me/50376035808', { negrita: true })),
    ],
    separacion: 'normal',
  },
];
