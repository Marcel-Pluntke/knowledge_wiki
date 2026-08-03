import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
  testDir:'./tests/e2e',
  snapshotPathTemplate:'{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  timeout:20_000,
  globalSetup:'./tests/e2e/global-setup.ts',
  use:{baseURL:'http://127.0.0.1:4187/knowledge_wiki/games/lernhelden/'},
  expect:{toHaveScreenshot:{maxDiffPixelRatio:.08,threshold:.35}},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],browserName:'chromium'}}],
});
