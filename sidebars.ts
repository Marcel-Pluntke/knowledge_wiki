import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'documentation',
    'automation',
    'test-engineering',
    'measurement-technology',
    {
      type: 'category',
      label: 'WinCC OA',
      items: ['wincc-oa/wincc-oa-ctrl-links'],
    },
    'more-topics',
  ],
};

export default sidebars;
