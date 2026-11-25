/*
 * Navigation and chrome texts of the official site (tonysportselsalvador.com), literal from its HTML
 * (referencia-oficial/principales/inicio/page.html, verified against outline-desktop.json).
 * Menu texts keep their original case: the desktop menu uppercases them with CSS, like the official theme.
 * Official hrefs are local paths with a trailing slash; external links keep their URL and carry externo: true.
 */

export type ItemMenu = { texto: string; href: string; externo?: boolean; hijos?: ItemMenu[] };

/** The 13 entries of the main menu, in order, with every submenu (59 links in total). */
export const MENU_PRINCIPAL: ItemMenu[] = [
  { texto: 'Inicio', href: '/' },
  { texto: 'CREÁ TU PEDIDO', href: '/crea-tu-pedido/' },
  { texto: 'App Tony', href: '/app-tony/', hijos: [
    { texto: 'Descarga App Tony Sportswear', href: '/app-tony/' },
    { texto: 'Premios App', href: '/categoria/premios-app/' },
  ] },
  { texto: 'Tienda en Línea', href: '/tienda-en-linea/', hijos: [
    { texto: 'Camisas Oficiales de Equipos Nacionales', href: '/categoria/camisas-oficiales-de-equipos-nacionales/' },
    { texto: 'Implementos Deportivos', href: '/categoria/implementos-deportivos/' },
    { texto: 'Jerseys', href: '/categoria/camisas-individuales/' },
    { texto: 'Camisa Selecta Salvadoreña', href: '/categoria/camisa-selecta-salvadorena/' },
  ] },
  { texto: 'Productos', href: '/productos3/', hijos: [
    { texto: 'Confección uniformes de futbol', href: '/subliminado/', hijos: [
      { texto: 'Uniformes Mundial Anime 2026', href: '/categoria/uniformes-mundial-anime-2026/' },
      { texto: 'Diseños del Mundial 2026', href: '/categoria/disenos-del-mundial-2026/' },
      { texto: 'Camisa Full Sublimada y Calzoneta Full Sublimada – Personalizados', href: '/categoria/camisa-full-sublimada-y-calzoneta-full-sublimada-personalizados/' },
      { texto: 'Uniformes de Fùtbol Sublimado Camisa y Calzoneta de Tela – Personalizados', href: '/categoria/uniformes-de-futbol-sublimado-camisa-y-calzoneta-de-tela-personalizados/' },
      { texto: 'Confecciòn Uniforme Sublimado Frontal Calzoneta de Tela – Personalizados', href: '/categoria/confeccion-uniforme-sublimado-frontal-calzoneta-de-tela-personalizados/' },
      { texto: 'Uniformes Juveniles', href: '/categoria/uniformes-juveniles-2/' },
      { texto: 'Uniformes deportivos para dama', href: '/categoria/compra-en-linea/uniformes-deportivos-para-dama/' },
    ] },
    { texto: 'Camisas deportivas y tipo polo', href: '/tipo-de-sublimando/', hijos: [
      { texto: 'Camisa Linea Stamp Line', href: '/categoria/linea-stamp-line/' },
      { texto: 'Camisas Linea Premium', href: '/categoria/camisas-linea-premium/' },
      { texto: 'Camisas Sublimado Frontal', href: '/categoria/camisas-o-promocionales/' },
      { texto: 'Camisas Full Sublimadas', href: '/categoria/camisa-full-sublimada/' },
      { texto: 'Camisas Tipo Polo Sublimado Frontal', href: '/categoria/camisa-tipo-polo-sublimado-frontal/' },
      { texto: 'Camisas Tipo Polo Full Sublimadas', href: '/categoria/camisa-tipo-polo-full-sublimada/' },
      { texto: 'Uniformes de Presentaciòn Tipo Polo', href: '/categoria/presentacion-polo/' },
    ] },
    { texto: 'Linea Ciclismo', href: '/categoria/linea-ciclismo/' },
    { texto: 'Diferentes Replicas', href: '/replica/', hijos: [
      { texto: 'Replicas Sublimadas $9.99', href: '/categoria/replicas-sublimadas-8-99/' },
      { texto: 'Replicas bordadas de $8.49', href: '/categoria/replicas-bordadas-de-8-49/' },
      { texto: 'Replicas Bordadas de Futbol de $10.99', href: '/categoria/replicas-bordadas-de-futbol-de-10-99/' },
    ] },
    { texto: 'Uniformes BKB', href: '/uniformes-bkb/', hijos: [
      { texto: 'Centro full sublimado y calzoneta full sublimada-personalizado', href: '/categoria/uniformes-de-baloncesto-linea-modern-carving-personalizados/centro-full-sublimado-y-calzoneta-full-sublimada-personalizados/' },
      { texto: 'Centro full sublimado con calzoneta de tela', href: '/categoria/centro-full-sublimado-con-calzoneta-de-tela/' },
      { texto: 'Confección uniformes BKB sublimado frontal Calzoneta de tela-personalizado', href: '/categoria/uniformes-de-baloncesto-linea-modern-carving-personalizados/uniformes-bkb-sublimado-frontal/' },
    ] },
    { texto: 'Uniformes de Voleibol', href: '/categoria/uniformes-de-voleibol/' },
    { texto: 'Línea Racing', href: '/categoria/linea-racing/', hijos: [
      { texto: 'Racing Car Show', href: '/categoria/racing-car-show/' },
      { texto: 'Racing Motorcycle', href: '/categoria/racing-motorcycle/' },
    ] },
    { texto: 'Línea Empresarial', href: '/categoria/camisas-empresariales/', hijos: [
      { texto: 'Línea Empresarial Con Cinta Reflectiva', href: '/categoria/linea-empresarial-con-cinta-reflectiva/' },
      { texto: 'Camisas Polo Lisas', href: '/categoria/linea-empresarial/camisas-polo-lisas/' },
    ] },
    { texto: 'Linea Runners', href: '/categoria/linea-runners/' },
    { texto: 'Moldes de Futbol', href: '/categoria/moldes-de-futbol/' },
    { texto: 'Logos 3D Alto Relieve', href: '/categoria/logos-3d-alto-relieve/' },
    { texto: 'Implementos Deportivos', href: '/categoria/implementos-deportivos/' },
    { texto: 'Hoddies', href: '/categoria/hoddies/' },
  ] },
  { texto: 'Promociones', href: '/promociones/', hijos: [
    { texto: 'PROMOCIONES', href: '/categoria/promo-inicio-de-ano/' },
  ] },
  { texto: 'Patrocinio', href: '/patrocinadores/' },
  { texto: 'Nuestras tiendas', href: '/nuestras-tiendas/' },
  { texto: 'Nuestra Calidad', href: '/nuestra-calidad/', hijos: [
    { texto: 'Lineas de Tela', href: '/categoria/lineas-de-tela/' },
    { texto: 'Costuras', href: '/categoria/costuras/' },
  ] },
  { texto: 'Servicio a domicilio', href: '/servicio-a-domicilio/' },
  { texto: 'Contacto', href: '/contacto/' },
  { texto: 'Tony News', href: '/tony-news/' },
  { texto: 'RSE-TONY', href: '/categoria/rse-tony/' },
];

/** At 1440 px the official menu wraps into two rows: the first one ends after this many entries. */
export const MENU_PRIMERA_FILA = 7;

/**
 * Top contact bar ("Speed Contact Bar" plugin). The official one reads "SI NO TE LO TENEMOS TE LO HACEMOS";
 * the page title and meta description use the other wording ("SI NO LO TENEMOS, TE LO HACEMOS").
 */
export const BARRA_SUPERIOR = {
  lema: 'SI NO TE LO TENEMOS TE LO HACEMOS',
  whatsapp: { etiqueta: 'Cel/WhatsApp', texto: '7015-5571', href: 'https://wa.me/50370155571' },
  correo: { etiqueta: 'E-mail', texto: 'info@tonysportselsalvador.com', href: 'mailto:info@tonysportselsalvador.com' },
  facebook: { etiqueta: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100085923971490' },
  instagram: { etiqueta: 'Instagram', href: 'https://www.instagram.com/tonysportwear/' },
} as const;

/** Floating WhatsApp bubble (left), literal texts. */
export const WHATSAPP_FLOTANTE = {
  descripcion: '¡Contáctanos por WhatsApp y te atenderemos lo más pronto posible!',
  titulo: 'Atención al cliente',
  nombre: 'Pulsa para enviar un WhatsApp',
  boton: 'WhatsApp',
  href: `https://wa.me/50370155571?text=${encodeURIComponent('¡Hola! Estoy interesado en más información, vi su página web')}`,
} as const;

/** Footer: three widget columns and the bottom bar, literal texts (titles are uppercased with CSS). */
export const PIE = {
  informacion: {
    titulo: '¿Requieres más información?',
    texto: 'Si tienes cualquier duda sobre nuestros servicios puedes comunicarte con nosotros para que te brindemos una atención más personalizada y completa.',
    contactoIntro: 'Nuestros datos de contacto son:',
    whatsapp: { etiqueta: 'Cel/WhatsApp:', texto: '7015-5571' },
    correo: { etiqueta: 'E-mail:', texto: 'info@tonysportselsalvador.com', href: 'mailto:info@tonysportselsalvador.com' },
    lema: '¡En Tonysportswear Somos tu mejor opción!',
    /** The official widget plays this file; the local copy comes from data/oficial/medios.json. */
    audio: 'https://www.tonysportselsalvador.com/wp-content/uploads/zaki-tony-sport-demo2-1-1.wav',
  },
  categorias: {
    titulo: 'Explora nuestras categorías',
    placeholder: 'Elige una categoría',
  },
  nosotros: {
    titulo: 'Sobre Nosotros',
    texto: 'Nos dedicamos a la venta y confección de uniformes deportivos, brindando una amplia gama de diseños a tu disposición, con precios accesibles acorde a nuestra calidad, contamos con diferentes tiendas a nivel nacional como también contamos con servicio a domicilio a nivel nacional.',
    contacto: 'Estamos a tus órdenes si requieres más información. ¡Contáctanos! al 7015-5571',
    /** Old crocodile logo of the official footer (1280×1101); the mirror draws ours in its place. */
    imagen: { src: 'https://www.tonysportselsalvador.com/wp-content/uploads/LOGO-TONY-SPORTSWEAR.jpeg', ancho: 1280, alto: 1101 },
  },
  barra: {
    copyright: '© Copyright',
    dominio: 'www.tonysportselsalvador.com',
    derechos: ' - Todos los derechos reservados',
    facebook: { etiqueta: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100085923971490' },
  },
} as const;

/** Floating cart (WPC Fly Cart) and language trigger, literal texts. */
export const WIDGETS = {
  carrito: { titulo: 'Mi carrito', vacio: 'No hay productos en el carrito.', href: '/carrito/' },
  idioma: { boton: 'IDIOMA »' },
} as const;

/** Removes the trailing slash so official hrefs compare with usePathname() values. */
export function rutaNormal(ruta: string): string {
  const sinConsulta = ruta.split(/[?#]/)[0] || '/';
  return sinConsulta.length > 1 ? sinConsulta.replace(/\/+$/, '') : '/';
}
