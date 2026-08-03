import type {SpriteRef} from '@lernhelden/engine';
import type {CSSProperties} from 'react';

export const spriteUrl = (sprite: SpriteRef) => `${import.meta.env.BASE_URL}${sprite.src}`;

export function Sprite({sprite, size=48, className=''}:{sprite:SpriteRef;size?:number;className?:string}) {
  const style: CSSProperties = {
    width:size,
    height:size,
    backgroundImage:`url(${spriteUrl(sprite)})`,
    backgroundSize:'contain',
    backgroundPosition:'center',
  };
  return <span className={`sprite ${className}`} style={style} role="img" aria-label={sprite.label}/>;
}

const ref = (id:string,label:string,asset=id):SpriteRef => ({id,src:`assets/sprites/${asset}.png`,label});

export const avatarSprite = (index:number) => ref(`avatar-${index+1}`,`Held ${index+1}`);
export const uiSprites = {
  heart:ref('heart','Leben'),
  gold:ref('gold','Gold'),
  silver:ref('silver','Silber'),
  ruby:ref('ruby','Rubin','ruby-crystal'),
  chest:ref('chest','Truhe'),
  map:ref('map','Weltkarte'),
  shop:ref('shop','Shop'),
  achievement:ref('achievement','Erfolg'),
};
