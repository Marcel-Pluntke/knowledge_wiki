import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import {getTopicSections} from './topicCatalog';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {type: 'doc', id: 'intro', label: 'Topics – Übersicht'},
    ...getTopicSections().map(section => {
      const items = section.articles.map(article => ({
        type: 'doc' as const, id: article.id, label: article.title,
      }));
      return items.length === 1
        ? items[0]
        : {type: 'category' as const, label: section.title, collapsed: false, items};
    }),
  ],
};

export default sidebars;
