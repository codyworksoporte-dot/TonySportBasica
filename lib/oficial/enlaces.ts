/*
 * Official links -> mirror routes. No data imports: safe for client components.
 * Returned local paths carry no basePath: use them with next/link (or prefix the asset base for raw HTML).
 */

const ORIGEN_OFICIAL = 'https://www.tonysportselsalvador.com';
const HOST_OFICIAL = /^(?:www\.)?tonysportselsalvador\.com$/i;

/** WordPress pages reproduced by the mirror (categories and products come from lib/oficial/catalogo). */
export const PAGINAS_ESPEJO: string[] = [
  '/',
  '/crea-tu-pedido/',
  '/app-tony/',
  '/app-tony/descarga-nuestra-app/',
  '/tienda-en-linea/',
  '/tienda-en-linea/street-wear/',
  '/tienda-en-linea/camisas-venta-individual/',
  '/productos3/',
  '/productos/',
  '/promociones/',
  '/patrocinadores/',
  '/nuestras-tiendas/',
  '/nuestra-calidad/',
  '/servicio-a-domicilio/',
  '/contacto/',
  '/tony-news/',
  '/subliminado/',
  '/replica/',
  '/implementos-deportivos/',
  '/tipo-de-sublimando/',
  '/quienes-somos/',
  '/galeria/',
  '/proyectos/',
  '/como-comprar/',
  '/politica-de-privacidad/',
  '/uniformes-bkb/',
  '/copa-tony-sportswear/',
  '/blog/',
  '/catalogo/',
  '/eventos/',
  '/paquetes/',
  '/testimoniales-productos/',
  '/premios-app/',
  '/confeccion-de-uniformes-personalizados/',
  '/carrito/',
  '/mi-cuenta/',
];

// Official paths the mirror serves under another route.
const ALIAS: Record<string, string> = {
  '/finalizar-compra/': '/carrito/',
  '/mi-cuenta/': '/mi-cuenta/',
  '/productos/confeccion-de-uniformes-personalizados/': '/confeccion-de-uniformes-personalizados/',
};

// Official-domain addresses that are not WordPress pages: files, admin, feeds and the other systems.
const NO_WORDPRESS = /^\/(?:wp-content|wp-admin|wp-includes|wp-json|wp-login\.php|xmlrpc\.php|feed|comments\/feed|sistema|cgi-bin|mockup-prueba)(?:[/?#]|$)|consulta_ts/i;
const ARCHIVO = /\/[^/]+\.[a-z0-9]{2,5}$/i;
const ESQUEMA_EXTERNO = /^(?:mailto|tel|sms|whatsapp|intent|market|geo|maps|fb|fb-messenger|instagram|tg|viber|skype):/i;

function decodificarAmp(valor: string): string {
  return valor.replace(/&(?:amp|#0*38|#x0*26);/gi, '&');
}

type Partes = { absoluta: boolean; host: string; ruta: string; resto: string };

function partir(valor: string): Partes | null {
  const absoluta = /^(?:https?:)?\/\/([^/?#]+)([^?#]*)([\s\S]*)$/i.exec(valor);
  if (absoluta) return { absoluta: true, host: absoluta[1].toLowerCase().replace(/:\d+$/, ''), ruta: absoluta[2] || '/', resto: absoluta[3] };
  const relativa = /^(\/(?!\/)[^?#]*)([\s\S]*)$/.exec(valor);
  if (relativa) return { absoluta: false, host: 'www.tonysportselsalvador.com', ruta: relativa[1], resto: relativa[2] };
  return null;
}

/**
 * True when the link must stay pointing outside the mirror: other hosts (wa.me, api.whatsapp.com,
 * Facebook, Instagram, TikTok, YouTube, app stores, maps...), official subdomains, mailto:/tel:,
 * and official-domain addresses that are not WordPress pages (/wp-content files, /sistema, consulta_ts...).
 */
export function esExterno(href?: string | null): boolean {
  const valor = decodificarAmp(String(href ?? '').trim());
  if (!valor || /^(?:javascript:|#|\?)/i.test(valor)) return false;
  if (ESQUEMA_EXTERNO.test(valor)) return true;
  const partes = partir(valor);
  if (!partes) return false;
  if (!HOST_OFICIAL.test(partes.host)) return true;
  return NO_WORDPRESS.test(partes.ruta) || ARCHIVO.test(partes.ruta);
}

/**
 * Official URL -> local mirror route (same path, trailing slash, query/hash kept).
 * External links come back untouched; official non-WordPress addresses come back absolute.
 * Special cases: /finalizar-compra/ -> /carrito/; /productos/confeccion-de-uniformes-personalizados/ ->
 * /confeccion-de-uniformes-personalizados/; /categoria/<padre>/<hija>/ -> /categoria/<hija>/; /page/1/ dropped.
 */
export function enlaceLocal(href?: string | null): string {
  const original = String(href ?? '').trim();
  if (!original) return '';
  const valor = decodificarAmp(original);
  if (/^(?:javascript:|#|\?)/i.test(valor) || ESQUEMA_EXTERNO.test(valor)) return valor;
  const partes = partir(valor);
  if (!partes) return valor;
  if (!HOST_OFICIAL.test(partes.host)) return valor;
  if (NO_WORDPRESS.test(partes.ruta) || ARCHIVO.test(partes.ruta)) {
    return partes.absoluta ? valor.replace(/^(?:https?:)?\/\//i, 'https://') : `${ORIGEN_OFICIAL}${partes.ruta}${partes.resto}`;
  }
  let ruta = partes.ruta.replace(/\/{2,}/g, '/');
  if (!ruta.endsWith('/')) ruta += '/';
  ruta = ALIAS[ruta] ?? ruta;
  const categoria = /^\/categoria\/(.+?)\/(?:page\/(\d+)\/)?$/.exec(ruta);
  if (categoria) {
    const slug = categoria[1].split('/').filter(Boolean).pop() ?? categoria[1];
    const pagina = Number(categoria[2] ?? 1);
    ruta = pagina > 1 ? `/categoria/${slug}/page/${pagina}/` : `/categoria/${slug}/`;
  } else ruta = ruta.replace(/\/page\/1\/$/, '/');
  return `${ruta}${partes.resto}`;
}
