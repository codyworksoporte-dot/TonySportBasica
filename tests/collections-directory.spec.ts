import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import collections from '../data/official-collections.json';

// The redesign's header search test left with that header; /colecciones and /cuenta stay as they were.
// The assistant's first-visit bubble is marked as seen so it never sits over what the test touches.
test.beforeEach(async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{try{localStorage.setItem('tony-assistant-hint-v1','1');}catch{/* Without storage the bubble is never scheduled. */}});
});
test('all imported albums are indexed and a gallery loads on demand',async({page})=>{
  expect(collections.products).toHaveLength(240);expect(collections.products.reduce((n,p)=>n+p.imageCount,0)).toBe(4326);
  const albumRequests:string[]=[];page.on('request',r=>{if(/colecciones\/\d+\.json/.test(r.url()))albumRequests.push(r.url());});
  await page.goto('/colecciones?categoria=uniformes-mundial-anime-2026');
  await expect(page.locator('.collection-grid>li')).toHaveCount(1);expect(albumRequests).toHaveLength(0);
  await page.getByRole('button',{name:'Ver UNIFORMES MUNDIAL ANIME 2026',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'UNIFORMES MUNDIAL ANIME 2026',exact:true});await expect(dialog.getByRole('combobox',{name:'Elegir imagen del álbum'})).toBeVisible();
  expect(albumRequests).toHaveLength(1);await expect(dialog.getByRole('combobox').locator('option')).toHaveCount(34);
  await dialog.getByRole('button',{name:'Imagen siguiente',exact:true}).click();await expect(dialog.getByRole('combobox')).toHaveValue('1');await expect(dialog.getByRole('link',{name:'Consultar por WhatsApp'})).toHaveAttribute('href',/imagen%202/);
  await dialog.getByRole('combobox').selectOption('33');await expect(dialog.getByRole('button',{name:'Imagen siguiente',exact:true})).toBeDisabled();
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(page.getByRole('button',{name:'Ver UNIFORMES MUNDIAL ANIME 2026',exact:true})).toBeFocused();
});
for(const width of [320,390,768,1440])test(`collections and account layout at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  for(const route of ['/colecciones','/cuenta']){
    await page.goto(route);await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]);
  }
  if(width===390){await page.goto('/colecciones?categoria=uniformes-mundial-anime-2026');await expect(page.getByLabel('Línea de producto')).toHaveValue('uniformes-mundial-anime-2026');await page.screenshot({path:'output/collections-mobile.png',fullPage:true,caret:'initial'});}
});
