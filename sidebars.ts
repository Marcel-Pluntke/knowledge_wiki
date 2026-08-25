import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    'documentation',
    'automation',
    'test-engineering',
    'chatgpt-github-pages-workflow',
    'lernhelden-architecture',
    {
      type: 'category',
      label: 'Low Voltage Standards',
      items: [
        'low-voltage-standards/iec-61439-niederspannungs-schaltgeraetekombinationen',
        'low-voltage-standards/iec-61439-kapitel-10-pruefungen-design-verification',
      ],
    },
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
