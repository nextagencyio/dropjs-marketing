export interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
}

export const articles: Article[] = [
  {
    slug: 'what-is-headless-cms',
    category: 'Concepts',
    title: 'What Is a Headless CMS? A Developer\'s Guide',
    excerpt:
      'A practical guide to headless CMS architecture — what it is, how it works, and when it makes sense. Written for developers, not marketers.',
    readTime: '10 min read',
    date: 'April 2026',
  },
  {
    slug: 'headless-cms-vs-traditional-cms',
    category: 'Concepts',
    title: 'Headless CMS vs Traditional CMS: A Technical Comparison',
    excerpt:
      'When should you use a headless CMS and when is a traditional CMS the right call? An honest comparison with code examples.',
    readTime: '8 min read',
    date: 'April 2026',
  },
  {
    slug: 'open-source-headless-cms-guide',
    category: 'Guides',
    title: 'Open Source Headless CMS: The Complete 2026 Guide',
    excerpt:
      'A genuine comparison of open source headless CMS options — Strapi, Payload, KeystoneJS, Directus, Ghost, and drop.js. Real criteria, honest trade-offs.',
    readTime: '12 min read',
    date: 'April 2026',
  },
  {
    slug: 'dropjs-vs-strapi',
    category: 'Comparisons',
    title: 'drop.js vs Strapi: Which Node.js CMS Should You Choose?',
    excerpt:
      'An honest technical comparison of drop.js and Strapi. Where each wins, where each falls short, and how to pick the right one for your project.',
    readTime: '9 min read',
    date: 'April 2026',
  },
  {
    slug: 'contentful-alternatives-open-source',
    category: 'Comparisons',
    title: 'Contentful Alternatives: Open Source Options for 2026',
    excerpt:
      'Contentful gets expensive at scale. Here are the open source headless CMS alternatives — with honest comparisons on features, pricing, and self-hosting.',
    readTime: '9 min read',
    date: 'April 2026',
  },
  {
    slug: 'drupal-alternative-nodejs',
    category: 'Drupal',
    title: 'Drupal Alternative for Node.js Developers',
    excerpt:
      'What if you could keep Drupal\'s proven architecture — entities, fields, taxonomies, views — but run it on Node.js? That is exactly what drop.js does.',
    readTime: '10 min read',
    date: 'April 2026',
  },
  {
    slug: 'best-headless-cms-nextjs',
    category: 'Guides',
    title: 'Best Headless CMS for Next.js in 2026',
    excerpt:
      'A practical comparison of headless CMS options for Next.js projects. Contentful, Sanity, Strapi, Payload, and drop.js — with actual integration code.',
    readTime: '10 min read',
    date: 'April 2026',
  },
  {
    slug: 'dropjs-nextjs-tutorial',
    category: 'Tutorials',
    title: 'Using drop.js with Next.js: A Complete Tutorial',
    excerpt:
      'Step-by-step guide to building a content-driven Next.js app with drop.js as the headless backend. From zero to deployed.',
    readTime: '12 min read',
    date: 'April 2026',
  },
  {
    slug: 'drupal-to-nodejs-migration',
    category: 'Drupal',
    title: 'Migrating from Drupal to Node.js with drop.js',
    excerpt:
      'drop.js is the only CMS that is database-compatible with Drupal 11. Here is how to migrate your content, schemas, and architecture.',
    readTime: '12 min read',
    date: 'April 2026',
  },
  {
    slug: 'entity-field-system-nodejs',
    category: 'Drupal',
    title: 'Drupal\'s Entity/Field System in Node.js: How drop.js Works',
    excerpt:
      'A deep dive into how drop.js implements Drupal\'s entity/field architecture natively in Node.js. Every concept mapped, side by side.',
    readTime: '10 min read',
    date: 'April 2026',
  },
  {
    slug: 'api-first-cms-explained',
    category: 'Concepts',
    title: 'What Is an API-First CMS? (And Why It Matters)',
    excerpt:
      'API-first means your content is available everywhere — web, mobile, IoT, AI. Here is what that looks like in practice.',
    readTime: '8 min read',
    date: 'April 2026',
  },
  {
    slug: 'graphql-cms-guide',
    category: 'Guides',
    title: 'GraphQL CMS: When and Why to Use GraphQL for Content',
    excerpt:
      'GraphQL is not always the right choice for a CMS. Here is when it shines, when REST is simpler, and how drop.js gives you both.',
    readTime: '8 min read',
    date: 'April 2026',
  },
  {
    slug: 'what-is-jamstack',
    category: 'Concepts',
    title: 'What Is JAMstack? A Modern Architecture Explained',
    excerpt:
      'JAMstack separates your frontend from your backend. Here is what that means, when it makes sense, and how a headless CMS fits in.',
    readTime: '8 min read',
    date: 'April 2026',
  },
];

export function getRelatedArticles(currentSlug: string): Article[] {
  const current = articles.find((a) => a.slug === currentSlug);
  if (!current) return articles.slice(0, 3);

  const sameCategory = articles.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  );
  const others = articles.filter(
    (a) => a.slug !== currentSlug && a.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, 3);
}
