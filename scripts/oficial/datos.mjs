// Refreshes only the catalogue data (data/oficial/productos.json and categorias.json) from the official public
// Store API, in the same format scripts/oficial/capturar.mjs writes, without recapturing the reference pages.
// It first prints what changed (products removed or added, changed fields, category counts); --escribir saves it.
// Then run node scripts/oficial/imagenes.mjs --ancho-galeria 1000 --sin-audio for the images that are missing.
// Usage: node scripts/oficial/datos.mjs [--escribir]
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'data', 'oficial');
const BASE = 'https://www.tonysportselsalvador.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const ESCRIBIR = process.argv.includes('--escribir');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJSON(path) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(BASE + path, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (!res.ok) throw new Error(`${res.status} ${path}`);
      return { body: await res.json(), pages: Number(res.headers.get('x-wp-totalpages') || 1) };
    } catch (error) {
      if (attempt >= 3) throw error;
      await sleep(2000 * (attempt + 1));
    }
  }
}
async function collection(path) {
  const sep = path.includes('?') ? '&' : '?';
  const first = await getJSON(`${path}${sep}page=1`);
  let items = first.body;
  for (let page = 2; page <= first.pages; page++) { await sleep(400); items = items.concat((await getJSON(`${path}${sep}page=${page}`)).body); }
  return items;
}

const productos = await collection('/wp-json/wc/store/products?per_page=100');
const categorias = await collection('/wp-json/wc/store/products/categories?per_page=100');
const viejoP = JSON.parse(await readFile(join(DATA, 'productos.json'), 'utf8')).products;
const viejoC = JSON.parse(await readFile(join(DATA, 'categorias.json'), 'utf8')).categories;
const slug = p => new URL(p.permalink).pathname.split('/').filter(Boolean).pop();
const porId = lista => new Map(lista.map(x => [x.id, x]));
const antesP = porId(viejoP), ahoraP = porId(productos), antesC = porId(viejoC), ahoraC = porId(categorias);

console.log(`Productos: ${viejoP.length} -> ${productos.length}`);
for (const p of viejoP.filter(p => !ahoraP.has(p.id))) console.log(`  - quitado ${slug(p)} «${p.name}»`);
for (const p of productos.filter(p => !antesP.has(p.id))) console.log(`  + nuevo ${slug(p)} «${p.name}»`);
const cambios = {};
for (const p of productos) {
  const v = antesP.get(p.id);
  if (!v) continue;
  for (const campo of ['name', 'permalink', 'prices', 'price_html', 'on_sale', 'images', 'categories', 'tags', 'short_description', 'description', 'add_to_cart', 'is_purchasable', 'is_in_stock'])
    if (JSON.stringify(v[campo]) !== JSON.stringify(p[campo])) (cambios[campo] ??= []).push(slug(p));
}
for (const [campo, lista] of Object.entries(cambios)) console.log(`  ~ ${campo}: ${lista.length} (${lista.slice(0, 5).join(', ')}${lista.length > 5 ? '…' : ''})`);
console.log(`Categorías: ${viejoC.length} -> ${categorias.length}`);
for (const c of viejoC.filter(c => !ahoraC.has(c.id))) console.log(`  - quitada ${c.slug}`);
for (const c of categorias.filter(c => !antesC.has(c.id))) console.log(`  + nueva ${c.slug} (${c.count})`);
for (const c of categorias) { const v = antesC.get(c.id); if (v && v.count !== c.count) console.log(`  ~ ${c.slug}: ${v.count} -> ${c.count} productos`); }

if (ESCRIBIR) {
  const ahora = new Date().toISOString();
  await writeFile(join(DATA, 'productos.json'), JSON.stringify({ source: BASE, retrievedAt: ahora, products: productos }, null, 1));
  await writeFile(join(DATA, 'categorias.json'), JSON.stringify({ source: BASE, retrievedAt: ahora, categories: categorias }, null, 1));
  console.log('Escritos data/oficial/productos.json y categorias.json.');
} else console.log('Sin cambios en disco: repite con --escribir para guardarlo.');
