import { test, expect, type Locator, type Page } from '@playwright/test';

// The mirror layout keeps our intro (LagartoIntro) and the section transition (RouteTransition).
// The redesign's ambient layer (scale glow, scratches, peeking lizard, pause control) is no longer
// mounted, so its tests left with it.

async function ready(page: Page, route = '/') {
  await page.addInitScript(() => sessionStorage.setItem('tony:intro:v2', 'seen'));
  await page.goto(route);
  // Hydrated: the transition has picked its artwork for this screen.
  await expect(page.locator('.route-transition')).toHaveAttribute('data-art', /^(full|mobile)$/);
}

// Header-agnostic helpers: the header logo, and a site-menu entry (header, phone menu panel or another nav).
const homeLogo = (page: Page) => page.getByRole('banner').locator('a[href="/"]:has(img), a[href="/"]:has(svg)').filter({ visible: true }).first();
async function menuEntry(page: Page, name: RegExp) {
  const link = page.getByRole('banner').or(page.getByRole('dialog')).or(page.getByRole('navigation')).getByRole('link', { name }).filter({ visible: true }).first();
  if (!(await link.isVisible())) await page.getByRole('banner').getByRole('button', { name: /^(abrir\s+(el\s+)?)?men[uú]/i }).first().click();
  return link;
}
/** Clicks the centre of a link with the raw mouse, so the click lands during the transition. */
async function clickCentre(page: Page, link: Locator) {
  await link.scrollIntoViewIfNeeded();
  const box = (await link.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
// A first visit to a section can make the dev server compile it.
const NAVIGATION = { timeout: 20_000 };

test('el logo abre la intro inmediatamente y vuelve a Inicio desde una página interna', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await ready(page, '/contacto');
  const logo = homeLogo(page);
  await logo.click();
  await expect(page.locator('.lagarto-intro[open]')).toBeVisible();
  await expect(page).toHaveURL(/\/$/, NAVIGATION);
  await expect(page.locator('.lagarto-intro .lagarto-head--reference')).toHaveCount(1);
  // The intro's mark is the only one on the page with the reference face.
  await expect(page.locator('.lagarto-head--reference')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.lagarto-intro')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await logo.click();
  await expect(page.locator('.lagarto-intro[open]')).toBeVisible();
  await page.getByRole('button', { name: 'Saltar intro', exact: true }).click();
});

test('al cambiar de apartado Tony se acerca, guiña y deja pasar sin bloquear clics', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const phases: string[] = [];
    (window as unknown as { __phases: string[] }).__phases = phases;
    new MutationObserver(records => records.forEach(record => phases.push((record.target as HTMLElement).dataset.phase!)))
      .observe(document, { subtree: true, attributes: true, attributeFilter: ['data-phase'] });
  });
  await ready(page, '/contacto');
  const overlay = page.locator('.route-transition');
  await expect(overlay).toHaveCSS('pointer-events', 'none');
  await expect(overlay).toHaveAttribute('aria-hidden', 'true');
  // Armed once the page settles: its layers wait invisible, ready for the first frame.
  await expect(overlay).toHaveClass(/is-armed/, { timeout: 5000 });
  const phases = () => page.evaluate(() => (window as unknown as { __phases: string[] }).__phases.join(' '));
  expect(await phases()).toBe('');
  await clickCentre(page, await menuEntry(page, /^Tony News/));
  await expect(overlay).toHaveAttribute('data-phase', 'cover');
  await expect(page.locator('html')).toHaveAttribute('data-route-cover', 'true');
  // Only transforms and opacity move, so the compositor keeps every frame while the page renders.
  const animated = await overlay.evaluate(element => [...new Set(element.getAnimations({ subtree: true }).flatMap(animation => (animation.effect as KeyframeEffect).getKeyframes().flatMap(frame => Object.keys(frame))))]);
  expect(animated.filter(property => !['offset', 'computedOffset', 'easing', 'composite'].includes(property)).sort()).toEqual(['opacity', 'transform']);
  await expect(page).toHaveURL(/\/tony-news$/, NAVIGATION);
  await expect.poll(phases, { timeout: 10000 }).toBe('cover wink reveal idle');
  await expect(page.locator('html')).not.toHaveAttribute('data-route-cover', /.*/);
  await clickCentre(page, await menuEntry(page, /^Promociones$/));
  await expect(page).toHaveURL(/\/promociones$/, NAVIGATION);
  await expect.poll(phases, { timeout: 10000 }).toBe('cover wink reveal idle cover wink reveal idle');
  await expect(page.locator('html')).not.toHaveAttribute('data-route-cover', /.*/);
  // The logo opens the intro instead of the section wink.
  await homeLogo(page).click();
  await expect(page.locator('.lagarto-intro[open]')).toBeVisible();
  expect(await phases()).toBe('cover wink reveal idle cover wink reveal idle');
});

test('el título del apartado que llega espera bajo las escamas y sube cuando se abren', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // From Tony News to Contacto: both exist in the mirror, and Contacto has an h1 (CONTACTO) like the official page.
  await ready(page, '/tony-news');
  // Observe at the moment the scales lift. Separate Playwright round trips can outlast the
  // short cover/wink and incorrectly inspect a heading that is already revealed.
  // Any entrance counts (a CSS animation or a script one, on the heading or on the block that carries it).
  await page.evaluate(() => {
    const reveals: { heading: string; progressed: number[] }[] = [];
    (window as unknown as { __reveals: typeof reveals }).__reveals = reveals;
    new MutationObserver(() => {
      if (document.documentElement.dataset.routeCover) return;
      const heading = document.querySelector('main h1'), main = heading?.closest('main');
      if (!heading || !main) return;
      const progressed = document.getAnimations().filter(animation => {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        return !!target && main.contains(target) && (target.contains(heading) || heading.contains(target));
      }).map(animation => Number(animation.currentTime ?? 0));
      reveals.push({ heading: heading.textContent!.trim(), progressed });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-route-cover'] });
  });
  await clickCentre(page, await menuEntry(page, /^Contacto$/));
  await expect(page).toHaveURL(/\/contacto$/, NAVIGATION);
  await expect(page.locator('.route-transition')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('html')).not.toHaveAttribute('data-route-cover', /.*/);
  const reveals = await page.evaluate(() => (window as unknown as { __reveals: { heading: string; progressed: number[] }[] }).__reveals);
  const arrival = reveals.find(reveal => /^cont[aá]ct/i.test(reveal.heading));
  // The section's heading was already in place when the scales opened...
  expect(arrival, JSON.stringify(reveals)).toBeTruthy();
  // ...and its entrance, when the page has one, had not played yet: it starts as they open instead of finishing out of sight.
  if (arrival!.progressed.length) expect(Math.max(...arrival!.progressed), JSON.stringify(reveals)).toBeLessThan(50);
});

test('movimiento reducido conserva texto y navegación sin intro', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Repetir entrada del lagarto', exact: true })).toBeHidden();
  await page.goto('/contacto');
  await homeLogo(page).click();
  await expect(page).toHaveURL(/\/$/, NAVIGATION);
  await expect(page.locator('.lagarto-intro')).toHaveCount(0);
  await expect(page.locator('.route-transition')).toHaveAttribute('data-phase', 'idle');
  // The home heading arrives already in place: no entrance, fully opaque, untransformed.
  const heading = page.locator('main h1').first();
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');
  await expect(heading).toHaveCSS('transform', 'none');
  expect(await heading.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});
