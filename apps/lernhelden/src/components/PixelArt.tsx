import {useEffect, useRef} from 'react';
import type {ItemDefinition, MerchantDefinition} from '@lernhelden/engine';

const pixel = (context:CanvasRenderingContext2D,x:number,y:number,width:number,height:number,color:string) => {
  context.fillStyle=color;
  context.fillRect(Math.round(x),Math.round(y),Math.round(width),Math.round(height));
};

function drawItem(context:CanvasRenderingContext2D,item:ItemDefinition) {
  const {primary,secondary,highlight,style,variant}=item.visual;
  const dark='#29213b';
  context.clearRect(0,0,78,78);
  context.imageSmoothingEnabled=false;
  const slot=item.slot==='helmet'?'hut':item.slot;
  if(slot==='hut'){
    if(variant===1){pixel(context,11,48,56,10,primary);pixel(context,24,25,29,24,primary);pixel(context,37,11,12,16,primary);pixel(context,23,42,31,5,secondary)}
    else if(variant===2){pixel(context,13,45,52,12,secondary);pixel(context,18,24,10,24,primary);pixel(context,34,15,10,33,primary);pixel(context,50,24,10,24,primary);pixel(context,35,31,8,8,highlight)}
    else {pixel(context,10,47,58,11,primary);[18,31,44,57].forEach((x,index)=>pixel(context,x,20-(index%2)*7,8,29,primary));pixel(context,34,31,10,10,highlight)}
  }
  if(slot==='weapon'){
    pixel(context,37,24,7,48,style==='knightly'?'#d7dce2':'#8d5c37');
    if(variant===1){pixel(context,20,12,40,22,primary);pixel(context,28,4,24,13,secondary);pixel(context,34,8,12,5,highlight)}
    else if(variant===2){pixel(context,40,4,10,25,secondary);pixel(context,32,10,11,14,secondary);pixel(context,47,20,10,15,primary);pixel(context,42,5,5,9,highlight)}
    else {pixel(context,19,6,36,16,primary);pixel(context,12,13,34,12,secondary);pixel(context,48,3,14,14,highlight);pixel(context,26,10,10,5,'#fff0a6')}
  }
  if(slot==='cloak'||slot==='armor'){
    if(slot==='armor'){pixel(context,21,18,36,48,primary);pixel(context,13,23,12,34,primary);pixel(context,53,23,12,34,primary);pixel(context,27,10,24,12,secondary);pixel(context,29,29,20,8,dark);pixel(context,35,37,8,20,highlight)}
    else {pixel(context,18,16,42,48,primary);pixel(context,11,59,56,9,primary);pixel(context,27,9,24,9,secondary);if(variant===1)pixel(context,32,25,14,23,'#7f4d34');if(variant===2)[25,45,35].forEach((x,index)=>pixel(context,x,28+index*9,5,5,highlight));if(variant===3){pixel(context,29,27,18,18,dark);pixel(context,34,31,7,7,highlight)}}
  }
  if(slot==='shield'){
    pixel(context,18,18,42,39,primary);pixel(context,25,11,28,9,primary);pixel(context,26,54,26,12,primary);
    if(variant===1){pixel(context,36,22,6,32,secondary);pixel(context,25,34,28,6,secondary)}
    else if(variant===2){pixel(context,25,23,28,8,secondary);pixel(context,29,38,20,8,secondary);pixel(context,34,29,10,20,highlight)}
    else {pixel(context,27,26,8,8,highlight);pixel(context,44,26,8,8,highlight);pixel(context,35,42,10,10,highlight)}
  }
  if(slot==='boots'){
    pixel(context,13,41,21,24,primary);pixel(context,44,41,21,24,primary);pixel(context,8,62,30,8,primary);pixel(context,40,62,30,8,primary);
    if(variant===1){pixel(context,12,55,22,6,highlight);pixel(context,44,55,22,6,highlight)}
    else if(variant===2)[17,25,48,56].forEach((x,index)=>pixel(context,x,47+(index%2)*8,5,5,secondary));
    else {pixel(context,14,31,18,12,secondary);pixel(context,46,31,18,12,secondary);pixel(context,18,25,10,10,highlight);pixel(context,50,25,10,10,highlight)}
  }
  if(slot==='amulet'){
    pixel(context,36,8,6,32,secondary);pixel(context,20,36,38,29,primary);
    if(variant===1){pixel(context,30,30,18,15,highlight);pixel(context,24,37,12,12,highlight);pixel(context,43,37,12,12,highlight)}
    else if(variant===2){pixel(context,30,42,18,18,secondary);pixel(context,35,37,8,28,highlight);pixel(context,25,47,28,8,highlight)}
    else {pixel(context,33,39,12,22,highlight);pixel(context,25,46,28,8,highlight);pixel(context,29,42,20,16,highlight)}
  }
  if(style==='scholarly'){pixel(context,5,8,5,5,highlight);pixel(context,67,14,4,4,secondary)}
  if(style==='knightly'){pixel(context,5,63,12,4,secondary);pixel(context,9,59,4,12,secondary)}
  if(style==='arcane'){pixel(context,66,8,5,13,highlight);pixel(context,62,12,13,5,highlight)}
}

export function ItemSprite({item,size=70,className=''}:{item:ItemDefinition;size?:number;className?:string}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const context=ref.current?.getContext('2d');if(context)drawItem(context,item)},[item]);
  return <canvas ref={ref} width={78} height={78} className={`pixel-item ${className}`} style={{width:size,height:size}} role="img" aria-label={item.name}/>;
}

function drawMerchant(context:CanvasRenderingContext2D,merchant:MerchantDefinition) {
  const {skin,outfit,accent}=merchant.colors;
  context.clearRect(0,0,210,210);context.imageSmoothingEnabled=false;
  const wall=merchant.backdrop==='forge'?['#3f4752','#303640']:merchant.backdrop==='library'?['#704527','#4f301f']:['#814d33','#6e3f2d'];
  for(let x=0;x<210;x+=18)for(let y=0;y<210;y+=18)pixel(context,x,y,16,16,(x+y)%36?wall[0]:wall[1]);
  if(merchant.backdrop==='forge'){pixel(context,16,126,50,38,'#171b21');pixel(context,22,132,38,25,'#df633d');pixel(context,28,138,26,13,'#ffd261')}
  if(merchant.backdrop==='library'){for(let y=24;y<145;y+=38){pixel(context,10,y,62,7,'#392216');for(let x=14;x<67;x+=10)pixel(context,x,y-22,7,22,(x+y)%20?'#49699a':'#9b554a')}}
  pixel(context,12,158,186,45,'#66351f');pixel(context,20,166,170,7,accent);
  if(merchant.portrait==='goblin'){
    pixel(context,95,40,28,22,skin);pixel(context,78,61,64,63,skin);pixel(context,60,70,25,19,skin);pixel(context,135,70,25,19,skin);
  }else{
    pixel(context,88,40,44,25,'#5a3c2d');pixel(context,79,59,62,67,skin);pixel(context,66,71,18,15,skin);pixel(context,137,71,18,15,skin);
  }
  pixel(context,87,82,11,8,'#29213d');pixel(context,123,82,11,8,'#29213d');pixel(context,99,104,22,6,'#3c2330');
  pixel(context,88,115,45,18,'#ecb56f');pixel(context,78,132,65,28,outfit);
  if(merchant.portrait==='armorer'){pixel(context,79,53,63,17,'#9aa7b5');pixel(context,90,43,41,16,'#c5d0da');pixel(context,101,38,19,8,accent);pixel(context,147,116,29,37,'#aab4bf');pixel(context,153,110,17,10,accent)}
  if(merchant.portrait==='scholar'){pixel(context,83,40,54,12,outfit);pixel(context,94,25,32,18,outfit);pixel(context,101,20,18,8,accent);pixel(context,22,119,35,37,'#755135');pixel(context,27,124,25,5,accent);pixel(context,32,132,16,18,'#f1e2b2')}
  if(merchant.portrait==='goblin'){pixel(context,24,126,38,27,'#e3a645');pixel(context,30,116,26,12,accent);pixel(context,146,123,35,31,'#b67540');pixel(context,153,111,20,13,accent);pixel(context,95,25,28,15,outfit);pixel(context,86,34,46,12,outfit);pixel(context,101,21,10,7,accent)}
}

export function MerchantPortrait({merchant}:{merchant:MerchantDefinition}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const context=ref.current?.getContext('2d');if(context)drawMerchant(context,merchant)},[merchant]);
  return <canvas ref={ref} width={210} height={210} className="merchant-canvas" role="img" aria-label={`${merchant.name} hinter dem Verkaufstresen`}/>;
}
