#!/usr/bin/env node
/**
 * Mirror of the official site's images (plus the footer audio track).
 *
 * Collects every image URL used by referencia-oficial (outline-*.json and page.html),
 * data/oficial/productos.json and data/oficial/categorias.json, downloads each unique URL
 * from tonysportselsalvador.com, converts it to WebP with sharp and writes:
 *   public/assets/oficial/img/<name>-<hash6>.webp
 *   data/oficial/imagenes.json           { "<normalized url>": { src, w, h } }
 *   data/oficial/imagenes-fallidas.json  definitive failures
 *   data/oficial/imagenes-externas.json  images hosted elsewhere (never downloaded)
 *   public/assets/oficial/audio/<file> + data/oficial/medios.json
 * Idempotent: files already on disk are reused, only missing ones are downloaded.
 *
 * Usage: node scripts/oficial/imagenes.mjs [--dry] [--limite N] [--sin-audio] [--solo-audio] [--ancho-galeria N]
 *   --ancho-galeria N  caps images used only in product galleries (images[1..].src) at N px, re-encoding
 *                      already mirrored files locally (no download). Default: the normal 1200 px cap.
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REF = join(RAIZ, 'referencia-oficial');
const DATA = join(RAIZ, 'data', 'oficial');
const SALIDA_IMG = join(RAIZ, 'public', 'assets', 'oficial', 'img');
const SALIDA_AUDIO = join(RAIZ, 'public', 'assets', 'oficial', 'audio');
const RUTA_PUBLICA_IMG = '/assets/oficial/img';
const RUTA_PUBLICA_AUDIO = '/assets/oficial/audio';

const HOST = 'www.tonysportselsalvador.com';
const CABECERAS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
  Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'es-SV,es;q=0.9,en;q=0.8',
  Referer: `https://${HOST}/`,
};
const CONCURRENCIA = 4;
const REINTENTOS = 3;
const ANCHO_COMPLETO = 1920;
const ANCHO_NORMAL = 1200;
const CALIDAD = 80;
const GUARDAR_CADA = 300;

const ARGS = process.argv.slice(2);
const SECO = ARGS.includes('--dry');
const numeroArg = (nombre, porDefecto) => {
  const i = ARGS.indexOf(nombre);
  return i >= 0 ? Math.max(0, Number(ARGS[i + 1]) || 0) : porDefecto;
};
const LIMITE = numeroArg('--limite', Infinity);
// Optional lower cap for images used only in product galleries (images[1..]); existing files are re-encoded locally.
const ANCHO_GALERIA = numeroArg('--ancho-galeria', 0);

// ---------------------------------------------------------------------------
// URL normalization. Keep in sync with normalizarUrlOficial() in lib/oficial/imagenes.ts.
// ---------------------------------------------------------------------------
const ENTIDADES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };

function decodificarEntidades(texto) {
  let salida = String(texto);
  for (let i = 0; i < 2; i++) {
    salida = salida.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entera, cuerpo) => {
      if (cuerpo[0] === '#') {
        const hex = cuerpo[1] === 'x' || cuerpo[1] === 'X';
        const codigo = hex ? parseInt(cuerpo.slice(2), 16) : parseInt(cuerpo.slice(1), 10);
        return Number.isFinite(codigo) && codigo > 0 && codigo <= 0x10ffff ? String.fromCodePoint(codigo) : entera;
      }
      return ENTIDADES[cuerpo.toLowerCase()] ?? entera;
    });
  }
  return salida;
}

function decodificarRuta(ruta) {
  try {
    return decodeURI(ruta);
  } catch {
    return ruta;
  }
}

function normalizarUrl(url) {
  let s = decodificarEntidades(String(url ?? '').trim()).replace(/^['"]+|['"]+$/g, '').trim();
  if (!s) return '';
  if (/^(data|blob|mailto|tel|javascript):/i.test(s)) return s;
  if (s.startsWith('//')) s = `https:${s}`;
  else if (s.startsWith('/')) s = `https://${HOST}${s}`;
  else if (/^(www\.)?tonysportselsalvador\.com(\/|$)/i.test(s)) s = `https://${s}`;
  const partes = /^https?:\/\/([^/?#]+)([^?#]*)/i.exec(s);
  if (!partes) return s.replace(/[?#].*$/, '');
  let host = partes[1].toLowerCase().replace(/:(80|443)$/, '');
  let ruta = partes[2] || '/';
  if (/^i\d\.wp\.com$/.test(host)) {
    const envuelta = /^\/([^/]+)(\/.*)?$/.exec(ruta);
    if (envuelta) {
      host = envuelta[1].toLowerCase();
      ruta = envuelta[2] || '/';
    }
  }
  if (host === 'tonysportselsalvador.com') host = HOST;
  ruta = decodificarRuta(ruta).replace(/\/{2,}/g, '/');
  return `https://${host}${ruta}`;
}

function sinVariante(url) {
  let base = url;
  for (let i = 0; i < 3; i++) {
    const siguiente = base.replace(/-(\d+x\d+|scaled|e\d{9,})(?=\.[a-z0-9]+$)/i, '');
    if (siguiente === base) break;
    base = siguiente;
  }
  return base;
}

const IMAGEN = /\.(jpe?g|jfif|png|gif|webp|avif|svg|bmp)$/i;
const MARCADOR = /\/(dummy|transparent|blank|spacer|pixel|placeholder|lazy[_-]?placeholder)\.(png|gif|svg|jpe?g)$/i;

function esDelDominio(url) {
  const m = /^https:\/\/([^/]+)\//i.exec(url);
  return !!m && /(^|\.)tonysportselsalvador\.com$/i.test(m[1]);
}

function urlsDeValor(valor) {
  if (typeof valor !== 'string' || !valor.trim()) return [];
  const encontradas = [...valor.matchAll(/url\(\s*(?:&quot;|['"])?(.*?)(?:&quot;|['"])?\s*\)/gi)].map((m) => m[1]);
  if (encontradas.length) return encontradas;
  const limpio = valor.trim();
  return /^(https?:)?\/\/|^\/wp-content\//i.test(limpio) ? [limpio] : [];
}

function mayorDeSrcset(srcset) {
  let mejor = null;
  let mejorValor = -1;
  for (const candidato of String(srcset ?? '').split(/\s*,\s*/)) {
    const [url, descriptor = ''] = candidato.trim().split(/\s+/);
    if (!url) continue;
    const m = /^(\d+(?:\.\d+)?)([wx])$/i.exec(descriptor);
    const valor = m ? Number(m[1]) * (m[2].toLowerCase() === 'x' ? 1000 : 1) : 0;
    if (valor > mejorValor) {
      mejor = url;
      mejorValor = valor;
    }
  }
  return mejor;
}

// ---------------------------------------------------------------------------
// Collection
// ---------------------------------------------------------------------------
const PRIORIDAD = { pagina: 0, categoria: 1, portada: 2, galeria: 3 };
/** @type {Map<string, {url: string, completo: boolean, origenes: Set<string>, prioridad: number, mejor: string | null, soloGaleria: boolean}>} */
const coleccion = new Map();
/** @type {Map<string, Set<string>>} */
const externas = new Map();
const variantesOmitidas = new Set();
const porFuente = { outlines: new Set(), productos: new Set(), categorias: new Set(), html: new Set() };

function registrar(cruda, origen, fuente, opciones = {}) {
  if (typeof cruda !== 'string' || !cruda.trim()) return null;
  const url = normalizarUrl(cruda);
  if (!/^https:\/\//i.test(url) || !IMAGEN.test(url) || MARCADOR.test(url)) return null;
  if (!esDelDominio(url)) {
    if (!externas.has(url)) externas.set(url, new Set());
    externas.get(url).add(origen);
    return null;
  }
  let entrada = coleccion.get(url);
  if (!entrada) {
    entrada = { url, completo: false, origenes: new Set(), prioridad: 9, mejor: null, soloGaleria: true };
    coleccion.set(url, entrada);
  }
  if (!opciones.galeria) entrada.soloGaleria = false;
  if (opciones.completo) entrada.completo = true;
  entrada.origenes.add(origen);
  entrada.prioridad = Math.min(entrada.prioridad, opciones.prioridad ?? PRIORIDAD.pagina);
  if (opciones.mejor && !entrada.mejor) entrada.mejor = opciones.mejor;
  porFuente[fuente].add(url);
  return entrada;
}

async function capturas() {
  const lista = [];
  for (const grupo of ['principales', 'otras', 'plantillas']) {
    const carpeta = join(REF, grupo);
    if (!existsSync(carpeta)) continue;
    for (const slug of (await readdir(carpeta)).sort()) lista.push({ id: `${grupo}/${slug}`, carpeta: join(carpeta, slug) });
  }
  return lista;
}

function recorrerOutline(outline, origen) {
  const vista = Array.isArray(outline.viewport) ? Number(outline.viewport[0]) || 1440 : 1440;
  const anchoCompleto = (caja) => vista >= 1000 && Array.isArray(caja) && Number(caja[2]) >= vista * 0.75;
  const visitar = (nodo, caja, enSlider, ruta) => {
    if (Array.isArray(nodo)) {
      for (const hijo of nodo) visitar(hijo, caja, enSlider, ruta);
      return;
    }
    if (!nodo || typeof nodo !== 'object') return;
    const propia = Array.isArray(nodo.box) ? nodo.box : caja;
    const completo = enSlider || anchoCompleto(propia);
    const donde = `${origen} ${ruta || 'raiz'}`;
    if (typeof nodo.src === 'string' && nodo.t !== 'video' && nodo.t !== 'iframe') registrar(nodo.src, donde, 'outlines', { completo });
    if (typeof nodo.image === 'string') for (const u of urlsDeValor(nodo.image)) registrar(u, donde, 'outlines', { completo });
    for (const clave of ['href', 'link']) if (typeof nodo[clave] === 'string') registrar(nodo[clave], donde, 'outlines');
    if (nodo.bg && typeof nodo.bg === 'object') for (const u of urlsDeValor(nodo.bg.image)) registrar(u, `${donde}.bg`, 'outlines', { completo });
    if (nodo.style && typeof nodo.style === 'object') for (const v of Object.values(nodo.style)) for (const u of urlsDeValor(v)) registrar(u, `${donde}.style`, 'outlines', { completo });
    if (Array.isArray(nodo.images)) for (const im of nodo.images) if (typeof im === 'string') registrar(im, `${donde}.images`, 'outlines', { completo });
    for (const [clave, valor] of Object.entries(nodo)) {
      if (!valor || typeof valor !== 'object' || clave === 'bg' || clave === 'font' || clave === 'box' || clave === 'style') continue;
      visitar(valor, propia, enSlider || clave === 'sliders' || clave === 'slides', ruta ? `${ruta}.${clave}` : clave);
    }
  };
  visitar(outline, null, false, '');
}

function recorrerHtml(html, origen, bases) {
  const tomar = (cruda, completo) => {
    const url = normalizarUrl(cruda);
    if (!coleccion.has(url) && IMAGEN.test(url) && sinVariante(url) !== url && bases.has(sinVariante(url))) {
      variantesOmitidas.add(url);
      return;
    }
    registrar(cruda, `${origen} html`, 'html', { completo });
  };
  for (const etiqueta of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
    const nombre = etiqueta[1].toLowerCase();
    if (nombre === 'link' || nombre === 'meta' || nombre === 'script') continue;
    const atributos = etiqueta[2];
    const fondoSlider = nombre.startsWith('rs-') || /rev-slidebg/i.test(atributos);
    for (const a of atributos.matchAll(/([a-z][a-z0-9_:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      const atributo = a[1].toLowerCase();
      const valor = a[2] ?? a[3] ?? '';
      if (atributo === 'src' || atributo === 'data-src' || atributo === 'data-lazy-src' || atributo === 'data-lazyload') tomar(valor, fondoSlider);
      else if (atributo === 'srcset' || atributo === 'data-srcset' || atributo === 'data-lazy-srcset') {
        const mayor = mayorDeSrcset(decodificarEntidades(valor));
        if (mayor) tomar(mayor, fondoSlider);
      } else if (atributo === 'style') for (const u of urlsDeValor(decodificarEntidades(valor))) tomar(u, true);
      else if (atributo === 'href' && nombre === 'a') tomar(valor, false);
    }
  }
  for (const bloque of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const u of urlsDeValor(bloque[1])) if (/\/wp-content\/uploads\//i.test(u)) tomar(u, true);
  }
}

function imagenesDe(producto) {
  const valor = producto?.images;
  if (Array.isArray(valor)) return valor.filter(Boolean);
  return valor && typeof valor === 'object' ? Object.values(valor).filter(Boolean) : [];
}

/** Same-ratio srcset candidate at least twice as wide as a WooCommerce thumbnail (sharper grids). */
function mejorMiniatura(imagen) {
  const m = /-(\d+)x(\d+)\.[a-z0-9]+$/i.exec(imagen?.thumbnail ?? '');
  if (!m) return null;
  const ancho = Number(m[1]);
  const proporcion = ancho / Number(m[2]);
  const candidatos = String(imagen.srcset ?? '')
    .split(/\s*,\s*/)
    .map((c) => c.trim().split(/\s+/)[0])
    .filter(Boolean)
    .map((u) => ({ u, d: /-(\d+)x(\d+)\.[a-z0-9]+$/i.exec(u) }))
    .filter((c) => c.d && Number(c.d[1]) >= ancho * 2 && Math.abs(Number(c.d[1]) / Number(c.d[2]) - proporcion) < 0.01)
    .sort((a, b) => Number(a.d[1]) - Number(b.d[1]));
  return candidatos.length ? normalizarUrl(candidatos[0].u) : null;
}

async function leerJson(ruta, porDefecto) {
  try {
    return JSON.parse(await readFile(ruta, 'utf8'));
  } catch {
    return porDefecto;
  }
}

async function recolectar() {
  const lista = await capturas();
  for (const { id, carpeta } of lista) {
    for (const archivo of ['outline-desktop.json', 'outline-mobile.json']) {
      const outline = await leerJson(join(carpeta, archivo), null);
      if (outline) recorrerOutline(outline, `${id} ${archivo.replace(/^outline-|\.json$/g, '')}`);
    }
  }
  const productos = (await leerJson(join(DATA, 'productos.json'), { products: [] })).products ?? [];
  for (const p of productos) {
    imagenesDe(p).forEach((im, i) => {
      const prioridad = i === 0 ? PRIORIDAD.portada : PRIORIDAD.galeria;
      registrar(im.src, `producto ${p.id} images[${i}].src`, 'productos', { prioridad, galeria: i > 0 });
      registrar(im.thumbnail, `producto ${p.id} images[${i}].thumbnail`, 'productos', { prioridad, mejor: i === 0 ? mejorMiniatura(im) : null });
    });
  }
  const categorias = (await leerJson(join(DATA, 'categorias.json'), { categories: [] })).categories ?? [];
  for (const c of categorias) {
    if (!c.image) continue;
    registrar(c.image.src, `categoria ${c.slug} image.src`, 'categorias', { prioridad: PRIORIDAD.categoria });
    registrar(c.image.thumbnail, `categoria ${c.slug} image.thumbnail`, 'categorias', { prioridad: PRIORIDAD.categoria, mejor: mejorMiniatura(c.image) });
  }
  // page.html last: only what the outlines and the catalog do not already cover.
  const bases = new Set([...coleccion.keys()].map(sinVariante));
  for (const { id, carpeta } of lista) {
    const ruta = join(carpeta, 'page.html');
    if (existsSync(ruta)) recorrerHtml(await readFile(ruta, 'utf8'), id, bases);
  }
  return { productos, categorias };
}

// ---------------------------------------------------------------------------
// Download + conversion
// ---------------------------------------------------------------------------
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function errorDefinitivo(mensaje) {
  const error = new Error(mensaje);
  error.definitivo = true;
  return error;
}

/** GET restricted to the official domain (redirects are followed only inside it). */
async function obtener(url, aceptar = CABECERAS.Accept) {
  let ultimo = null;
  for (let intento = 0; intento <= REINTENTOS; intento++) {
    try {
      let actual = url;
      for (let salto = 0; salto < 5; salto++) {
        const respuesta = await fetch(new URL(actual).href, { headers: { ...CABECERAS, Accept: aceptar }, redirect: 'manual', signal: AbortSignal.timeout(90_000) });
        if (respuesta.status >= 300 && respuesta.status < 400 && respuesta.headers.get('location')) {
          const destino = normalizarUrl(new URL(respuesta.headers.get('location'), actual).href);
          if (!esDelDominio(destino)) throw errorDefinitivo(`redirige fuera del dominio: ${destino}`);
          actual = destino;
          continue;
        }
        if (respuesta.status === 404 || respuesta.status === 410 || respuesta.status === 403) throw errorDefinitivo(`HTTP ${respuesta.status}`);
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = Buffer.from(await respuesta.arrayBuffer());
        if (!datos.length) throw new Error('respuesta vacía');
        return datos;
      }
      throw errorDefinitivo('demasiadas redirecciones');
    } catch (error) {
      ultimo = error;
      if (error.definitivo) break;
      if (intento < REINTENTOS) await esperar(1200 * 2 ** intento);
    }
  }
  throw ultimo;
}

async function aWebp(datos, anchoMax) {
  const meta = await sharp(datos, { failOn: 'none' }).metadata();
  if (!meta.format || !meta.width) throw errorDefinitivo('formato de imagen no reconocido');
  const animada = (meta.pages ?? 1) > 1 && (meta.format === 'gif' || meta.format === 'webp');
  const opciones = { failOn: 'none', animated: animada, autoOrient: !animada, limitInputPixels: 0 };
  // Rasterize SVG at a density that yields a usable bitmap (~600px wide, at most 4x).
  if (meta.format === 'svg') opciones.density = Math.min(288, Math.max(72, Math.round((72 * 600) / meta.width)));
  const { data, info } = await sharp(datos, opciones)
    .resize({ width: anchoMax, withoutEnlargement: true })
    .webp({ quality: CALIDAD, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: animada && info.pageHeight ? info.pageHeight : info.height };
}

function nombreSaneado(url) {
  const base = posix.basename(new URL(url).pathname).replace(/\.[a-z0-9]+$/i, '');
  const limpio = base
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return limpio || 'imagen';
}

const nombresUsados = new Map();
function nombreArchivo(url) {
  const hash = createHash('sha1').update(url).digest('hex');
  let nombre = `${nombreSaneado(url)}-${hash.slice(0, 6)}.webp`;
  const previo = nombresUsados.get(nombre);
  if (previo && previo !== url) nombre = `${nombreSaneado(url)}-${hash.slice(0, 12)}.webp`;
  nombresUsados.set(nombre, url);
  return nombre;
}

async function escribirAtomico(ruta, contenido) {
  const temporal = `${ruta}.${process.pid}.tmp`;
  await writeFile(temporal, contenido);
  for (let intento = 0; ; intento++) {
    try {
      await rename(temporal, ruta);
      return;
    } catch (error) {
      if (intento >= 8) {
        await writeFile(ruta, contenido);
        await unlink(temporal).catch(() => {});
        return;
      }
      await esperar(150 * (intento + 1));
    }
  }
}

function jsonPorLineas(objeto) {
  const claves = Object.keys(objeto).sort();
  if (!claves.length) return '{}\n';
  return `{\n${claves.map((k) => `${JSON.stringify(k)}: ${JSON.stringify(objeto[k])}`).join(',\n')}\n}\n`;
}

function proporcionDeNombre(url) {
  const m = /-(\d+)x(\d+)\.[a-z0-9]+$/i.exec(url);
  return m ? Number(m[1]) / Number(m[2]) : null;
}

async function enParalelo(lista, n, tarea) {
  let siguiente = 0;
  const trabajadores = Array.from({ length: Math.min(n, lista.length) }, async () => {
    while (siguiente < lista.length) {
      const indice = siguiente++;
      await tarea(lista[indice], indice);
    }
  });
  await Promise.all(trabajadores);
}

const megas = (bytes) => (bytes / 1024 / 1024).toFixed(1);

async function imagenes() {
  const t0 = Date.now();
  const { productos, categorias } = await recolectar();
  const soloHtml = [...porFuente.html].filter((u) => !porFuente.outlines.has(u) && !porFuente.productos.has(u) && !porFuente.categorias.has(u));
  console.log(`Productos: ${productos.length} · categorías: ${categorias.length}`);
  console.log(
    `URLs únicas del dominio: ${coleccion.size} (outlines ${porFuente.outlines.size}, productos ${porFuente.productos.size}, categorías ${porFuente.categorias.size}, solo en page.html ${soloHtml.length}); externas omitidas: ${externas.size}; variantes de tamaño omitidas del HTML: ${variantesOmitidas.size}`,
  );
  console.log(
    `A ancho completo (máx. ${ANCHO_COMPLETO}px): ${[...coleccion.values()].filter((e) => e.completo).length}; con miniatura mejorada: ${[...coleccion.values()].filter((e) => e.mejor).length}; solo de galería de producto: ${[...coleccion.values()].filter((e) => e.soloGaleria).length}${ANCHO_GALERIA ? ` (máx. ${ANCHO_GALERIA}px)` : ''}`,
  );

  if (SECO) {
    const completas = [...coleccion.values()].filter((e) => e.completo);
    console.log(`\nA ancho completo (${completas.length}):`);
    for (const e of completas) console.log(`  ${e.url}  <- ${[...e.origenes][0]}`);
    console.log(`\nSolo en page.html (${soloHtml.length}):`);
    for (const u of soloHtml.slice(0, 80)) console.log(`  ${u}  <- ${[...coleccion.get(u).origenes][0]}`);
    console.log(`\nExternas (${externas.size}):`);
    const hosts = {};
    for (const u of externas.keys()) {
      const h = new URL(u).host;
      hosts[h] = (hosts[h] ?? 0) + 1;
    }
    console.log(hosts);
    return;
  }

  await mkdir(SALIDA_IMG, { recursive: true });
  const previo = await leerJson(join(DATA, 'imagenes.json'), {});
  const mapa = {};
  const pendientes = [];
  const aReducir = [];
  let reutilizadas = 0;
  const entradas = [...coleccion.values()].sort((a, b) => a.prioridad - b.prioridad || a.url.localeCompare(b.url));
  for (const entrada of entradas) {
    const nombre = nombreArchivo(entrada.url);
    const src = `${RUTA_PUBLICA_IMG}/${nombre}`;
    const ruta = join(SALIDA_IMG, nombre);
    if (existsSync(ruta)) {
      const anterior = previo[entrada.url];
      if (anterior && anterior.src === src && anterior.w && anterior.h) mapa[entrada.url] = { src, w: anterior.w, h: anterior.h };
      else {
        try {
          const meta = await sharp(ruta).metadata();
          mapa[entrada.url] = { src, w: meta.width, h: meta.pageHeight ?? meta.height };
        } catch {
          pendientes.push({ entrada, nombre, src, ruta });
          continue;
        }
      }
      reutilizadas++;
      if (ANCHO_GALERIA && entrada.soloGaleria && mapa[entrada.url].w > ANCHO_GALERIA) aReducir.push({ entrada, src, ruta });
    } else pendientes.push({ entrada, nombre, src, ruta });
  }
  const aDescargar = pendientes.slice(0, LIMITE);
  console.log(`Reutilizadas: ${reutilizadas} · por descargar: ${aDescargar.length}${aDescargar.length < pendientes.length ? ` (de ${pendientes.length}, --limite)` : ''}`);

  if (aReducir.length) {
    let reducidas = 0;
    await enParalelo(aReducir, CONCURRENCIA, async ({ entrada, src, ruta }) => {
      try {
        const { data, info } = await sharp(await readFile(ruta)).resize({ width: ANCHO_GALERIA, withoutEnlargement: true }).webp({ quality: CALIDAD, effort: 4 }).toBuffer({ resolveWithObject: true });
        await escribirAtomico(ruta, data);
        mapa[entrada.url] = { src, w: info.width, h: info.height };
        reducidas++;
      } catch (error) {
        console.warn(`No se pudo reducir ${entrada.url}: ${error.message}`);
      }
    });
    console.log(`Galerías reducidas a ${ANCHO_GALERIA}px: ${reducidas} de ${aReducir.length}`);
  }

  const fallidas = [];
  let hechas = 0;
  let nuevas = 0;
  let mejoradas = 0;
  let guardando = Promise.resolve();
  const guardarMapa = () => {
    guardando = guardando.then(() => escribirAtomico(join(DATA, 'imagenes.json'), jsonPorLineas(mapa))).catch((e) => console.warn('No se pudo guardar imagenes.json:', e.message));
    return guardando;
  };

  await enParalelo(aDescargar, CONCURRENCIA, async ({ entrada, src, ruta }) => {
    const anchoMax = entrada.completo ? ANCHO_COMPLETO : ANCHO_GALERIA && entrada.soloGaleria ? ANCHO_GALERIA : ANCHO_NORMAL;
    try {
      let resultado = null;
      if (entrada.mejor) {
        try {
          const mejor = await aWebp(await obtener(entrada.mejor), anchoMax);
          const esperada = proporcionDeNombre(entrada.url);
          if (!esperada || Math.abs(mejor.w / mejor.h - esperada) < 0.02) {
            resultado = mejor;
            mejoradas++;
          }
        } catch {
          // Fall back to the exact URL below.
        }
      }
      resultado ??= await aWebp(await obtener(entrada.url), anchoMax);
      await escribirAtomico(ruta, resultado.data);
      mapa[entrada.url] = { src, w: resultado.w, h: resultado.h };
      nuevas++;
    } catch (error) {
      fallidas.push({ url: entrada.url, error: String(error?.message ?? error), origenes: [...entrada.origenes].slice(0, 5) });
    }
    hechas++;
    if (hechas % 50 === 0 || hechas === aDescargar.length) {
      const seg = (Date.now() - t0) / 1000;
      console.log(`  ${hechas}/${aDescargar.length} · nuevas ${nuevas} · fallidas ${fallidas.length} · ${seg.toFixed(0)} s`);
    }
    if (hechas % GUARDAR_CADA === 0) await guardarMapa();
  });

  await guardarMapa();
  await guardando;
  fallidas.sort((a, b) => a.url.localeCompare(b.url));
  await escribirAtomico(join(DATA, 'imagenes-fallidas.json'), `${JSON.stringify(fallidas, null, 1)}\n`);
  const listaExternas = [...externas.entries()]
    .map(([url, origenes]) => ({ url, usos: origenes.size, origenes: [...origenes].slice(0, 5) }))
    .sort((a, b) => a.url.localeCompare(b.url));
  await escribirAtomico(join(DATA, 'imagenes-externas.json'), `${JSON.stringify(listaExternas, null, 1)}\n`);

  let bytes = 0;
  const vistos = new Set();
  for (const { src } of Object.values(mapa)) {
    if (vistos.has(src)) continue;
    vistos.add(src);
    try {
      bytes += (await stat(join(RAIZ, 'public', src.slice(1)))).size;
    } catch {
      // Missing file: reported by the next run as pending.
    }
  }
  const sinDescargar = pendientes.length - aDescargar.length;
  console.log(`\nImágenes en el mapa: ${Object.keys(mapa).length} de ${coleccion.size} · nuevas ${nuevas} (miniaturas mejoradas ${mejoradas}) · reutilizadas ${reutilizadas} · fallidas ${fallidas.length}${sinDescargar ? ` · sin intentar ${sinDescargar}` : ''}`);
  console.log(`Peso total: ${megas(bytes)} MB en ${vistos.size} archivos · externas sin descargar: ${externas.size} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}

// ---------------------------------------------------------------------------
// Footer audio player
// ---------------------------------------------------------------------------
function duracionWav(datos) {
  if (datos.length < 44 || datos.toString('ascii', 0, 4) !== 'RIFF' || datos.toString('ascii', 8, 12) !== 'WAVE') return null;
  let bytesPorSegundo = 0;
  for (let i = 12; i + 8 <= datos.length; ) {
    const id = datos.toString('ascii', i, i + 4);
    const tamano = datos.readUInt32LE(i + 4);
    if (id === 'fmt ') bytesPorSegundo = datos.readUInt32LE(i + 16);
    if (id === 'data' && bytesPorSegundo) {
      const segundos = Math.round(Math.min(tamano, datos.length - i - 8) / bytesPorSegundo);
      return `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
    }
    i += 8 + tamano + (tamano % 2);
  }
  return null;
}

async function tituloDeMedio(url) {
  const base = posix.basename(new URL(url).pathname).replace(/\.[a-z0-9]+$/i, '');
  for (const termino of [base, base.replace(/[-_]+/g, ' ')]) {
    try {
      const datos = await obtener(`https://${HOST}/wp-json/wp/v2/media?search=${encodeURIComponent(termino)}&per_page=20&_fields=id,title,source_url`, 'application/json');
      const lista = JSON.parse(datos.toString('utf8'));
      const medio = Array.isArray(lista) ? lista.find((m) => normalizarUrl(m?.source_url ?? '') === url) : null;
      const titulo = medio ? decodificarEntidades(medio.title?.rendered ?? '').trim() : '';
      if (titulo) return titulo;
    } catch {
      // The title is optional.
    }
  }
  return null;
}

async function audio() {
  const AUDIO = /https?:\/\/[^\s"'<>()]+?\.(?:mp3|m4a|ogg|oga|wav)(?=[?#"'<\s)]|$)/gi;
  const fuentes = [join(REF, 'principales', 'inicio', 'page.html'), join(REF, 'principales', 'inicio', 'outline-desktop.json'), join(REF, 'principales', 'inicio', 'outline-mobile.json')];
  let url = null;
  for (const fuente of fuentes) {
    if (!existsSync(fuente)) continue;
    const texto = await readFile(fuente, 'utf8');
    const hallada = [...texto.matchAll(AUDIO)].map((m) => normalizarUrl(m[0])).find(esDelDominio);
    if (hallada) {
      url = hallada;
      break;
    }
  }
  if (!url) {
    console.warn('Audio del pie: no se encontró ningún archivo de audio en la referencia.');
    return;
  }
  const extension = (/\.([a-z0-9]+)$/i.exec(url)?.[1] ?? 'mp3').toLowerCase();
  const archivo = `${nombreSaneado(url)}.${extension}`;
  const ruta = join(SALIDA_AUDIO, archivo);
  await mkdir(SALIDA_AUDIO, { recursive: true });
  let datos;
  if (existsSync(ruta)) datos = await readFile(ruta);
  else {
    datos = await obtener(url, 'audio/*,*/*;q=0.8');
    await escribirAtomico(ruta, datos);
  }
  const tipos = { mp3: 'audio/mpeg', m4a: 'audio/mp4', ogg: 'audio/ogg', oga: 'audio/ogg', wav: 'audio/wav' };
  const anterior = await leerJson(join(DATA, 'medios.json'), {});
  const titulo = anterior.origen === url && anterior.titulo !== undefined ? anterior.titulo : await tituloDeMedio(url);
  const medios = {
    audioPie: `${RUTA_PUBLICA_AUDIO}/${archivo}`,
    titulo,
    tipo: tipos[extension] ?? 'audio/*',
    duracion: extension === 'wav' ? duracionWav(datos) : null,
    etiqueta: 'Reproductor de audio',
    origen: url,
  };
  await escribirAtomico(join(DATA, 'medios.json'), `${JSON.stringify(medios, null, 1)}\n`);
  console.log(`Audio del pie: ${medios.audioPie} (${megas(datos.length)} MB, ${medios.duracion ?? 'duración desconocida'}) · título: ${titulo ?? '(sin título)'}`);
}

async function principal() {
  if (!ARGS.includes('--solo-audio')) await imagenes();
  if (!SECO && !ARGS.includes('--sin-audio')) await audio();
}

principal().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
