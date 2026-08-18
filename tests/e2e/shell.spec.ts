import {expect,test} from '@playwright/test';

test('shows the shared platform and the themed equipment rooms',async({page},testInfo)=>{
  test.setTimeout(120_000);
  const compareVisuals=!process.env.CI;
  const worldTitles={vocabulary:'Die Wortlande',decimals:'Die Komma-Festung',fractions:'Die Bruchreiche'} as const;
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/Willkommen, Testheld/})).toBeVisible();
  if(compareVisuals)await expect(page).toHaveScreenshot('platform-home.png',{fullPage:true,animations:'disabled'});
  for(const id of ['vocabulary','decimals','fractions']){
    await page.goto(`/#/adventure/${id}/inventory`);
    await expect(page.getByRole('heading',{name:'Charakterraum & Truhe'})).toBeVisible();
    if(compareVisuals)await expect(page).toHaveScreenshot(`${id}-inventory.png`,{fullPage:true,animations:'disabled'});
    await page.goto(`/#/adventure/${id}/shop`);
    await expect(page.locator('.merchant-shop')).toBeVisible();
    if(compareVisuals)await expect(page).toHaveScreenshot(`${id}-shop.png`,{fullPage:true,animations:'disabled'});
    await page.goto(`/#/adventure/${id}/world`);
    if(testInfo.project.name==='mobile')await expect(page.locator('.campaign-map-goal')).toBeVisible();
    else await expect(page.getByRole('heading',{name:worldTitles[id as keyof typeof worldTitles]})).toBeVisible();
    await expect(page.getByRole('img',{name:/begehbare Karte mit zwei Missionswegen/})).toBeVisible();
    if(compareVisuals)await expect(page).toHaveScreenshot(`${id}-world.png`,{fullPage:true,animations:'disabled'});
  }
});

test('keeps the mobile shell fluid at supported phone widths',async({page},testInfo)=>{
  test.setTimeout(90_000);
  test.skip(testInfo.project.name!=='mobile');
  const compareVisuals=!process.env.CI;
  for(const viewport of [{width:320,height:568},{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('navigation',{name:'Hauptnavigation'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    if(compareVisuals)await expect(page).toHaveScreenshot(`mobile-home-${viewport.width}.png`,{fullPage:true,animations:'disabled'});
  }
});

test('keeps the world map immersive in portrait and landscape',async({page},testInfo)=>{
  test.setTimeout(90_000);
  test.skip(testInfo.project.name!=='mobile');
  const compareVisuals=!process.env.CI;
  const assertLayout=async()=>{
    await expect(page.locator('.world-camera')).toBeVisible();
    await expect.poll(()=>page.locator('.world-camera canvas').evaluate(element=>(element as HTMLElement).style.transform)).toContain('translate3d');
    await expect.poll(()=>page.evaluate(()=>document.querySelector('.world-camera canvas')!.getBoundingClientRect().height-document.querySelector('.world-camera')!.getBoundingClientRect().height)).toBeGreaterThanOrEqual(-1);
    await expect(page.locator('.world-active>.topbar')).toBeHidden();
    await expect(page.locator('.mobile-nav')).toHaveCount(0);
    await expect(page.locator('.campaign-map-goal')).not.toHaveAttribute('open','');
    const layout=await page.evaluate(()=>{
      const rect=(selector:string)=>{const value=document.querySelector(selector)!.getBoundingClientRect();return{x:value.x,y:value.y,width:value.width,height:value.height,right:value.right,bottom:value.bottom}};
      return{viewport:{width:innerWidth,height:innerHeight},scroll:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},camera:rect('.world-camera'),back:rect('.world-page>.back'),goal:rect('.campaign-map-goal'),joystick:rect('.touch-joystick'),action:rect('.world-action')};
    });
    expect(layout.scroll.width).toBeLessThanOrEqual(layout.viewport.width);
    expect(layout.scroll.height).toBeLessThanOrEqual(layout.viewport.height);
    expect(Math.abs(layout.camera.width-layout.viewport.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(layout.camera.height-layout.viewport.height)).toBeLessThanOrEqual(1);
    for(const item of [layout.back,layout.goal,layout.joystick,layout.action]){
      expect(item.x).toBeGreaterThanOrEqual(0);expect(item.y).toBeGreaterThanOrEqual(0);
      expect(item.right).toBeLessThanOrEqual(layout.viewport.width);expect(item.bottom).toBeLessThanOrEqual(layout.viewport.height);
    }
    return layout;
  };
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#/adventure/fractions/world');
  const portrait=await assertLayout();
  expect(portrait.joystick.width).toBeLessThanOrEqual(104);
  expect(portrait.action.width).toBeLessThanOrEqual(60);
  if(compareVisuals)await expect(page).toHaveScreenshot('world-immersive-portrait.png',{fullPage:true,animations:'disabled'});
  await page.locator('.campaign-map-goal summary').click();
  await expect(page.locator('.campaign-map-goal')).toHaveAttribute('open','');
  await expect(page.locator('.map-goal-body')).toBeVisible();
  await page.locator('.campaign-map-goal summary').click();
  await page.setViewportSize({width:430,height:932});
  const largePortrait=await assertLayout();
  expect(largePortrait.joystick.width).toBeLessThanOrEqual(104);
  await page.setViewportSize({width:844,height:390});
  const landscape=await assertLayout();
  expect(landscape.joystick.width).toBeLessThanOrEqual(92);
  expect(landscape.action.width).toBeLessThanOrEqual(56);
  if(compareVisuals)await expect(page).toHaveScreenshot('world-immersive-landscape.png',{fullPage:true,animations:'disabled'});
  await page.setViewportSize({width:667,height:375});
  const smallLandscape=await assertLayout();
  expect(smallLandscape.joystick.width).toBeLessThanOrEqual(92);
  expect(smallLandscape.action.width).toBeLessThanOrEqual(56);
});

test('shows each original companion inside the battle scene',async({page},testInfo)=>{
  test.setTimeout(90_000);
  const compareVisuals=!process.env.CI;
  for(const [id,name] of Object.entries({fractions:'Runa',decimals:'Kommi',vocabulary:'Lex'})){
    await page.goto(`/#/adventure/${id}/battle`);
    await expect(page.getByRole('region',{name:'Kampf-Intro'})).toBeVisible();
    await page.getByRole('button',{name:'Weiter'}).click();
    await expect(page.getByRole('img',{name:new RegExp(`${name}, ruhig`)})).toBeVisible();
    if(compareVisuals)await expect(page).toHaveScreenshot(`${id}-companion-intro.png`,{fullPage:true,animations:'disabled'});
    await page.getByRole('button',{name:'Kampf beginnen'}).click();
    await expect(page.locator('.companion-actor')).toBeVisible();
    if(compareVisuals)await expect(page).toHaveScreenshot(`${id}-battle.png`,{fullPage:true,animations:'disabled'});
    if(id==='fractions'){
      await page.getByRole('button',{name:/Funkenangriff/}).click();
      await expect(page.getByRole('button',{name:'Tipp vom Begleiter'})).toBeVisible();
      await page.getByRole('button',{name:'Tipp vom Begleiter'}).click();
      await expect(page.getByRole('img',{name:/Runa, gibt einen Tipp/})).toBeVisible();
      if(compareVisuals)await expect(page).toHaveScreenshot('fractions-question-with-hint.png',{fullPage:true,animations:'disabled'});
    }
  }
  if(testInfo.project.name==='mobile')expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
