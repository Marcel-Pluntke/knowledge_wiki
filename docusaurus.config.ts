import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Knowledge Wiki',
  tagline: 'Documentation, Automation, Test Engineering',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // GitHub Pages (Project Pages)
  url: 'https://Marcel-Pluntke.github.io',
  baseUrl: '/knowledge_wiki/',

  organizationName: 'Marcel-Pluntke',
  projectName: 'knowledge_wiki',
  
  // Optional, but recommended
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Marcel-Pluntke/knowledge_wiki/tree/main/docs/',
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/Marcel-Pluntke/knowledge_wiki/tree/main/blog/',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Knowledge Wiki',
      logo: {
        alt: 'Knowledge Wiki Logo',
        src: 'img/icon_green.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Topics',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Marcel-Pluntke/knowledge_wiki',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Topics',
          items: [
            {label: 'Overview', to: '/docs/intro'},
            {label: 'Documentation', to: '/docs/documentation'},
            {label: 'Automation', to: '/docs/automation'},
            {label: 'Test Engineering', to: '/docs/test-engineering'},
          ],
        },
        {
          title: 'Write',
          items: [
            {label: 'Blog', to: '/blog'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Repo', href: 'https://github.com/Marcel-Pluntke/knowledge_wiki'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Marcel Pluntke. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
