import {expect,test} from '@playwright/test';

test('shows the shared platform and the themed equipment rooms',async({page})=>{
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
    await expect(page.getByRole('heading',{name:worldTitles[id as keyof typeof worldTitles]})).toBeVisible();
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
