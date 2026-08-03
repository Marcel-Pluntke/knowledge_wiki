import {spawnSync} from 'node:child_process';

const npmCli=process.env.npm_execpath;
if(!npmCli)throw new Error('npm_execpath fehlt.');
const result=spawnSync(process.execPath,[npmCli,'run','build:game'],{stdio:'inherit',env:{...process.env,VITE_E2E_MODE:'true'}});
process.exit(result.status??1);
