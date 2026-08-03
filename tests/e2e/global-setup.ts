import {preview} from 'vite';
import {resolve} from 'node:path';

export default async function startPreview() {
  const server=await preview({
    root:resolve('apps/lernhelden'),
    configFile:resolve('apps/lernhelden/vite.config.ts'),
    configLoader:'runner',
    preview:{host:'127.0.0.1',port:4187,strictPort:true},
  });
  return async()=>new Promise<void>((resolve,reject)=>server.httpServer.close(error=>error?reject(error):resolve()));
}
