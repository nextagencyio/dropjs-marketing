Choosing a headless CMS for Next.js means picking the system your team will live with for years. The wrong choice creates migration debt. The right one disappears into the background and lets you ship.

This is a practical comparison of five headless CMS options that work well with Next.js. No "top 50" listicle. Just the ones worth your time, with actual code showing how each one integrates with the App Router.

## What Makes a CMS Good for Next.js

Next.js fetches data at build time, request time, or on the client. A good headless CMS for Next.js needs to:

- Return JSON over HTTP (REST, GraphQL, or both)
- Support incremental static regeneration (ISR) via webhooks or cache tags
- Have a content modeling system flexible enough for real-world sites
- Not require a PhD to set up locally

Every CMS on this list meets those baseline requirements. The differences are in DX, pricing, self-hosting options, and how much content complexity they can handle.

## Contentful

Contentful is the SaaS headless CMS that most Next.js tutorials reference. It has been around since 2013, has excellent TypeScript SDKs, and offers both REST and GraphQL APIs.

### Why Teams Choose It

Zero infrastructure. You sign up, define content types in the web UI, and start fetching data. The free tier gives you 1 space, 5 users, and 25,000 records. That is enough for most small-to-medium projects.

The JavaScript SDK handles pagination, rate limiting, and content preview out of the box. Rich text fields return a structured JSON AST, which is annoying at first but powerful once you build your renderer.

### The Trade-offs

Pricing escalates fast. The Team plan starts at $300/month. Enterprise pricing is opaque and usually involves talking to sales. If your content grows, so does your bill, and you cannot self-host to cap costs.

Vendor lock-in is real. Contentful's content model is proprietary. Migrating away means writing export scripts and mapping their field types to whatever you move to.

### Next.js Integration

```typescript
// app/articles/page.tsx
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export default async function ArticlesPage() {
  const entries = await client.getEntries({
    content_type: 'article',
    order: ['-sys.createdAt'],
  });

  return (
    <ul>
      {entries.items.map((item) => (
        <li key={item.sys.id}>{item.fields.title as string}</li>
      ))}
    </ul>
  );
}
```

## Sanity

Sanity takes a different approach. Your content schema lives in code (JavaScript/TypeScript), and the editing interface (Sanity Studio) is a React application you can customize and deploy anywhere.

### Why Teams Choose It

Content modeling in code means version control, code review, and branch-based content schemas. GROQ, Sanity's query language, is genuinely powerful for filtering and projecting content.

Real-time collaboration works out of the box. Multiple editors can work on the same document simultaneously without conflicts. The Content Lake (Sanity's hosted backend) handles merging.

Sanity Studio is embeddable. You can mount it as a route inside your Next.js app at `/studio` and have your CMS and frontend in the same deployment.

### The Trade-offs

GROQ has a learning curve. It is not GraphQL. It is not SQL. It is its own thing. Your team needs to learn it, and there is no industry-wide knowledge base like there is for GraphQL.

Pricing is per-dataset and per-user. The free tier is generous (3 datasets, 10K documents, 500K API requests/month), but costs can surprise you on larger projects with multiple environments.

### Next.js Integration

```typescript
// app/articles/page.tsx
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export default async function ArticlesPage() {
  const articles = await client.fetch(
    `*[_type == "article"] | order(_createdAt desc) { _id, title, slug }`
  );

  return (
    <ul>
      {articles.map((article: any) => (
        <li key={article._id}>{article.title}</li>
      ))}
    </ul>
  );
}
```

## Strapi

Strapi is the most popular open-source headless CMS. It is self-hosted, has a visual content-type builder, and exposes both REST and GraphQL APIs. You own the server, the database, and the data.

### Why Teams Choose It

It is free. The core is MIT-licensed. You deploy it on your own infrastructure and pay nothing to Strapi (the company) unless you want their cloud hosting or enterprise features.

The admin panel is polished. Non-technical editors can create content types, define fields, and manage content without touching code. The plugin ecosystem covers common needs like SEO, sitemap generation, and media management.

### The Trade-offs

Self-hosting means you handle updates, backups, database management, and scaling. This is either a pro or a con depending on your team.

The v4 to v5 migration was painful for many teams. Strapi v5 changed the underlying data layer and broke backward compatibility with many community plugins. If you are starting fresh, this does not matter. If you are inheriting a v4 project, budget time for the upgrade.

### Next.js Integration

```typescript
// app/articles/page.tsx
export default async function ArticlesPage() {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/articles?sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );
  const { data } = await res.json();

  return (
    <ul>
      {data.map((article: any) => (
        <li key={article.id}>{article.attributes.title}</li>
      ))}
    </ul>
  );
}
```

## Payload

Payload is the TypeScript-first CMS that runs inside your Next.js application. Since version 3.0, Payload embeds directly in Next.js as a plugin. One codebase, one deployment, one server.

### Why Teams Choose It

The DX is excellent. You define collections in TypeScript, and Payload generates the admin UI, REST API, GraphQL API, and TypeScript types from that config. There is no separate backend to deploy.

Because Payload runs inside Next.js, your server components can import Payload's local API directly. No HTTP round-trip, no serialization overhead. Data fetching is a function call.

### The Trade-offs

The "runs inside Next.js" architecture means your CMS and frontend are coupled at the deployment level. Scaling them independently is not straightforward. If your content API gets hammered, your frontend is affected too.

Payload is newer than the other options here. The community is growing fast, but the plugin ecosystem is smaller than Strapi's. Some integrations you might need do not exist yet.

### Next.js Integration

```typescript
// app/articles/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';

export default async function ArticlesPage() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'articles',
    sort: '-createdAt',
  });

  return (
    <ul>
      {docs.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
```

No `fetch()`, no API URL, no authentication tokens. Payload's local API runs in the same process.

## drop.js

drop.js takes Drupal's entity/field architecture and implements it natively in Node.js with TypeScript. You define content types in JSON, and drop.js generates REST API, GraphQL, and JSON:API endpoints automatically. 220+ endpoints from a single `npm` package.

### Why Teams Choose It

If your content model is complex (taxonomies, entity references, content workflows, paragraphs, revisions), drop.js handles that out of the box. These are not plugins or add-ons. They are core features inherited from Drupal's 20 years of content modeling.

The API surface is massive. You get REST, GraphQL, and JSON:API simultaneously. OpenAPI/Swagger documentation is auto-generated at `/api/docs`. For teams that need to serve content to multiple consumers (Next.js, mobile apps, third-party integrations), having three API formats from day one is valuable.

The admin interface ships with 60 pages covering content management, user management, taxonomy, permissions, and site configuration. Content editors do not need to wait for you to build admin features.

### The Trade-offs

drop.js runs as a separate server. Unlike Payload, you cannot embed it inside Next.js. You deploy two services and connect them over HTTP. For many teams this is the preferred architecture (separation of concerns), but it does add operational complexity compared to the embedded approach.

The community is newer and smaller. You are more likely to be reading source code than Stack Overflow answers when you hit edge cases.

### Next.js Integration

```typescript
// app/articles/page.tsx
export default async function ArticlesPage() {
  const res = await fetch(
    `${process.env.DROPJS_URL}/api/node/article?sort=-created`,
    { next: { revalidate: 60 } }
  );
  const { data } = await res.json();

  return (
    <ul>
      {data.map((article: any) => (
        <li key={article.id}>{article.attributes.title}</li>
      ))}
    </ul>
  );
}
```

Or use GraphQL:

```typescript
// app/articles/page.tsx
export default async function ArticlesPage() {
  const res = await fetch(`${process.env.DROPJS_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          nodeArticles(sort: { field: "created", direction: DESC }) {
            id
            title
            body {
              value
              summary
            }
          }
        }
      `,
    }),
    next: { revalidate: 60 },
  });
  const { data } = await res.json();

  return (
    <ul>
      {data.nodeArticles.map((article: any) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
```

## Decision Matrix

Not every CMS fits every team. Here is how these five options compare across the dimensions that actually matter.

### By Team Size

| CMS | Solo / Small Team | Mid-size (5-15) | Large (15+) |
|-----|-------------------|-----------------|--------------|
| Contentful | Good (zero ops) | Good | Good (if budget allows) |
| Sanity | Good | Great (collaboration) | Great |
| Strapi | Okay (self-host burden) | Good | Good |
| Payload | Great (one codebase) | Good | Needs planning |
| drop.js | Good | Great | Great (familiar to Drupal teams) |

### By Budget

| CMS | Free Tier | Paid Starting At | Self-Hostable |
|-----|-----------|-------------------|---------------|
| Contentful | 25K records, 5 users | $300/mo | No |
| Sanity | 10K docs, 500K API req | $15/user/mo | No (backend) |
| Strapi | Unlimited (self-host) | $0 (community) | Yes |
| Payload | Unlimited (self-host) | $0 (community) | Yes |
| drop.js | Unlimited (self-host) | $0 (MIT license) | Yes |

### By Content Complexity

If your content model involves taxonomies, nested components (paragraphs), multi-step workflows, and revision history, the ranking shifts:

1. **drop.js** — These features are core, not bolted on. Entity references, paragraphs, revisions, taxonomy, and content workflows ship out of the box.
2. **Payload** — Rich relational modeling, versioning, and access control built in.
3. **Sanity** — Flexible structured content, but workflows and revisions require custom implementation or plugins.
4. **Contentful** — Content types and references work well, but the free tier limits complexity. Workflows are an enterprise feature.
5. **Strapi** — Content types and relations are solid. Draft/publish is built in. Complex workflows need plugins.

### By Performance Needs

For ISR and static generation, any CMS that returns JSON over HTTP works. The performance differences come from:

- **Payload** wins on raw latency for server components (local API, no network hop)
- **Contentful** and **Sanity** win on CDN-edge caching (their hosted APIs are globally distributed)
- **Strapi** and **drop.js** depend on your hosting. Deploy on the same network as your Next.js app for low latency, or put a CDN in front for global distribution

## Which One Should You Pick

If you want zero infrastructure and can pay for it: **Contentful** or **Sanity**.

If you want to own your stack and your content model is simple to moderate: **Strapi** or **Payload**.

If you want Payload's DX and are okay coupling your CMS to your Next.js deployment: **Payload**.

If you are coming from Drupal, need complex content modeling, or want three API formats without configuration: **drop.js**.

If you are not sure, start with the content model. Write down every content type, field, and relationship your project needs. Then see which CMS handles that model without workarounds. The best headless CMS for your Next.js project is the one that models your content accurately without fighting you on the details.
