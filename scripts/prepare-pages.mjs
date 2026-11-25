// Finishes the static export in out/ for GitHub Pages and checks that it is a usable mirror.
// Usage (same TONY_PAGES_BASE as the build):
//   TONY_GITHUB_PAGES=true npm run build && node scripts/prepare-pages.mjs
import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Same rule as next.config.ts: empty or unset keeps '/TonySportBasica', '/' publishes at the domain root.
function pagesBase(value = process.env.TONY_PAGES_BASE) {
  const raw = value?.trim();
  if (!raw) return '/TonySportBasica';
  const path = raw.replace(/^\/+|\/+$/g, '');
  if (!/^[\w.~-]+(\/[\w.~-]+)*$/.test(path) && path !== '') throw new Error(`TONY_PAGES_BASE no es una ruta válida: "${value}".`);
  return path ? `/${path}` : '';
}

const basePath = pagesBase();
const directory = new URL('../out/', import.meta.url);
const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function readPage(relative) {
  try { return (await readFile(new URL(relative, directory), 'utf8')).normalize('NFC'); }
  catch { return null; }
}
// Stop before touching any file when out/ was built with another base path (or not built at all).
const homepage = await readPage('index.html');
if (homepage === null) throw new Error('Falta out/index.html: compila primero con TONY_GITHUB_PAGES=true npm run build.');
if (!homepage.includes(`${basePath}/_next/`)) throw new Error(`La portada no carga sus scripts desde ${basePath}/_next/: compila y prepara con el mismo TONY_PAGES_BASE.`);
// Next serializes HTML and RSC payloads; rewriting them after build breaks hydration.
// Component asset URLs are prefixed at build time. Only CSS url() paths need this pass.
const textExtensions = new Set(['.css']);
const unprefixedAsset = new RegExp(`(?<!${escapeRegExp(basePath)})/assets/`, 'g');
let replacements = 0;

async function visit(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) { await visit(path); continue; }
    if (!entry.isFile() || !textExtensions.has(extname(entry.name))) continue;
    const original = await readFile(path, 'utf8');
    let count = 0;
    const updated = original.replace(unprefixedAsset, () => { count++; return `${basePath}/assets/`; });
    if (count) { replacements += count; await writeFile(path, updated); }
  }
}

if (basePath) await visit(fileURLToPath(directory));
// Next's exported prefetch manifest requests a flat RSC filename, while the
// Windows export writes the page payload into a folder with the same stem.
// Keep both paths so client navigation also works on static hosting.
async function copyPayloads(folder, routeFolder, prefix) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const source = join(folder, entry.name);
    const flatName = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) await copyPayloads(source, routeFolder, flatName);
    else if (entry.isFile() && extname(entry.name) === '.txt') await copyFile(source, join(routeFolder, flatName));
  }
}
async function prepareRoutes(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = join(folder, entry.name);
    if (entry.name.startsWith('__next.')) await copyPayloads(child, folder, entry.name);
    else if (!entry.name.startsWith('_') && entry.name !== 'assets') await prepareRoutes(child);
  }
}
await prepareRoutes(fileURLToPath(directory));

// Mirror checks: the home page links through the base path, and the official «CREÁ TU PEDIDO» page exists.
const problems = [];
if (!new RegExp(`\\shref="${escapeRegExp(basePath)}/[^"/]`).test(homepage)) problems.push(`la portada no tiene enlaces internos con el prefijo ${basePath || '/'}`);
const outside = [...homepage.matchAll(/\s(?:href|src)="(\/(?!\/)[^"]*)"/g)].map(match => match[1])
  .filter(url => basePath && url !== basePath && !url.startsWith(`${basePath}/`));
if (outside.length) problems.push(`la portada tiene rutas sin el prefijo ${basePath}: ${[...new Set(outside)].slice(0, 5).join(', ')}`);
const orderPage = await readPage('crea-tu-pedido/index.html');
if (orderPage === null) problems.push('falta out/crea-tu-pedido/index.html (la página «CREÁ TU PEDIDO» del espejo)');
else if (!orderPage.includes('CREÁ TU PEDIDO')) problems.push('out/crea-tu-pedido/index.html no contiene el texto «CREÁ TU PEDIDO»');
if (problems.length) throw new Error(`La exportación para GitHub Pages no es válida:\n- ${problems.join('\n- ')}`);

await writeFile(new URL('../out/.nojekyll', import.meta.url), '');
console.log(`GitHub Pages listo con el prefijo ${basePath || '/'}: ${replacements} referencias de CSS prefijadas.`);
