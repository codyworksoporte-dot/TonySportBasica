// Smoke test of the GitHub Pages export of the mirror, served by scripts/preview-pages.mjs on :4173.
// Usage: TONY_GITHUB_PAGES=true npm run build && node scripts/prepare-pages.mjs
//        node scripts/preview-pages.mjs   (in another terminal)   then   node scripts/smoke-pages.cjs
const { chromium } = require('@playwright/test');

// Same prefix rule as next.config.ts (TONY_PAGES_BASE, default '/TonySportBasica').
const raw = (process.env.TONY_PAGES_BASE || '').trim();
const prefix = raw ? (raw.replace(/^\/+|\/+$/g, '') ? `/${raw.replace(/^\/+|\/+$/g, '')}` : '') : '/TonySportBasica';
const origin = 'http://127.0.0.1:4173';
const base = `${origin}${prefix}`;
const ROUTES = ['/', '/crea-tu-pedido/', '/productos3/', '/categoria/implementos-deportivos/', '/producto/milan-premier-futsal-no4/', '/contacto/', '/carrito/', '/configurador/'];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const failures = [];
  const watch = page => {
    page.on('pageerror', error => failures.push(`JS en ${page.url()}: ${error.message}`));
    page.on('response', response => {
      if (response.url().startsWith(`${origin}/`) && response.status() >= 400) failures.push(`${response.status()}: ${response.url()}`);
    });
  };
  try {
    // 1. First desktop visit to the published home: the crocodile entrance recognises it (curtain + intro).
    const intro = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    const first = await intro.newPage();
    watch(first);
    await first.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    const skip = first.getByRole('button', { name: 'Saltar intro', exact: true });
    try { await skip.waitFor({ state: 'visible', timeout: 15000 }); await first.keyboard.press('Escape'); await skip.waitFor({ state: 'hidden', timeout: 5000 }); }
    catch { failures.push('La intro del lagarto no se reprodujo en la portada publicada'); }
    const home = await first.locator('header a[rel="home"]').first().getAttribute('href');
    if (home !== `${prefix}/`) failures.push(`El logo enlaza a ${home}, no a ${prefix}/`);
    await intro.close();

    // 2. Every key route answers with its page, assets included, and keeps its links under the prefix.
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => { try { sessionStorage.setItem('tony:intro:v2', 'seen'); sessionStorage.setItem('wb:whatsapp:cerrado', '1'); } catch {} });
    const page = await context.newPage();
    watch(page);
    // 'load', not 'networkidle': the footer player's media request can stay open (preview-pages has no ranges).
    for (const route of ROUTES) {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'load' });
      if (response?.status() !== 200 || !await page.locator('main#contenido').count() || !await page.locator('main h1').count()) failures.push(`Ruta ${route} no abrió correctamente`);
      const outside = await page.locator('a[href^="/"]').evaluateAll((links, p) => links.map(link => link.getAttribute('href')).filter(href => href && !href.startsWith(`${p}/`)), prefix);
      if (outside.length) failures.push(`Enlaces fuera del prefijo en ${route}: ${[...new Set(outside)].join(', ')}`);
    }

    // 3. Navigation as a visitor: menu, order link, footer category dropdown, product card and logo.
    const step = async (what, action, url) => {
      try { await action(); await page.waitForURL(url, { timeout: 20000 }); }
      catch (error) { failures.push(`${what}: ${String(error.message || error).split('\n')[0]}`); }
    };
    await page.goto(`${base}/`, { waitUntil: 'load' });
    await step('Menú › CREÁ TU PEDIDO', () => page.getByRole('banner').getByRole('link', { name: 'CREÁ TU PEDIDO', exact: true }).first().click(), `${base}/crea-tu-pedido/`);
    await step('CREÁ TU PEDIDO › configurador', () => page.getByRole('main').getByRole('link', { name: /mockup-prueba/ }).first().click(), /\/configurador\/?$/);
    await step('Menú › Productos', () => page.getByRole('banner').getByRole('link', { name: 'Productos', exact: true }).first().click(), `${base}/productos3/`);
    await step('Pie › Elige una categoría', () => page.locator('#wb-pie-categorias').selectOption('implementos-deportivos'), `${base}/categoria/implementos-deportivos/`);
    const selected = await page.locator('#wb-pie-categorias').inputValue().catch(() => '');
    if (selected !== 'implementos-deportivos') failures.push(`El selector del pie no marca la categoría actual (${selected || 'vacío'})`);
    await step('Categoría › producto', () => page.locator('main .wb-catalogo-grilla a[href*="/producto/"]').first().click(), /\/producto\/[^/]+\/$/);
    await step('Logo › portada', () => page.locator('header a[rel="home"]').first().click(), `${base}/`);
    await context.close();
  } finally {
    await browser.close();
  }
  if (failures.length) throw new Error([...new Set(failures)].join('\n'));
  console.log(`GitHub Pages (${base}/): intro y logo de la portada, ${ROUTES.length} rutas con sus recursos y la navegación por menú, pie y tarjetas responden.`);
})().catch(error => { console.error(error.message || error); process.exitCode = 1; });
