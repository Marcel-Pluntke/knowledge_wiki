import {inflateSync} from 'node:zlib';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=new URL('../apps/lernhelden/public/assets/sprites/',import.meta.url);
const files=readdirSync(root).filter(file=>file.endsWith('.png')).sort();
if(files.length!==48)throw new Error(`Erwartet werden 48 isolierte Sprites, gefunden: ${files.length}`);
if(new Set(files).size!==files.length)throw new Error('Doppelte Sprite-Dateinamen gefunden.');
const companionFiles=['runa','kommi','lex'].flatMap(name=>['idle','hint','cheer','concerned'].map(pose=>`companion-${name}-${pose}.png`));
for(const file of companionFiles)if(!files.includes(file))throw new Error(`${file}: Begleiterpose fehlt`);

const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c};
for(const file of files){
  const png=readFileSync(new URL(file,root));
  if(png.toString('hex',0,8)!=='89504e470d0a1a0a')throw new Error(`${file}: keine gültige PNG-Datei`);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20),bitDepth=png[24],colorType=png[25];
  const companion=file.startsWith('companion-'),expectedSize=companion?128:224;
  if(width!==expectedSize||height!==expectedSize||bitDepth!==8||colorType!==6)throw new Error(`${file}: erwartet ${expectedSize}×${expectedSize} RGBA`);
  let offset=8;const data=[];
  while(offset<png.length){const length=png.readUInt32BE(offset),type=png.toString('ascii',offset+4,offset+8);if(type==='IDAT')data.push(png.subarray(offset+8,offset+8+length));offset+=length+12}
  const raw=inflateSync(Buffer.concat(data)),stride=width*4,decoded=Buffer.alloc(stride*height);let source=0;
  for(let y=0;y<height;y++){const filter=raw[source++];for(let x=0;x<stride;x++){const value=raw[source++],left=x>=4?decoded[y*stride+x-4]:0,up=y?decoded[(y-1)*stride+x]:0,upperLeft=y&&x>=4?decoded[(y-1)*stride+x-4]:0;decoded[y*stride+x]=(value+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):filter===4?paeth(left,up,upperLeft):NaN))&255}}
  const safeBorder=companion?4:12;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if((x<safeBorder||y<safeBorder||x>=width-safeBorder||y>=height-safeBorder)&&decoded[(y*width+x)*4+3]!==0)throw new Error(`${file}: Pixel berührt den sicheren transparenten Rand`);
}

const sourceFiles=['App.tsx','components/Sprite.tsx'].map(file=>join(fileURLToPath(new URL('../apps/lernhelden/src/',import.meta.url)),file));
for(const file of sourceFiles)if(readFileSync(file,'utf8').includes('sprite-atlas'))throw new Error(`${file}: verwendet noch das alte Atlas-System`);
console.log(`${files.length} isolierte Pixel-Sprites geprüft.`);
