import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'documentation',
    'automation',
    'test-engineering',
    {
      type: 'category',
      label: 'Measurement Technology',
      items: [
        'measurement-technology',
        'measurement-technology/temperaturmessung-und-messgenauigkeit',
      ],
    },
    {
      type: 'category',
      label: 'WinCC OA',
      items: [
        'wincc-oa/wincc-oa-ctrl-links',
        'wincc-oa/wincc-oa-gedi-graphics-links',
      ],
    },
    'more-topics',
  ],
};

export default sidebars;
