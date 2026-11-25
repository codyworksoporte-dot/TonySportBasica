// Reference capture of the official site (tonysportselsalvador.com) for the web básica mirror.
//  - Data from the public WordPress / WooCommerce APIs -> data/oficial/*.json (used by the site).
//  - For every page: desktop + phone screenshots, rendered HTML and a block outline
//    (positions, texts, images, buttons, menus) -> referencia-oficial/ (local reference, not committed).
// Usage: node scripts/oficial/capturar.mjs            (everything)
//        node scripts/oficial/capturar.mjs inicio app-tony   (only those slugs, no data refresh)
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = 'https://www.tonysportselsalvador.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const DATA = join(ROOT, 'data', 'oficial');
const REF = join(ROOT, 'referencia-oficial');
const ONLY = process.argv.slice(2);
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
  const join = path.includes('?') ? '&' : '?';
  const first = await getJSON(`${path}${join}page=1`);
  let items = first.body;
  for (let page = 2; page <= first.pages; page++) items = items.concat((await getJSON(`${path}${join}page=${page}`)).body);
  return items;
}

const MAIN = [
  ['inicio', '/'], ['crea-tu-pedido', '/crea-tu-pedido/'], ['app-tony', '/app-tony/'], ['tienda-en-linea', '/tienda-en-linea/'],
  ['productos3', '/productos3/'], ['promociones', '/promociones/'], ['patrocinadores', '/patrocinadores/'],
  ['nuestras-tiendas', '/nuestras-tiendas/'], ['nuestra-calidad', '/nuestra-calidad/'], ['servicio-a-domicilio', '/servicio-a-domicilio/'],
  ['contacto', '/contacto/'], ['tony-news', '/tony-news/'], ['rse-tony', '/categoria/rse-tony/'],
];
const OTHER = [
  'subliminado', 'replica', 'implementos-deportivos', 'tipo-de-sublimando', 'quienes-somos', 'galeria', 'proyectos', 'como-comprar',
  'politica-de-privacidad', 'carrito', 'productos', 'uniformes-bkb', 'copa-tony-sportswear', 'blog', 'mi-cuenta', 'catalogo', 'eventos',
  'paquetes', 'testimoniales-productos', 'premios-app', 'confeccion-de-uniformes-personalizados',
].map(slug => [slug, `/${slug}/`]);
const CHILDREN = [
  ['descarga-nuestra-app', '/app-tony/descarga-nuestra-app/'], ['street-wear', '/tienda-en-linea/street-wear/'],
  ['camisas-venta-individual', '/tienda-en-linea/camisas-venta-individual/'],
];

// ---- runs inside the page -------------------------------------------------------------
function extractOutline() {
  const visible = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05;
  };
  const box = el => { const r = el.getBoundingClientRect(); return [Math.round(r.left + scrollX), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)]; };
  const clean = t => (t || '').replace(/\s+/g, ' ').trim();
  const abs = u => { try { return u ? new URL(u, location.href).href : null; } catch { return u; } };
  const font = el => {
    const s = getComputedStyle(el);
    return { family: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), size: s.fontSize, weight: s.fontWeight, color: s.color, align: s.textAlign, transform: s.textTransform, lineHeight: s.lineHeight };
  };
  const background = el => {
    const s = getComputedStyle(el);
    const m = s.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    const lazy = el.getAttribute('data-bg') || el.getAttribute('data-lazy-background') || el.getAttribute('data-vc-parallax-image');
    return { color: s.backgroundColor, image: m ? abs(m[1]) : abs(lazy) };
  };
  const imgSrc = img => abs(img.getAttribute('data-lazy-src') || img.getAttribute('data-lazyload') || img.getAttribute('data-src') || img.currentSrc || img.getAttribute('src'));
  const isButton = a => {
    if (/btn|button|vc_general|vc_btn/i.test(a.className)) return true;
    const s = getComputedStyle(a);
    const filled = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
    return filled && parseFloat(s.paddingLeft) >= 8;
  };
  const buttonStyle = el => { const s = getComputedStyle(el); return { bg: s.backgroundColor, color: s.color, radius: s.borderRadius, border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, padding: `${s.paddingTop} ${s.paddingRight}`, font: font(el) }; };
  const TEXT = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,td,th,dt,dd,label';

  function sliders(root) {
    return [...root.querySelectorAll('rs-module, .rev_slider')].map(slider => ({
      box: box(slider),
      slides: [...slider.querySelectorAll('rs-slide, li[data-index]')].map(slide => {
        const bg = slide.querySelector('img.rev-slidebg, img');
        return {
          title: slide.getAttribute('data-title') || null,
          link: abs(slide.getAttribute('data-link')),
          image: bg ? imgSrc(bg) : null,
          layers: [...slide.querySelectorAll('rs-layer, .tp-caption')].map(layer => ({ text: clean(layer.textContent), href: abs(layer.closest('a')?.getAttribute('href') || layer.getAttribute('data-actions')?.match(/url":"([^"]+)/)?.[1]), image: layer.querySelector('img') ? imgSrc(layer.querySelector('img')) : null })).filter(l => l.text || l.image),
        };
      }),
    }));
  }

  function items(root) {
    const out = [];
    const taken = [];
    const inside = el => taken.some(t => t !== el && t.contains(el));
    const selector = `${TEXT},img,a,button,iframe,video,form,input,select,textarea,[style*="background-image"]`;
    for (const el of root.querySelectorAll(selector)) {
      if (!visible(el) || el.closest('rs-module, .rev_slider')) continue;
      const tag = el.tagName.toLowerCase();
      if (el.matches(TEXT)) {
        if (inside(el)) continue;
        const text = clean(el.innerText);
        if (!text && !el.querySelector('img')) continue;
        taken.push(el);
        const links = [...el.querySelectorAll('a')].map(a => ({ text: clean(a.innerText), href: abs(a.getAttribute('href')) })).filter(l => l.href);
        const images = [...el.querySelectorAll('img')].filter(visible).map(img => ({ src: imgSrc(img), alt: img.alt, box: box(img) }));
        out.push({ t: tag, text, box: box(el), font: font(el), ...(links.length ? { links } : {}), ...(images.length ? { images } : {}) });
      } else if (tag === 'a') {
        if (inside(el)) continue;
        const img = el.querySelector('img');
        if (img) { taken.push(el); out.push({ t: 'link-image', href: abs(el.getAttribute('href')), src: imgSrc(img), alt: img.alt, text: clean(el.innerText) || null, box: box(el) }); continue; }
        const text = clean(el.innerText);
        if (!text && !el.querySelector('i,svg')) continue;
        taken.push(el);
        out.push(isButton(el)
          ? { t: 'button', text, href: abs(el.getAttribute('href')), box: box(el), style: buttonStyle(el) }
          : { t: 'link', text, href: abs(el.getAttribute('href')), icon: el.querySelector('i')?.className || null, box: box(el), font: font(el) });
      } else if (tag === 'img') {
        if (inside(el)) continue;
        out.push({ t: 'img', src: imgSrc(el), alt: el.alt, natural: [el.naturalWidth, el.naturalHeight], box: box(el) });
      } else if (tag === 'button') {
        if (inside(el)) continue;
        taken.push(el);
        out.push({ t: 'button', text: clean(el.innerText), aria: el.getAttribute('aria-label'), box: box(el), style: buttonStyle(el) });
      } else if (tag === 'iframe' || tag === 'video') {
        out.push({ t: tag, src: abs(el.getAttribute('src') || el.getAttribute('data-lazy-src') || el.querySelector('source')?.getAttribute('src')), box: box(el) });
      } else if (tag === 'form') {
        out.push({ t: 'form', action: abs(el.getAttribute('action')), fields: [...el.querySelectorAll('input,select,textarea')].filter(f => f.type !== 'hidden').map(f => ({ tag: f.tagName.toLowerCase(), type: f.type, name: f.name, placeholder: f.placeholder || null, label: clean(f.closest('label')?.innerText || '') || null })), box: box(el) });
        taken.push(el);
      } else if (el.hasAttribute('style')) {
        const bg = background(el);
        if (bg.image && !inside(el)) out.push({ t: 'background', image: bg.image, box: box(el) });
      }
    }
    return out;
  }

  function menus(root) {
    const serialize = ul => [...ul.children].filter(li => li.tagName === 'LI').map(li => {
      const a = li.querySelector(':scope > a');
      const sub = li.querySelector(':scope > ul, :scope > .sub-menu, :scope > div > ul');
      return { text: clean(a?.textContent), href: abs(a?.getAttribute('href')), current: /current/.test(li.className), children: sub ? serialize(sub) : [] };
    });
    return [...root.querySelectorAll('ul')].filter(ul => !ul.parentElement.closest('ul') && ul.querySelector(':scope > li > a')).map(ul => ({ id: ul.id || null, classes: ul.className || null, visible: visible(ul), box: box(ul), items: serialize(ul) }));
  }

  const header = document.querySelector('#masthead, header.site-header, header, #header, .header');
  const footer = document.querySelector('#colophon, footer.site-footer, footer, #footer, .footer');
  const main = document.querySelector('#main, main, #content, .site-content, #primary') || document.body;
  const blockSelector = '.vc_row, rs-module-wrap, rs-fullwidth-wrap, .rev_slider_wrapper, ul.products, .woocommerce, .woocommerce-products-header, nav.woocommerce-pagination, section, article, .entry-header, .page-header';
  let blocks = [...main.querySelectorAll(blockSelector)].filter(el => !el.parentElement.closest(blockSelector) && visible(el) && !(header && header.contains(el)) && !(footer && footer.contains(el)));
  if (!blocks.length) blocks = [...main.children].filter(visible);

  const fixed = [...document.querySelectorAll('body *')].filter(el => {
    const s = getComputedStyle(el);
    return (s.position === 'fixed' || s.position === 'sticky') && visible(el) && !el.parentElement.closest('[style*="fixed"]');
  }).filter((el, i, all) => !all.some(o => o !== el && o.contains(el))).map(el => ({ position: getComputedStyle(el).position, box: box(el), bg: background(el), text: clean(el.innerText).slice(0, 300), items: items(el).slice(0, 30) }));

  return {
    url: location.href,
    title: document.title,
    viewport: [innerWidth, innerHeight],
    height: document.documentElement.scrollHeight,
    body: { bg: background(document.body), font: font(document.body) },
    header: header ? { box: box(header), bg: background(header), items: items(header), menus: menus(header) } : null,
    sliders: sliders(main),
    blocks: blocks.map((el, i) => ({
      i, tag: el.tagName.toLowerCase(), classes: [...el.classList].slice(0, 6).join(' '), box: box(el), bg: background(el),
      columns: [...el.querySelectorAll(':scope > .wpb_column, :scope > .vc_column_container, :scope > div > .wpb_column')].map(c => ({ classes: [...c.classList].filter(x => /col|offset/.test(x)).join(' '), box: box(c), bg: background(c) })),
      items: items(el),
    })),
    footer: footer ? { box: box(footer), bg: background(footer), items: items(footer), menus: menus(footer) } : null,
    fixed,
  };
}

function detectOverlays() {
  const vw = innerWidth, vh = innerHeight;
  return [...document.querySelectorAll('body *')].filter(el => {
    const s = getComputedStyle(el);
    if (!['fixed', 'absolute'].includes(s.position) || s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) < 0.1) return false;
    const r = el.getBoundingClientRect();
    return r.width * r.height > vw * vh * 0.25 && (parseInt(s.zIndex) || 0) >= 100;
  }).slice(0, 3).map(el => ({ classes: el.className?.toString().slice(0, 120), text: el.innerText.replace(/\s+/g, ' ').trim().slice(0, 600), images: [...el.querySelectorAll('img')].map(i => i.currentSrc || i.src).slice(0, 8), links: [...el.querySelectorAll('a')].map(a => ({ text: a.innerText.trim(), href: a.href })).slice(0, 10) }));
}
// ----------------------------------------------------------------------------------------

async function closeOverlays(page) {
  await page.keyboard.press('Escape').catch(() => {});
  const selectors = [
    'button:has-text("Rechazar")', 'a:has-text("Rechazar")', '.cc-deny', '#cookie_action_close_header_reject',
    '.pum-close', '.popmake-close', '.mfp-close', '.modal .close', '[aria-label="Close"]', '[aria-label="Cerrar"]', '.dialog-close-button', '.close-button', '.fancybox-close-small',
  ];
  for (const selector of selectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible().catch(() => false)) await el.click({ timeout: 2000 }).catch(() => {});
  }
}

async function shoot(page, file) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const width = page.viewportSize().width;
  if (height <= 14000) { await page.screenshot({ path: `${file}.jpg`, fullPage: true, type: 'jpeg', quality: 70 }); return 1; }
  let part = 0;
  for (let y = 0; y < height; y += 12000) {
    part++;
    await page.screenshot({ path: `${file}-${part}.jpg`, fullPage: true, clip: { x: 0, y, width, height: Math.min(12000, height - y) }, type: 'jpeg', quality: 70 });
  }
  return part;
}

async function capture(browser, [slug, path], group, extras = {}) {
  const dir = join(REF, group, slug);
  await mkdir(dir, { recursive: true });
  const report = { slug, path, group };
  for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844, mobile: true }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, userAgent: vp.mobile ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36' : UA, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: 1, locale: 'es-SV' });
    const page = await context.newPage();
    try {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const popups = await page.evaluate(detectOverlays).catch(() => []);
      await closeOverlays(page);
      await page.evaluate(async () => {
        const step = Math.round(innerHeight * 0.7);
        for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 140)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
      await closeOverlays(page);
      const outline = await page.evaluate(extractOutline);
      outline.popups = popups;
      outline.finalUrl = page.url();
      report[`${vp.name}Parts`] = await shoot(page, join(dir, vp.name));
      if (vp.name === 'desktop') await writeFile(join(dir, 'page.html'), await page.content());
      if (extras.chrome && vp.name === 'desktop') {
        // Each top-level menu entry with a submenu, hovered.
        const tops = page.locator('#header li.menu-item-has-children > a');
        const count = Math.min(await tops.count(), 8);
        for (let i = 0; i < count; i++) {
          const link = tops.nth(i);
          if (!(await link.isVisible().catch(() => false))) continue;
          await link.hover().catch(() => {});
          await page.waitForTimeout(700);
          await page.screenshot({ path: join(dir, `desktop-menu-${i + 1}.jpg`), clip: { x: 0, y: 0, width: 1440, height: 900 }, type: 'jpeg', quality: 75 });
        }
      }
      if (extras.chrome && vp.name === 'mobile') {
        // The Elegante theme's hamburger: #mobile_menu_toggler opens #mobile_menu.
        const toggles = page.locator('#mobile_menu_toggler');
        const n = await toggles.count();
        for (let i = 0; i < n; i++) {
          const t = toggles.nth(i);
          const label = `#mobile_menu_toggler ${await t.getAttribute('class').catch(() => '')}`;
          await t.click({ timeout: 3000 }).catch(() => {});
          await page.waitForTimeout(900);
          await page.screenshot({ path: join(dir, 'mobile-menu.jpg'), type: 'jpeg', quality: 75 });
          await page.screenshot({ path: join(dir, 'mobile-menu-full.jpg'), fullPage: true, type: 'jpeg', quality: 70 }).catch(() => {});
          outline.mobileMenu = await page.evaluate(() => {
            const clean = t => (t || '').replace(/\s+/g, ' ').trim();
            const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && s.display !== 'none' && s.visibility !== 'hidden'; };
            const serialize = ul => [...ul.children].filter(li => li.tagName === 'LI').map(li => { const a = li.querySelector(':scope > a'); const sub = li.querySelector(':scope > ul'); return { text: clean(a?.textContent), href: a?.href || null, children: sub ? serialize(sub) : [] }; });
            return [...document.querySelectorAll('ul')].filter(ul => vis(ul) && !ul.parentElement.closest('ul') && ul.querySelector(':scope > li > a')).map(ul => ({ classes: ul.className, items: serialize(ul) }));
          });
          outline.mobileMenuToggle = label.trim();
          break;
        }
      }
      await writeFile(join(dir, `outline-${vp.name}.json`), JSON.stringify(outline, null, 1));
      report[vp.name] = { height: outline.height, blocks: outline.blocks.length, popups: popups.length, finalUrl: outline.finalUrl };
    } catch (error) {
      report[`${vp.name}Error`] = String(error.message || error).slice(0, 300);
    } finally {
      await context.close();
    }
  }
  console.log(`${group}/${slug}`, JSON.stringify({ d: report.desktop?.blocks, m: report.mobile?.blocks, h: report.desktop?.height, err: report.desktopError || report.mobileError || '' }));
  return report;
}

async function pool(items, size, worker) {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) { const i = next++; results[i] = await worker(items[i]); await sleep(400); }
  }));
  return results;
}

const started = Date.now();
await mkdir(DATA, { recursive: true });
await mkdir(REF, { recursive: true });

let products = [];
if (!ONLY.length) {
  products = await collection('/wp-json/wc/store/products?per_page=100');
  const categories = await collection('/wp-json/wc/store/products/categories?per_page=100');
  const pages = await collection('/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,link,title,content,parent,menu_order,modified,featured_media');
  await writeFile(join(DATA, 'productos.json'), JSON.stringify({ source: BASE, retrievedAt: new Date().toISOString(), products }, null, 1));
  await writeFile(join(DATA, 'categorias.json'), JSON.stringify({ source: BASE, retrievedAt: new Date().toISOString(), categories }, null, 1));
  await writeFile(join(REF, 'paginas-wp.json'), JSON.stringify(pages, null, 1));
  console.log(`datos: ${products.length} productos, ${categories.length} categorías, ${pages.length} páginas`);
}

if (!products.length) {
  const { readFile } = await import('node:fs/promises');
  try { products = JSON.parse(await readFile(join(DATA, 'productos.json'), 'utf8')).products; } catch { products = []; }
}
// The Store API has no slug field: take it from the permalink (some are numeric, e.g. /producto/38313/).
const slugOf = p => new URL(p.permalink).pathname.split('/').filter(Boolean).pop();
const pick = (test) => products.find(test);
const sampleProducts = [
  pick(p => /clic|click/i.test(p.name)),
  pick(p => p.categories?.some(c => c.slug === 'implementos-deportivos')),
  pick(p => p.type === 'variable'),
  pick(p => slugOf(p) === 'camisas-linea-premium'),
  pick(p => p.on_sale),
].filter(Boolean).filter((p, i, all) => all.indexOf(p) === i).map(p => [`producto-${slugOf(p)}`.slice(0, 60), new URL(p.permalink).pathname]);
const TEMPLATES = [
  ['categoria-implementos-deportivos', '/categoria/implementos-deportivos/'],
  ['categoria-camisas-individuales-pag-2', '/categoria/camisas-individuales/page/2/'],
  ['categoria-uniformes-de-voleibol', '/categoria/uniformes-de-voleibol/'],
  ...sampleProducts,
];

const jobs = [
  ...MAIN.map(t => [t, 'principales', t[0] === 'inicio' ? { chrome: true } : {}]),
  ...OTHER.map(t => [t, 'otras']),
  ...CHILDREN.map(t => [t, 'otras']),
  ...TEMPLATES.map(t => [t, 'plantillas']),
].filter(([t, group]) => !ONLY.length || ONLY.includes(t[0]) || ONLY.includes(group));

const browser = await chromium.launch({ channel: 'msedge' });
const reports = await pool(jobs, 2, ([target, group, extras]) => capture(browser, target, group, extras));
await browser.close();
await writeFile(join(REF, ONLY.length ? `reporte-${Date.now()}.json` : 'reporte.json'), JSON.stringify(reports, null, 1));
console.log(`listo en ${Math.round((Date.now() - started) / 1000)}s: ${reports.length} páginas, errores: ${reports.filter(r => r.desktopError || r.mobileError).length}`);
