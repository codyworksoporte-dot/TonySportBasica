import {test, expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {expectNoOverflow, mockPedidoApi} from './pedido/helpers';

// Acceptance tests for the mirror of tonysportselsalvador.com (docs/WEB-BASICA.md).
//
// Each title comes from referencia-oficial/<group>/<slug>/outline-desktop.json: the first visible h1 of the
// content, else its first h2. Pages that show no title on the official site (visible: false) only carry it
// in <title>, so only the document title is checked there. Texts match without case (the official CSS
// uppercases them) but with accents.
//
// HOW TO ACTIVATE: tests whose page (or header, footer, bubble) is not built yet are marked test.fixme.
// When a builder delivers one, set `ready: true` on its PAGES entry or on CHROME_READY.
// To see everything that is still missing, run them all at once: ESPEJO_TODAS=1 npx playwright test tests/espejo.spec.ts

type MirrorPage = {path: string; title: string; visible: boolean; ready: boolean};

const PAGES: MirrorPage[] = [
  // The 13 entries of the official menu.
  {path: '/', title: 'BIENVENIDO A TONY SPORTSWEAR EL SALVADOR', visible: true, ready: true},
  {path: '/crea-tu-pedido', title: 'CREÁ TU PEDIDO', visible: true, ready: true}, // inside «¡CREÁ TU PEDIDO A TU MANERA!»
  {path: '/app-tony', title: 'DESCARGA NUESTRA APP Y GANA PREMIOS CON TONY', visible: true, ready: true},
  {path: '/tienda-en-linea', title: 'TIENDA EN LINEA', visible: false, ready: true},
  // Official path of the menu's «Productos». /producto is a placeholder a builder may turn into it: update `path` then.
  {path: '/productos3', title: 'CONFECCIÓN DE UNIFORMES DE FUTBOL', visible: true, ready: true},
  {path: '/promociones', title: 'Promociones', visible: false, ready: true},
  {path: '/patrocinadores', title: 'TONY SPORTSWEAR NOS COMPLACE SER OFICIALMENTE PATROCINADORES DE CUATRO EQUIPOS DE LA PRIMERA DIVISIÓN DE EL SALVADOR', visible: true, ready: true},
  {path: '/nuestras-tiendas', title: 'NUESTRAS TIENDAS', visible: true, ready: true},
  {path: '/nuestra-calidad', title: 'LÍNEAS DE TELA', visible: true, ready: true},
  {path: '/servicio-a-domicilio', title: 'SERVICIO A DOMICILIO', visible: true, ready: true},
  {path: '/contacto', title: 'CONTACTO', visible: true, ready: true},
  {path: '/tony-news', title: 'Tony News', visible: false, ready: true},
  {path: '/categoria/rse-tony', title: 'RSE-TONY', visible: false, ready: true},
  // Other official pages (/carrito is the protected cart). The official implementos-deportivos, galeria, mi-cuenta
  // and eventos answer with an Apache «Index of» listing: the mirror shows their WordPress page instead.
  {path: '/subliminado', title: 'CONFECCIÓN UNIFORMES DE FUTBOL', visible: true, ready: true},
  {path: '/replica', title: 'REPLICAS', visible: true, ready: true},
  {path: '/tipo-de-sublimando', title: 'TIPOS DE PERSONALIZADO CAMISAS', visible: true, ready: true},
  {path: '/quienes-somos', title: 'QUIÉNES SOMOS', visible: true, ready: true},
  {path: '/proyectos', title: 'PROYECTOS', visible: true, ready: true},
  {path: '/como-comprar', title: 'CÓMO COMPRAR', visible: true, ready: true},
  {path: '/politica-de-privacidad', title: 'POLÍTICA DE PRIVACIDAD', visible: true, ready: true},
  {path: '/productos', title: 'Productos', visible: false, ready: true},
  {path: '/productos/confeccion-de-uniformes-personalizados', title: 'CAMISA + CALZONETA + NÚMERO + MEDIAS', visible: true, ready: true},
  {path: '/uniformes-bkb', title: 'UNIFORME BKB FULL SUBLIMADO', visible: true, ready: true},
  {path: '/copa-tony-sportswear', title: 'EQUIPOS PARTICIPANTES', visible: true, ready: true},
  {path: '/blog', title: 'Blog', visible: false, ready: true},
  {path: '/catalogo', title: 'CATÁLOGO', visible: true, ready: true},
  {path: '/paquetes', title: 'PAQUETES', visible: true, ready: true},
  {path: '/testimoniales-productos', title: 'Testimoniales (productos)', visible: false, ready: true},
  {path: '/premios-app', title: 'Premios App', visible: false, ready: true},
  {path: '/app-tony/descarga-nuestra-app', title: 'DESCARGA NUESTRA APP', visible: false, ready: true},
  {path: '/tienda-en-linea/street-wear', title: 'Street Wear', visible: false, ready: true},
  {path: '/tienda-en-linea/camisas-venta-individual', title: 'Camisas venta individual', visible: false, ready: true},
  {path: '/implementos-deportivos', title: 'Implementos Deportivos', visible: false, ready: true},
  {path: '/galeria', title: 'GALERÍA', visible: true, ready: true},
  {path: '/mi-cuenta', title: 'Mi cuenta', visible: false, ready: true},
  {path: '/eventos', title: 'EVENTOS', visible: true, ready: true},
  // Templates: WooCommerce categories and products (dynamic routes with generateStaticParams).
  {path: '/categoria/implementos-deportivos', title: 'Implementos Deportivos', visible: false, ready: true},
  {path: '/categoria/camisas-individuales/page/2', title: 'Camisas individuales', visible: false, ready: true},
  {path: '/categoria/uniformes-de-voleibol', title: 'Uniformes de Voleibol', visible: false, ready: true},
  // Empty official category the menu links (the Store API hides it): the empty archive, never a 404.
  {path: '/categoria/camisa-full-sublimada', title: 'Camisas Full Sublimadas', visible: false, ready: true},
  {path: '/producto/38313', title: 'CLIC AQUI PARA VER CATALOGO DE REPLICAS 001', visible: true, ready: true},
  {path: '/producto/milan-premier-futsal-no4', title: 'MILAN PREMIER FUTSAL Nº4', visible: true, ready: true},
  {path: '/producto/camisas-linea-premium', title: 'CAMISAS LINEA PREMIUM', visible: true, ready: true},
  {path: '/producto/click-aca-para-ver-el-album-013-de-uniformes-camiseta-full-sublimado-y-full-sublimado-calzoneta', title: 'CLICK ACA PARA VER EL ALBÙM 011 DE UNIFORMES CAMISETA FULL SUBLIMADO Y FULL SUBLIMADO CALZONETA', visible: true, ready: true},
];

// Shared chrome of the mirror (components/espejo: Cabecera, Pie, WhatsAppFlotante), built apart from the pages.
const CHROME_READY = {header: true, footer: true, whatsapp: true};

// Official menu (outline-desktop.json → header.menus): exact DOM text and the mirror path it opens.
const MENU: [string, RegExp][] = [
  ['Inicio', /^\/$/],
  ['CREÁ TU PEDIDO', /^\/crea-tu-pedido\/?$/],
  ['App Tony', /^\/app-tony\/?$/],
  ['Tienda en Línea', /^\/tienda-en-linea\/?$/],
  ['Productos', /^\/(productos3|producto)\/?$/],
  ['Promociones', /^\/promociones\/?$/],
  ['Patrocinio', /^\/patrocinadores\/?$/],
  ['Nuestras tiendas', /^\/nuestras-tiendas\/?$/],
  ['Nuestra Calidad', /^\/nuestra-calidad\/?$/],
  ['Servicio a domicilio', /^\/servicio-a-domicilio\/?$/],
  ['Contacto', /^\/contacto\/?$/],
  ['Tony News', /^\/tony-news\/?$/],
  ['RSE-TONY', /^\/categoria\/rse-tony\/?$/],
];
const FOOTER_COLUMNS = ['¿REQUIERES MÁS INFORMACIÓN?', 'EXPLORA NUESTRAS CATEGORÍAS', 'SOBRE NOSOTROS'];

// Routes the order flow and the account use: they stay exactly as they were.
const KEPT = ['/configurador', '/configurador/archivo', '/carrito', '/cuenta', '/recientes', '/colecciones', '/privacidad', '/terminos', '/cookies', '/producto'];
// Redesign-only pages that are not on the official site.
const REMOVED = ['/resenas', '/nosotros', '/patrocinio', '/calidad', '/consulta', '/entregas', '/implementos', '/lineas', '/tiendas', '/actualidad', '/comunidad', '/ayuda'];

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Case-insensitive, whitespace-tolerant match of an official text. */
const loose = (text: string, whole = false) => {
  const body = escapeRegExp(text).replace(/\s+/g, '\\s+');
  return new RegExp(whole ? `^${body}$` : body, 'i');
};
const pageReady = (path: string) => PAGES.find(entry => entry.path === path)?.ready ?? false;
const RUN_ALL = process.env.ESPEJO_TODAS === '1';
function pendingUnless(ready: boolean, what: string) {
  test.fixme(!ready && !RUN_ALL, `Pendiente en el espejo: ${what}. Actívala con ready: true en tests/espejo.spec.ts.`);
}
/** A visible menu link: in the header, or in the menu panel a phone opens from it. */
const menuLink = (page: Page, name: string) => page.getByRole('banner').or(page.getByRole('dialog')).or(page.getByRole('navigation'))
  .getByRole('link', {name, exact: true}).filter({visible: true}).first();
/** Visible WhatsApp links that float over the page (inside a position: fixed box). */
const floatingWhatsApp = (page: Page) => page.locator('a[href*="wa.me/50370155571"]').evaluateAll(links => links
  .filter(link => { const box = link.getBoundingClientRect(); return box.width > 0 && box.height > 0 && getComputedStyle(link).visibility !== 'hidden'; })
  .filter(link => { for (let node: Element | null = link; node; node = node.parentElement) if (getComputedStyle(node).position === 'fixed') return true; return false; })
  .map(link => link.getAttribute('href') || ''));

test.use({viewport: {width: 1440, height: 900}, reducedMotion: 'reduce'});
test.beforeEach(async ({page}) => {
  // The assistant's first-visit bubble never covers what a test looks at.
  await page.addInitScript(() => { try { localStorage.setItem('tony-assistant-hint-v1', '1'); } catch { /* Without storage it is never scheduled. */ } });
});

test.describe('páginas espejo', () => {
  for (const {path, title, visible, ready} of PAGES) {
    test(`${path} responde y muestra «${title}»`, async ({page}) => {
      pendingUnless(ready, path);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
      if (visible) await expect(main.getByText(loose(title)).first()).toBeVisible();
      else await expect(page).toHaveTitle(loose(title));
      await expectNoOverflow(page, 1440);
      await page.setViewportSize({width: 390, height: 844});
      await expect(main).toBeVisible();
      await expectNoOverflow(page, 390);
    });
  }
});

test.describe('cabecera, pie y burbuja', () => {
  test('la cabecera tiene las 13 entradas del menú oficial, en su orden', async ({page}) => {
    pendingUnless(CHROME_READY.header, 'cabecera');
    await page.goto('/');
    const banner = page.getByRole('banner');
    const links = MENU.map(([name]) => banner.getByRole('link', {name, exact: true}).filter({visible: true}).first());
    for (const [index, [name, href]] of MENU.entries()) {
      await expect(links[index], name).toBeVisible();
      await expect(links[index], name).toHaveAttribute('href', href);
    }
    // Reading order of the official menu: left to right, wrapping to a new row.
    const boxes = await Promise.all(links.map(link => link.boundingBox()));
    for (let index = 1; index < boxes.length; index++) {
      const before = boxes[index - 1]!, after = boxes[index]!;
      expect(after.y > before.y + 8 || (Math.abs(after.y - before.y) <= 8 && after.x > before.x), `${MENU[index - 1][0]} → ${MENU[index][0]}`).toBe(true);
    }
  });

  test.describe('en el celular', () => {
    test.use({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
    test('el botón de menú abre las 13 entradas oficiales', async ({page}) => {
      pendingUnless(CHROME_READY.header, 'cabecera');
      await page.goto('/');
      const toggle = page.getByRole('banner').getByRole('button', {name: /^(abrir\s+(el\s+)?)?men[uú]/i}).first();
      await expect(toggle).toBeVisible();
      await expect(menuLink(page, 'RSE-TONY')).toBeHidden();
      await toggle.tap();
      for (const [name] of MENU) await expect(menuLink(page, name), name).toBeVisible();
    });
  });

  test('el pie tiene sus 3 columnas: lado a lado en computadora y apiladas en el celular', async ({page}) => {
    pendingUnless(CHROME_READY.footer, 'pie');
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    const headings = FOOTER_COLUMNS.map(title => footer.getByRole('heading', {name: loose(title, true)}).first());
    for (const [index, heading] of headings.entries()) await expect(heading, FOOTER_COLUMNS[index]).toBeVisible();
    const row = await Promise.all(headings.map(heading => heading.boundingBox()));
    expect(row[0]!.x).toBeLessThan(row[1]!.x);
    expect(row[1]!.x).toBeLessThan(row[2]!.x);
    expect(Math.abs(row[0]!.y - row[2]!.y)).toBeLessThan(24);
    await page.setViewportSize({width: 390, height: 844});
    const stack = await Promise.all(headings.map(heading => heading.boundingBox()));
    expect(stack[0]!.y).toBeLessThan(stack[1]!.y);
    expect(stack[1]!.y).toBeLessThan(stack[2]!.y);
  });

  test('el selector de categorías del pie marca la categoría actual y muestra su flecha', async ({page}) => {
    pendingUnless(CHROME_READY.footer, 'pie');
    const select = page.locator('#wb-pie-categorias');
    await page.goto('/categoria/implementos-deportivos');
    await expect(select).toHaveValue('implementos-deportivos');
    expect(await select.evaluate(element => getComputedStyle(element).backgroundImage)).toContain('svg');
    // On a product page, its first category (as the official widget does).
    await page.goto('/producto/camisas-polos-lisas');
    await expect(select).toHaveValue('camisas-empresariales');
    await page.goto('/contacto');
    await expect(select).toHaveValue('');
  });

  for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}]) {
    test(`la burbuja de WhatsApp enlaza a wa.me/50370155571 (${viewport.width}px)`, async ({page}) => {
      pendingUnless(CHROME_READY.whatsapp, 'burbuja de WhatsApp');
      await page.setViewportSize(viewport);
      await page.goto('/');
      if (!(await floatingWhatsApp(page)).length) {
        // Like the official widget, the bubble may first open a small panel that holds the chat link.
        const bubble = page.getByRole('button', {name: /whatsapp/i}).filter({visible: true}).first();
        await expect(bubble, 'burbuja de WhatsApp').toBeVisible();
        await bubble.click();
        await expect.poll(() => floatingWhatsApp(page)).not.toEqual([]);
      }
      for (const href of await floatingWhatsApp(page)) expect(href).toMatch(/^https:\/\/wa\.me\/50370155571(?:[/?]|$)/);
    });
  }
});

test.describe('lo que se conserva', () => {
  test('/configurador sigue cargando la asesora', async ({page}) => {
    test.setTimeout(90_000);
    await mockPedidoApi(page);
    await page.addInitScript(() => { try { localStorage.setItem('tony:pedido:quality:v1', 'high'); } catch { /* Capable devices pick the advisor anyway. */ } });
    const response = await page.goto('/configurador');
    expect(response?.status()).toBe(200);
    const advisor = page.getByRole('region', {name: 'Tu asesora Tony'});
    await expect(advisor).toBeVisible();
    await expect(advisor.locator('.advisor-stage')).toHaveAttribute('data-state', 'ready', {timeout: 30_000});
    await expect(page.getByRole('img', {name: /Asesora Tony en tres dimensiones/})).toBeVisible();
  });

  test('las rutas del pedido, la cuenta y el carrito siguen respondiendo', async ({page}) => {
    test.setTimeout(180_000);
    for (const path of KEPT) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole('main'), path).toBeVisible();
    }
  });

  test('las páginas exclusivas del rediseño ya no existen', async ({page}) => {
    test.setTimeout(120_000);
    for (const path of [...REMOVED, '/esta-pagina-no-existe']) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
    }
    // The official 404: the theme's closable warning, inside the mirror's header and footer.
    await expect(page.getByRole('main').getByText('¡La página a la que intentas acceder no existe!', {exact: true})).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});

test.describe('accesibilidad (axe: wcag2a, wcag2aa, wcag21aa)', () => {
  for (const [label, path] of [['portada', '/'], ['página interior', '/contacto'], ['categoría', '/categoria/uniformes-de-voleibol'], ['producto', '/producto/milan-premier-futsal-no4']] as const) {
    test(`${label} (${path}) sin violaciones serias`, async ({page}) => {
      pendingUnless(pageReady(path) && CHROME_READY.header && CHROME_READY.footer, `${path} con cabecera y pie`);
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.evaluate(async () => { await document.fonts.ready; });
      const {violations} = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const serious = violations.filter(violation => violation.impact === 'serious' || violation.impact === 'critical');
      expect(serious.map(violation => ({id: violation.id, impact: violation.impact, nodes: violation.nodes.map(node => node.target)}))).toEqual([]);
    });
  }
});
