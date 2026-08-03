import {expect,test} from '@playwright/test';

test('shows the shared platform and the themed equipment rooms',async({page})=>{
  const compareVisuals=!process.env.CI;
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
  }
});
