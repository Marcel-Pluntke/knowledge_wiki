import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  to: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Documentation',
    description: (
      <>
        Learn how clear structure, shared standards, and good examples make technical knowledge reusable.
        Follow practical notes and templates that keep docs useful over time.
      </>
    ),
    to: '/docs/documentation',
  },
  {
    title: 'Automation',
    description: (
      <>
        Explore ways to reduce repetitive manual work in delivery, maintenance, and operations.
        Focus on scripts and workflows that are simple, testable, and easy to improve.
      </>
    ),
    to: '/docs/automation',
  },
  {
    title: 'Test Engineering',
    description: (
      <>
        Dive into approaches for building reliable automated tests across different layers.
        See strategies for stable pipelines, readable test suites, and actionable quality signals.
      </>
    ),
    to: '/docs/test-engineering',
  },
  {
    title: 'More Topics',
    description: (
      <>
        Collect additional ideas and experiments that support engineering effectiveness.
        Expect short write-ups on tooling, collaboration, and technical learning paths.
      </>
    ),
    to: '/docs/more-topics',
  },
];

function Feature({title, description, to}: FeatureItem) {
  return (
    <div className={clsx('col col--6', styles.featureCardWrap)}>
      <article className={styles.featureCard}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link className="button button--primary button--sm" to={to}>
          Read page
        </Link>
      </article>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}