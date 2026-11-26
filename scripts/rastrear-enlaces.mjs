// Link and image crawl of the static export, served by scripts/preview-pages.mjs (http://127.0.0.1:4173/TonySportBasica/).
// Starts at the home page, follows every internal page link and checks every internal link, image, srcset entry,
// script, stylesheet, media file and CSS url() it finds. Internal paths outside the site prefix count as broken.
// Usage: node scripts/rastrear-enlaces.mjs [--base=http://127.0.0.1:4173/TonySportBasica] [--salida=archivo.json] [--todas]
//   --todas  also starts from every page of out/, so pages nothing links (as on the official site) are checked too.
import { readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const opt = (name, fallback) => (argv.find(a => a.startsWith(`--${name}=`)) || `--${name}=${fallback}`).split('=').slice(1).join('=');
// Same prefix rule as next.config.ts (TONY_PAGES_BASE, default '/TonySportBasica').
const raw = (process.env.TONY_PAGES_BASE || '').trim();
const prefix = raw ? (raw.replace(/^\/+|\/+$/g, '') ? `/${raw.replace(/^\/+|\/+$/g, '')}` : '') : '/TonySportBasica';
const BASE = opt('base', `http://127.0.0.1:4173${prefix}`).replace(/\/$/, '');
const SALIDA = opt('salida', '');
const origin = new URL(BASE).origin;
const basePath = new URL(BASE).pathname.replace(/\/$/, '');

const ENTIDADES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', '#39': "'", '#x27': "'", '#38': '&' };
const decodificar = s => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => ENTIDADES[e.toLowerCase()] ?? (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : m));
const esPagina = pathname => pathname.endsWith('/') || !/\.[a-z0-9]{2,5}$/i.test(pathname);

const estados = new Map(); // url -> status
const usos = new Map(); // url -> Set(page)
const paginas = new Set();
const cola = [];
const externos = new Set();
let fueraDelPrefijo = [];

function anotar(url, desde) {
  if (!usos.has(url)) usos.set(url, new Set());
  usos.get(url).add(desde);
}
function resolver(valor, desde) {
  const v = decodificar(valor.trim());
  if (!v || v.startsWith('#') || /^(mailto|tel|javascript|data|blob|about|sms|whatsapp):/i.test(v)) return null;
  let u;
  try { u = new URL(v, desde); } catch { return null; }
  if (u.origin !== origin) { if (/^https?:$/.test(u.protocol)) externos.add(u.origin); return null; }
  u.hash = '';
  return u;
}
const urlsCss = texto => [...texto.matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi)].map(m => m[2]);
function extraer(html) {
  // Markup only: inline scripts (the RSC payload) are left out.
  const marcado = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const salida = [];
  for (const m of marcado.matchAll(/\s(?:href|src|poster|data-src)=(["'])(.*?)\1/gi)) salida.push(m[2]);
  for (const m of marcado.matchAll(/\s(?:srcset|imagesrcset)=(["'])(.*?)\1/gi)) for (const parte of decodificar(m[2]).split(/,\s+/)) salida.push(parte.trim().split(/\s+/)[0]);
  for (const m of marcado.matchAll(/\sstyle=(["'])(.*?)\1/gi)) salida.push(...urlsCss(decodificar(m[2])));
  for (const m of marcado.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) salida.push(...urlsCss(m[1]));
  return salida;
}

async function pedir(url, metodo = 'GET') {
  for (let intento = 0; intento < 3; intento++) {
    try {
      const res = await fetch(url, { method: metodo, redirect: 'manual' });
      return res;
    } catch (error) {
      if (intento === 2) throw error;
      await new Promise(r => setTimeout(r, 300));
    }
  }
}

async function visitarPagina(url) {
  const res = await pedir(url);
  estados.set(url, res.status);
  if (res.status !== 200) return;
  const tipo = res.headers.get('content-type') || '';
  if (!tipo.includes('text/html')) return;
  const html = await res.text();
  for (const valor of extraer(html)) {
    const u = resolver(valor, url);
    if (!u) continue;
    if (basePath && u.pathname !== basePath && !u.pathname.startsWith(`${basePath}/`)) { fueraDelPrefijo.push(`${u.pathname} (en ${new URL(url).pathname})`); continue; }
    const clave = u.href;
    anotar(clave, new URL(url).pathname);
    if (esPagina(u.pathname) && !u.search) { const sin = u.href; if (!paginas.has(sin)) { paginas.add(sin); cola.push(sin); } }
    else if (!estados.has(clave)) estados.set(clave, null);
  }
}

async function enParalelo(lista, n, trabajo) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < lista.length) { const x = lista[i++]; await trabajo(x); } }));
}

const inicio = `${BASE}/`;
paginas.add(inicio);
cola.push(inicio);
if (argv.includes('--todas')) {
  const out = fileURLToPath(new URL('../out/', import.meta.url));
  const pendientes = [out];
  while (pendientes.length) {
    const dir = pendientes.pop();
    const entradas = await readdir(dir, { withFileTypes: true });
    if (entradas.some(e => e.isFile() && e.name === 'index.html')) {
      const ruta = relative(out, dir).split(sep).join('/');
      const url = `${BASE}/${ruta ? `${ruta}/` : ''}`;
      if (!/^(_not-found|404)$/.test(ruta) && !paginas.has(url)) { paginas.add(url); cola.push(url); }
    }
    pendientes.push(...entradas.filter(e => e.isDirectory()).map(e => join(dir, e.name)));
  }
}
const t0 = Date.now();
while (cola.length) {
  const lote = cola.splice(0, cola.length);
  await enParalelo(lote, 8, visitarPagina);
}
// Pages with a query (?orderby=…) and every non-page resource: status only (CSS files are scanned for url()).
const recursos = [...estados.entries()].filter(([, s]) => s === null).map(([u]) => u);
const css = [];
await enParalelo(recursos, 16, async url => {
  const esCss = /\.css(\?|$)/.test(url);
  const res = await pedir(url, esCss ? 'GET' : 'HEAD');
  estados.set(url, res.status);
  if (esCss && res.status === 200) css.push([url, await res.text()]);
});
for (const [url, texto] of css) {
  for (const valor of urlsCss(texto)) {
    const u = resolver(valor, url);
    if (!u) continue;
    anotar(u.href, new URL(url).pathname);
    if (!estados.has(u.href)) { const res = await pedir(u.href, 'HEAD'); estados.set(u.href, res.status); }
  }
}

const rotos = [...estados.entries()].filter(([, s]) => s !== 200).map(([url, s]) => ({ url: new URL(url).pathname + new URL(url).search, estado: s, desde: [...(usos.get(url) || [])].slice(0, 5) }));
fueraDelPrefijo = [...new Set(fueraDelPrefijo)];
const resumen = {
  base: BASE,
  segundos: Math.round((Date.now() - t0) / 1000),
  paginas: [...paginas].length,
  recursos: estados.size - paginas.size,
  imagenes: [...estados.keys()].filter(u => /\.(webp|png|jpe?g|gif|svg|avif|ico)(\?|$)/i.test(u)).length,
  externos: [...externos].sort(),
  rotos,
  fueraDelPrefijo,
};
if (SALIDA) await writeFile(SALIDA, JSON.stringify({ ...resumen, listaPaginas: [...paginas].map(u => new URL(u).pathname).sort() }, null, 1));
console.log(`Rastreo de ${BASE}/: ${resumen.paginas} páginas, ${resumen.recursos} recursos (${resumen.imagenes} imágenes) en ${resumen.segundos} s.`);
console.log(`Dominios externos enlazados (no se revisan): ${resumen.externos.length}`);
if (fueraDelPrefijo.length) console.log(`Rutas internas sin el prefijo ${basePath}: ${fueraDelPrefijo.length}\n  ${fueraDelPrefijo.slice(0, 20).join('\n  ')}`);
if (rotos.length) {
  console.log(`Rotos: ${rotos.length}`);
  for (const r of rotos.slice(0, 60)) console.log(`  ${r.estado} ${r.url}  <- ${r.desde.join(', ')}`);
  process.exitCode = 1;
} else if (!fueraDelPrefijo.length) console.log('Sin enlaces ni imágenes rotos.');
if (fueraDelPrefijo.length) process.exitCode = 1;
