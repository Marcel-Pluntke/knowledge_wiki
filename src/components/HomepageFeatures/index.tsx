import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {TopicSection} from '../../../topicCatalog';
import styles from './styles.module.css';

export default function HomepageFeatures({compact = false}: {compact?: boolean}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const sections = siteConfig.customFields?.topicSections as TopicSection[] | undefined;
  return (
    <section className={compact ? styles.compact : styles.features} aria-label="Themenübersicht">
      <div className={compact ? undefined : 'container'}>
        {!compact && <Heading as="h2" className={styles.sectionTitle}>Topics</Heading>}
        <div className={styles.topicGrid}>
          {sections?.map(section => (
            <article key={section.key} className={styles.featureCard}>
              <Heading as="h2" className={styles.cardTitle}>{section.title}</Heading>
              <p>{section.description}</p>
              <ul className={styles.articleList}>
                {section.articles.map(article => (
                  <li key={article.id}>
                    <Link to={'/docs/' + article.id.split('/').map(encodeURIComponent).join('/')}>{article.title}</Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
