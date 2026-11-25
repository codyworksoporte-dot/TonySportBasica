// Side-by-side boards: the captured official page next to the same route on the mirror.
// For every reference (referencia-oficial/<group>/<slug>/) it takes a full-page capture of the mirror at the same
// viewport (1440x900 desktop, 390x844 mobile) and writes referencia-oficial/lado-a-lado/<slug>-<vista>.jpg.
// Usage: node scripts/oficial/lado-a-lado.mjs [--base=http://127.0.0.1:3001] [--vista=escritorio|celular|ambas]
//                                            [--alto=0] [--ancho=720] [slug ...]
//   --alto   crop each board to this many output pixels (0 = whole page)
//   --ancho  column width for desktop boards (mobile columns are always 390)
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REF = join(ROOT, 'referencia-oficial');
const OUT = join(REF, 'lado-a-lado');
const SHOTS = join(REF, '_trabajo', 'lado-a-lado');
const argv = process.argv.slice(2);
const opt = (name, fallback) => (argv.find(a => a.startsWith(`--${name}=`)) || `--${name}=${fallback}`).split('=').slice(1).join('=');
const BASE = opt('base', 'http://127.0.0.1:3001');
const VISTA = opt('vista', 'ambas');
const ALTO = Number(opt('alto', '0')) || 0;
const ANCHO = Number(opt('ancho', '720')) || 720;
const ONLY = argv.filter(a => !a.startsWith('--'));
const OFFICIAL = 'https://www.tonysportselsalvador.com';
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36';
const VIEWS = [
  { name: 'escritorio', ref: 'desktop', width: 1440, height: 900, column: ANCHO },
  { name: 'celular', ref: 'mobile', width: 390, height: 844, column: 390, mobile: true },
].filter(v => VISTA === 'ambas' || v.name === VISTA);

const localPath = href => {
  try {
    const u = new URL(href, OFFICIAL);
    let p = u.pathname.replace(/\/+$/, '/') || '/';
    if (!p.endsWith('/')) p += '/';
    return p;
  } catch { return '/'; }
};

async function references() {
  const out = [];
  for (const group of ['principales', 'otras', 'plantillas']) {
    if (!existsSync(join(REF, group))) continue;
    for (const slug of await readdir(join(REF, group))) {
      const file = join(REF, group, slug, 'outline-desktop.json');
      if (!existsSync(file) || (ONLY.length && !ONLY.includes(slug))) continue;
      const outline = JSON.parse(await readFile(file, 'utf8'));
      out.push({ group, slug, path: localPath(outline.url), dir: join(REF, group, slug) });
    }
  }
  return out;
}

// Official captures are either <name>.jpg or <name>-1.jpg, <name>-2.jpg… (pages taller than 14000 px).
async function partsOf(dir, name) {
  if (existsSync(join(dir, `${name}.jpg`))) return [join(dir, `${name}.jpg`)];
  const files = (await readdir(dir)).filter(f => new RegExp(`^${name}-\\d+\\.jpg$`).test(f));
  return files.sort((a, b) => Number(a.match(/(\d+)\.jpg$/)[1]) - Number(b.match(/(\d+)\.jpg$/)[1])).map(f => join(dir, f));
}

// Stitches the parts vertically and scales them to `width`.
async function column(parts, width) {
  if (!parts.length) return null;
  const metas = await Promise.all(parts.map(p => sharp(p).metadata()));
  const w = metas[0].width;
  const total = metas.reduce((s, m) => s + m.height, 0);
  let top = 0;
  const layers = parts.map((p, i) => { const layer = { input: p, top, left: 0 }; top += metas[i].height; return layer; });
  const stitched = await sharp({ create: { width: w, height: total, channels: 3, background: '#ffffff' } }).composite(layers).jpeg({ quality: 90 }).toBuffer();
  return sharp(stitched).resize({ width }).jpeg({ quality: 82 }).toBuffer({ resolveWithObject: true });
}

async function shootMirror(browser, ref, view) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    deviceScaleFactor: 1,
    locale: 'es-SV',
    ...(view.mobile ? { userAgent: MOBILE_UA, isMobile: true, hasTouch: true } : {}),
  });
  await context.addInitScript(() => { try { sessionStorage.setItem('tony:intro:v2', 'seen'); } catch {} });
  const page = await context.newPage();
  const files = [];
  try {
    await page.goto(BASE + ref.path, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.evaluate(async () => {
      const step = Math.round(innerHeight * 0.7);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const base = join(SHOTS, `${ref.slug}-${view.name}`);
    if (height <= 14000) {
      await page.screenshot({ path: `${base}.jpg`, fullPage: true, type: 'jpeg', quality: 80 });
      files.push(`${base}.jpg`);
    } else {
      let part = 0;
      for (let y = 0; y < height; y += 12000) {
        part++;
        await page.screenshot({ path: `${base}-${part}.jpg`, fullPage: true, clip: { x: 0, y, width: view.width, height: Math.min(12000, height - y) }, type: 'jpeg', quality: 80 });
        files.push(`${base}-${part}.jpg`);
      }
    }
  } finally {
    await context.close();
  }
  return files;
}

const label = (text, width, height = 56) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#050a07"/>` +
  `<text x="16" y="${Math.round(height * 0.64)}" fill="#b4ff35" font-family="Arial, Helvetica, sans-serif" font-size="${width < 500 ? 17 : 22}" font-weight="700">${text}</text></svg>`,
);

async function board(ref, view, officialCol, mirrorCol) {
  const gap = 24, head = 56;
  const w = view.column;
  const bodyHeight = Math.max(officialCol?.info.height || 0, mirrorCol?.info.height || 0);
  const height = head + (ALTO ? Math.min(ALTO, bodyHeight) : bodyHeight);
  const crop = async col => col && (col.info.height > height - head
    ? sharp(col.data).extract({ left: 0, top: 0, width: w, height: height - head }).toBuffer()
    : col.data);
  const layers = [
    { input: label(`OFICIAL · ${ref.path}`, w), top: 0, left: 0 },
    { input: label(`WEB BÁSICA · ${ref.path}`, w), top: 0, left: w + gap },
  ];
  const off = await crop(officialCol);
  const mir = await crop(mirrorCol);
  if (off) layers.push({ input: off, top: head, left: 0 });
  if (mir) layers.push({ input: mir, top: head, left: w + gap });
  const file = join(OUT, `${ref.slug}-${view.name}.jpg`);
  await sharp({ create: { width: w * 2 + gap, height, channels: 3, background: '#1b2a20' } }).composite(layers).jpeg({ quality: 80 }).toFile(file);
  return file;
}

await mkdir(OUT, { recursive: true });
await mkdir(SHOTS, { recursive: true });
const refs = await references();
const browser = await chromium.launch({ channel: 'msedge' });
let done = 0;
for (const ref of refs) {
  for (const view of VIEWS) {
    try {
      const officialCol = await column(await partsOf(ref.dir, view.ref), view.column);
      const mirrorCol = await column(await shootMirror(browser, ref, view), view.column);
      const file = await board(ref, view, officialCol, mirrorCol);
      done++;
      console.log(`${ref.path.padEnd(52)} ${view.name.padEnd(10)} -> ${file.slice(ROOT.length + 1)}`);
    } catch (error) {
      console.log(`${ref.path.padEnd(52)} ${view.name.padEnd(10)} ERROR ${String(error.message || error).slice(0, 160)}`);
    }
  }
}
await browser.close();
console.log(`\n${done} tableros en ${OUT}`);
