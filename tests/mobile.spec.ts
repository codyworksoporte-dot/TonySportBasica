import {expect, test, type Page} from '@playwright/test';
import {completePedido, layer} from './pedido/pricing.fixtures';
import {seedPedido, openSeededEditor, expectNoOverflow} from './pedido/helpers';

// The header's cart link announces the saved designs ("Carrito: 1 diseño"), whatever the header markup.
const headerCart=(page:Page)=>page.getByRole('banner').getByRole('link',{name:/^Carrito\b/}).first();

test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
test('mobile editor keeps the chosen piece and its controls together', async ({page}) => {
  const order=completePedido();
  order.design.front='/assets/pedido/catalog/tony-010-front.webp';
  order.design.back='/assets/pedido/catalog/tony-010-back.webp';
  order.design.layers=[layer('Escudo','Escudo')];
  await seedPedido(page,order);
  await page.addInitScript(()=>localStorage.setItem('tony:pedido:quality:v1','low'));
  await openSeededEditor(page);
  await page.locator('.pedido-design-layer').click();
  await page.getByRole('button',{name:'Más grande',exact:true}).click();
  await page.screenshot({path:`output/mobile-editor-${process.env.TONY_MOBILE_BASELINE?'before':'after'}.png`});
  const scene=await page.locator('.pedido-design-stage').boundingBox();
  const controls=await page.locator('.pedido-size-row').boundingBox();
  console.log('preview and controls',scene,controls);
  await expectNoOverflow(page,390);
  if(!process.env.TONY_MOBILE_BASELINE){
    // Nothing pinned at the top covers the preview (the redesign's sticky header was 60 px; the mirror's scrolls away).
    const pinnedTop=await page.getByRole('banner').evaluate(el=>['fixed','sticky'].includes(getComputedStyle(el).position)?el.getBoundingClientRect().bottom:0);
    expect(scene!.y).toBeGreaterThanOrEqual(pinnedTop);
    expect(scene!.y+scene!.height).toBeLessThan(controls!.y);
    expect(controls!.y+controls!.height).toBeLessThan(844);
    await expect(page.getByRole('region',{name:'Tu asesora Tony'})).toHaveCount(0);
  }
});

test('a mobile save confirms persistence, deduplicates repeated saves and opens the saved design', async ({page}) => {
  await seedPedido(page,completePedido());
  await page.goto('/configurador?borrador=actual');
  await expect(page.getByText('Recuperamos tu diseño. Revisa los pasos para continuar.')).toBeVisible();
  await page.getByRole('button',{name:/CREAR MI PEDIDO/}).click();
  const save=page.locator('.pedido-step-footer .pedido-mobile-save');
  await save.tap();
  const notice=page.locator('.cart-feedback');
  await expect(notice).toContainText('Guardado en tu carrito');
  await expect(save).toContainText('Guardado');
  await expect(headerCart(page)).toHaveAccessibleName(/^Carrito\W+1 diseño$/);
  const box=await notice.boundingBox(); expect(box!.y).toBeGreaterThanOrEqual(64); expect(box!.y+box!.height).toBeLessThan(844);
  await page.screenshot({path:'output/mobile-cart-confirmation.png'});
  await save.tap(); await save.tap();
  await expect(notice).toHaveCount(1);
  await notice.getByRole('link',{name:/Ir al carrito/}).tap();
  await expect(page.locator('.pedido-saved-card')).toHaveCount(1);
  await page.reload(); await expect(page.locator('.pedido-saved-card')).toHaveCount(1);
  await expect(page.locator('.cart-feedback')).toHaveCount(0);
});

test('storage failure shows an error and never a false cart success', async ({page}) => {
  await seedPedido(page,completePedido());
  await page.goto('/configurador?borrador=actual');
  await expect(page.getByText('Recuperamos tu diseño. Revisa los pasos para continuar.')).toBeVisible();
  await page.getByRole('button',{name:/CREAR MI PEDIDO/}).click();
  await page.evaluate(()=>{const original=IDBObjectStore.prototype.put; IDBObjectStore.prototype.put=function(...args: Parameters<IDBObjectStore['put']>){if(this.name==='cart')throw new DOMException('Espacio de prueba agotado','QuotaExceededError');return original.apply(this,args);};});
  await page.locator('.pedido-mobile-save').tap();
  await expect(page.locator('.cart-feedback')).toContainText('No se pudo guardar');
  await expect(page.locator('.cart-feedback a')).toHaveCount(0);
  await expect(page.locator('.pedido-mobile-save')).toContainText('Reintentar');
  await expect(headerCart(page)).toHaveAccessibleName(/^Carrito\W+0 diseños$/);
});

// The redesign's phone menu/search test left with that header; the mobile transition lives in mobile-transition.spec.ts.
test('dragging on touch commits once and undoes as one action', async ({page,context}) => {
  const order=completePedido(); order.design.layers=[layer('Escudo','Escudo')];
  await seedPedido(page,order); await openSeededEditor(page);
  // Centred, so the touch never lands on the sticky step bar whatever the header height above.
  const piece=page.locator('.pedido-design-layer'); await piece.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
  const rect=await piece.boundingBox();
  const session=await context.newCDPSession(page);
  const x=rect!.x+rect!.width/2, y=rect!.y+rect!.height/2;
  const before=await piece.getAttribute('style');
  const version=await page.locator('.pedido-editor').getAttribute('data-history');
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=20;i++)await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*1.5,y:y+i}]});
  await expect(page.locator('.pedido-editor')).toHaveAttribute('data-history',version!);
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(piece).not.toHaveAttribute('style',before!);
  await expect(page.locator('.pedido-editor')).toHaveAttribute('data-history',String(Number(version)+1));
  await page.getByRole('button',{name:/Deshacer/}).click();
  await expect(piece).toHaveAttribute('style',before!);
  await session.detach();
});

for(const width of [320,768])test(`editor tools and framing stay usable at ${width}px`, async ({page})=>{
  await page.setViewportSize({width,height:800});
  const order=completePedido(); order.design.layers=[layer('Escudo','Escudo')];
  await seedPedido(page,order); await openSeededEditor(page);
  await page.locator('.pedido-design-layer').click();
  await page.getByRole('button',{name:'Más pequeño'}).click();
  await page.getByRole('button',{name:'Imagen',exact:true}).click();
  await page.getByRole('button',{name:/Encuadrar/}).click();
  await expect(page.getByRole('slider',{name:'Zoom',exact:true})).toBeVisible();
  await page.getByRole('slider',{name:'Zoom',exact:true}).fill('1.3');
  await page.getByRole('button',{name:'Aplicar encuadre'}).click();
  await expect(page.getByText('✓ Encuadre aplicado.')).toBeVisible();
  await expectNoOverflow(page,width);
  await page.screenshot({path:`output/mobile-editor-${width}.png`});
});

test('reduced motion preserves the cart confirmation without animation',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await seedPedido(page,completePedido()); await page.goto('/configurador?borrador=actual');
  await expect(page.getByText('Recuperamos tu diseño. Revisa los pasos para continuar.')).toBeVisible();
  await page.getByRole('button',{name:/CREAR MI PEDIDO/}).click();
  await page.locator('.pedido-mobile-save').tap();
  await expect(page.locator('.cart-feedback')).toContainText('Guardado en tu carrito');
  expect(await page.locator('.cart-feedback').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});
