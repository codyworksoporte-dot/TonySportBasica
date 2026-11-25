// Fidelity check of the mirror against the captured official site.
// For every captured page (referencia-oficial/<group>/<slug>/outline-desktop.json) it opens the same path on the
// mirror (http://127.0.0.1:3001 by default) and reports which official texts, images and links are missing.
// Usage: node scripts/oficial/cobertura.mjs [--base=http://127.0.0.1:3001] [slug ...]
// Output: referencia-oficial/cobertura.json and a table on stdout.
import { chromium } from 'playwright';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REF = join(ROOT, 'referencia-oficial');
const argv = process.argv.slice(2);
const BASE = (argv.find(a => a.startsWith('--base=')) || '--base=http://127.0.0.1:3001').slice(7);
const ONLY = argv.filter(a => !a.startsWith('--'));
const OFFICIAL = 'https://www.tonysportselsalvador.com';

const images = existsSync(join(ROOT, 'data', 'oficial', 'imagenes.json')) ? JSON.parse(await readFile(join(ROOT, 'data', 'oficial', 'imagenes.json'), 'utf8')) : {};
const normalizeUrl = u => { try { const x = new URL(u.replace(/&amp;/g, '&'), OFFICIAL); x.search = ''; x.hash = ''; x.protocol = 'https:'; return decodeURI(x.href); } catch { return u; } };
const fold = t => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[“”«»"'’‘`´]/g, '').replace(/\s+/g, ' ').trim();
// WhatsApp links are compared by phone number (the mirror uses wa.me where the official uses api.whatsapp.com).
const whatsapp = href => {
  const m = /(?:api\.whatsapp\.com\/send|web\.whatsapp\.com\/send|wa\.me\/)\/?\??(?:.*?phone=)?(\d{8,15})/i.exec(href || '');
  return m ? `whatsapp:${m[1]}` : null;
};
const localPath = href => {
  const w = whatsapp(href);
  if (w) return w;
  try {
    const u = new URL(href, OFFICIAL);
    if (u.origin !== OFFICIAL) return null;
    let p = u.pathname.replace(/\/+$/, '/') || '/';
    if (!p.endsWith('/')) p += '/';
    return p;
  } catch { return null; }
};

async function references() {
  const out = [];
  for (const group of ['principales', 'otras', 'plantillas']) {
    if (!existsSync(join(REF, group))) continue;
    for (const slug of await readdir(join(REF, group))) {
      const file = join(REF, group, slug, 'outline-desktop.json');
      if (!existsSync(file) || (ONLY.length && !ONLY.includes(slug))) continue;
      const outline = JSON.parse(await readFile(file, 'utf8'));
      out.push({ group, slug, outline, path: localPath(outline.url) || '/' });
    }
  }
  return out;
}

function officialContent(outline) {
  const texts = new Set(), imgs = new Set(), links = new Set();
  const take = item => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote', 'figcaption', 'td', 'th', 'dt', 'dd', 'button', 'link'].includes(item.t) && item.text) {
      // Long paragraphs are checked by their first sentence-sized slice to tolerate line-break differences.
      const t = fold(item.text);
      if (t.length >= 3) texts.add(t.length > 140 ? t.slice(0, 140) : t);
    }
    for (const src of [item.src, item.image, ...(item.images || []).map(i => i.src)]) if (src && /tonysportselsalvador\.com/.test(src)) imgs.add(normalizeUrl(src));
    for (const l of [item.href, ...(item.links || []).map(l => l.href)]) if (l) { const p = localPath(l); links.add(p || l); }
  };
  for (const block of outline.blocks || []) {
    if (block.bg?.image && /tonysportselsalvador\.com/.test(block.bg.image)) imgs.add(normalizeUrl(block.bg.image));
    for (const col of block.columns || []) if (col.bg?.image && /tonysportselsalvador\.com/.test(col.bg.image)) imgs.add(normalizeUrl(col.bg.image));
    for (const item of block.items || []) take(item);
  }
  for (const slider of outline.sliders || []) for (const slide of slider.slides || []) {
    if (slide.image) imgs.add(normalizeUrl(slide.image));
    for (const layer of slide.layers || []) { if (layer.image) imgs.add(normalizeUrl(layer.image)); if (layer.href) links.add(localPath(layer.href) || layer.href); }
    if (slide.link) links.add(localPath(slide.link) || slide.link);
  }
  return { texts: [...texts], images: [...imgs], links: [...links].filter(l => l && !/^javascript:|^#/.test(l)) };
}

const refs = await references();
const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await context.addInitScript(() => { try { sessionStorage.setItem('tony:intro:v2', 'seen'); } catch {} });
const results = [];
for (const ref of refs) {
  const want = officialContent(ref.outline);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
  let status = 0, mirror = { text: '', srcs: [], hrefs: [] };
  try {
    const res = await page.goto(BASE + ref.path, { waitUntil: 'networkidle', timeout: 90000 });
    status = res?.status() || 0;
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    mirror = await page.evaluate(() => {
      // The official outlines also list the header and footer rows, so texts are searched in the whole page
      // (visible text plus visually hidden text such as screen-reader-only headings).
      const text = [document.body.innerText, ...[...document.querySelectorAll('.tc-sr, .sr-only, [class*="visually-hidden"]')].map(el => el.textContent || '')].join(' \n ');
      const srcs = [...document.querySelectorAll('img')].map(i => i.currentSrc || i.src).concat([...document.querySelectorAll('[style*="background-image"]')].map(e => (getComputedStyle(e).backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1]).filter(Boolean));
      const hrefs = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
      return { text, srcs, hrefs };
    });
  } catch (error) { errors.push(`navegación: ${error.message}`); }
  await page.close();
  const haystack = fold(mirror.text);
  const missingTexts = want.texts.filter(t => !haystack.includes(t));
  const localSrcs = new Set(mirror.srcs.map(s => { try { return decodeURI(new URL(s).pathname); } catch { return s; } }));
  // WordPress size variants (-400x400, -scaled…) of the same picture count as the same image.
  const stripSize = u => u.replace(/-(?:\d+x\d+|scaled|e\d+)(?=\.\w+$)/i, '');
  const shownOfficial = new Set();
  for (const [url, entry] of Object.entries(images)) if ([...localSrcs].some(s => s.endsWith(entry.src))) shownOfficial.add(stripSize(url));
  const missingImages = want.images.filter(u => {
    const entry = images[u];
    if (entry && [...localSrcs].some(s => s.endsWith(entry.src))) return false;
    return !shownOfficial.has(stripSize(u));
  });
  const mirrorLinks = new Set(mirror.hrefs.map(h => {
    if (!h) return h;
    if (whatsapp(h)) return whatsapp(h);
    if (/^https?:/.test(h)) { const p = localPath(h); return p || h.replace(/\/$/, ''); }
    if (!h.startsWith('/')) return h; // mailto:, tel:, #…
    return h.replace(/^\/TonySport[^/]*/, '').replace(/\/?$/, '/').replace(/\/\?/, '?');
  }));
  const missingLinks = want.links.filter(l => {
    const key = /^https?:/.test(l) ? l.replace(/\/$/, '') : l;
    return !mirrorLinks.has(key) && !mirrorLinks.has(l);
  });
  const pct = (miss, all) => all ? Math.round(100 * (all - miss) / all) : 100;
  results.push({
    group: ref.group, slug: ref.slug, path: ref.path, status,
    texts: { total: want.texts.length, missing: missingTexts, coverage: pct(missingTexts.length, want.texts.length) },
    images: { total: want.images.length, missing: missingImages, coverage: pct(missingImages.length, want.images.length) },
    links: { total: want.links.length, missing: missingLinks, coverage: pct(missingLinks.length, want.links.length) },
    errors: [...new Set(errors)].slice(0, 10),
  });
  console.log(`${String(status).padEnd(4)} ${ref.path.padEnd(52)} textos ${String(results.at(-1).texts.coverage).padStart(3)}%  imágenes ${String(results.at(-1).images.coverage).padStart(3)}%  enlaces ${String(results.at(-1).links.coverage).padStart(3)}%${errors.length ? `  errores:${errors.length}` : ''}`);
}
await browser.close();
await writeFile(join(REF, ONLY.length ? `cobertura-${ONLY.join('_').slice(0, 60)}.json` : 'cobertura.json'), JSON.stringify(results, null, 1));
const avg = key => Math.round(results.reduce((s, r) => s + r[key].coverage, 0) / Math.max(1, results.length));
console.log(`\n${results.length} páginas · textos ${avg('texts')}% · imágenes ${avg('images')}% · enlaces ${avg('links')}% · con errores de consola: ${results.filter(r => r.errors.length).length} · no-200: ${results.filter(r => r.status !== 200).length}`);
