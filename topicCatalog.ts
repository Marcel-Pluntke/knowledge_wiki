import {readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';

export type TopicArticle = {id: string; title: string};
export type TopicSection = {key: string; title: string; description: string; articles: TopicArticle[]};
const article = (id: string, title: string): TopicArticle => ({id, title});

const sections: TopicSection[] = [
  {key: 'standards', title: 'Low Voltage Standards', description: 'Niederspannungs-Schaltgerätekombinationen, IEC 61439 und Bauartnachweise.', articles: [
    article('low-voltage-standards/iec-61439-niederspannungs-schaltgeraetekombinationen', 'IEC 61439 – Überblick'),
    article('low-voltage-standards/iec-61439-kapitel-10-pruefungen-design-verification', 'IEC 61439 – Prüfungen und Bauartnachweis'),
  ]},
  {key: 'measurement', title: 'Measurement Technology', description: 'Sensoren, Messketten, Temperaturmessung und Messunsicherheit.', articles: [
    article('measurement-technology', 'Grundlagen der Messtechnik'),
    article('measurement-technology/temperaturmessung-und-messgenauigkeit', 'Temperaturmessung und Messgenauigkeit'),
  ]},
  {key: 'test', title: 'Test Engineering', description: 'Prüfstrategien, Testautomatisierung und Qualitätssicherung.', articles: [
    article('test-engineering', 'Test Engineering'),
  ]},
  {key: 'automation', title: 'Automation', description: 'Skripte, Automatisierung und wiederverwendbare Arbeitsabläufe.', articles: [
    article('automation', 'Automation'),
  ]},
  {key: 'wincc', title: 'WinCC OA', description: 'CTRL-Programmierung, Panels und grafische Anpassungen.', articles: [
    article('wincc-oa/wincc-oa-ctrl-links', 'CTRL – Programmiersprache und Links'),
    article('wincc-oa/wincc-oa-gedi-graphics-links', 'GEDI – Panels und Grafik'),
  ]},
  {key: 'software', title: 'Software Engineering', description: 'KI-gestützte Entwicklung, GitHub-Workflows und Softwarearchitektur.', articles: [
    article('ai-software-engineering-matt-pocock', 'KI-gestütztes Software Engineering'),
    article('chatgpt-github-pages-workflow', 'ChatGPT → GitHub Pages'),
  ]},
  {key: 'documentation', title: 'Documentation', description: 'Struktur, Standards und wiederverwendbare technische Dokumentation.', articles: [
    article('documentation', 'Documentation'),
  ]},
  {key: 'lernhelden', title: 'Lernhelden', description: 'Architektur und Abläufe des Lernspiels.', articles: [
    article('lernhelden-architecture', 'Lernhelden-Architektur'),
    article('lernhelden-flowchart', 'Lernhelden – Draw.io Gesamtflow'),
  ]},
  {key: 'more', title: 'More Topics', description: 'Weitere technische Artikel, Ideen und Experimente.', articles: [
    article('more-topics', 'Weitere Themen'),
  ]},
];

// Map exported notes to subject areas, never to a source-specific navigation group.
// New notes are automatically listed under More Topics until assigned here.
const importedTopics: Record<string, {section: string; title: string}> = {
  'obsidian/Stromwandler-pruefen-IEC-61439-1': {
    section: 'standards', title: 'Stromwandler in Schaltgerätekombinationen prüfen',
  },
  'obsidian/Temperatursensoren': {
    section: 'measurement', title: 'Temperatursensoren – Auswahl und Schaltungen',
  },
};

function importedArticles(): TopicArticle[] {
  const root = path.join(__dirname, 'docs', 'obsidian');
  const result: TopicArticle[] = [];
  function walk(dir: string) {
    let entries;
    try {
      entries = readdirSync(dir, {withFileTypes: true});
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'de'))) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(fullPath); continue; }
      if (!entry.isFile() || !/\.mdx?$/i.test(entry.name)) continue;
      const relative = path.relative(root, fullPath).split(path.sep).join('/');
      if (relative === 'index.md') continue;
      const id = 'obsidian/' + relative.replace(/\.mdx?$/i, '');
      const content = readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
      const frontmatter = content.match(/^(?:<!--[^]*?-->\s*)?---\s*\r?\n([^]*?)\r?\n---(?:\r?\n|$)/)?.[1];
      const title = frontmatter?.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2')
        || content.match(/^#\s+(.+)$/m)?.[1]?.replace(/\s+\{#[^}]+\}\s*$/, '').trim()
        || entry.name.replace(/\.mdx?$/i, '').replace(/[-_]/g, ' ');
      result.push(article(id, title));
    }
  }
  walk(root);
  return result;
}

export function getTopicSections(): TopicSection[] {
  const result = sections.map(section => ({...section, articles: [...section.articles]}));
  for (const item of importedArticles()) {
    const assignment = importedTopics[item.id];
    const target = result.find(section => section.key === assignment?.section)
      ?? result.find(section => section.key === 'more')!;
    target.articles.push({...item, title: assignment?.title ?? item.title});
  }
  return result;
}
