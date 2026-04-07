If you're evaluating open-source headless CMS platforms, you've probably noticed the landscape is crowded. Every project claims to be developer-friendly, API-first, and the future of content management. This guide cuts through the positioning and gives you a practical comparison of six real options.

All of these are open source, self-hosted, and free to run. The trade-offs are in architecture, developer experience, maturity, and ecosystem.

## Why Open Source Matters for a CMS

Your CMS holds your content — the most valuable part of most websites and applications. Open source gives you:

- **No vendor lock-in.** You can fork, modify, or migrate away at any time.
- **Data ownership.** Your content lives in your database, on your infrastructure.
- **Cost control.** No per-seat pricing, no usage-based billing, no surprise invoices.
- **Transparency.** You can read the code that handles your data. No black boxes.

The trade-off is operational responsibility. You manage hosting, updates, backups, and security patches. For teams with DevOps capability, this is fine. For teams without it, a managed SaaS CMS might be a better fit.

## The Contenders

### Strapi

Strapi is the most popular open-source headless CMS by a significant margin. It has the largest community, the most tutorials, and the most third-party plugins.

**How it works:** Strapi provides a visual Content-Type Builder in its admin panel. You define content types by clicking through a UI — adding fields, setting validations, configuring relationships. It generates REST and GraphQL APIs automatically from those definitions.

**Tech stack:** Node.js, Koa (or Fastify in v5), supports SQLite, PostgreSQL, MySQL.

```bash
npx create-strapi-app my-project --quickstart
```

**What's good:** The community is large and active. Documentation is comprehensive. The plugin ecosystem covers common needs — i18n, SEO, media management. If you hit a problem, someone's probably solved it on Stack Overflow or GitHub Discussions.

**What's not:** Strapi's major version upgrades have been painful. The v3 to v4 migration was substantial, and v4 to v5 introduced another round of significant breaking changes. If you build a production app on Strapi, budget time for migration work when new major versions land. The visual content type builder is convenient but can feel limiting for complex data models.

**Best for:** Teams who want a visual admin experience and value a large ecosystem of plugins and community resources.

### Payload

Payload takes a fundamentally different approach. Everything is defined in TypeScript config files. There's no visual content type builder — your content model lives in code, version-controlled alongside your application.

**How it works:** You write a Payload config that defines collections (content types) with fields, hooks, access control, and validation. Payload generates REST and GraphQL APIs, plus a React admin panel that reflects your config.

**Tech stack:** TypeScript, Next.js (v3+), supports MongoDB and PostgreSQL.

```typescript
// payload.config.ts
import { buildConfig } from 'payload';

export default buildConfig({
  collections: [
    {
      slug: 'articles',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
        { name: 'publishedDate', type: 'date' },
      ],
    },
  ],
});
```

**What's good:** The developer experience is outstanding. TypeScript throughout means your content model is type-safe. Config-as-code means your CMS schema is reviewable in pull requests. The admin UI is polished and fast. Payload v3's integration with Next.js is seamless.

**What's not:** The ecosystem is smaller than Strapi's. Payload is newer, so there are fewer tutorials, fewer third-party plugins, and fewer battle-tested production deployments to reference. MongoDB was the only database option until recently — PostgreSQL support came with v3.

**Best for:** TypeScript-focused teams who want config-as-code and a modern developer experience.

### KeystoneJS

KeystoneJS is built on Prisma and takes a GraphQL-first approach. It's maintained by the team at Thinkmill and has been around for several years.

**How it works:** You define a schema in TypeScript using Keystone's list API. Keystone generates a GraphQL API and an admin UI automatically. Prisma handles the database layer.

**Tech stack:** TypeScript, Prisma, GraphQL, supports PostgreSQL, MySQL, SQLite.

```typescript
import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';

export const lists = {
  Article: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: text({ ui: { displayMode: 'textarea' } }),
      author: relationship({ ref: 'User' }),
      publishedAt: timestamp(),
    },
  }),
};
```

**What's good:** The API is clean and well-designed. Prisma integration means excellent database tooling. The GraphQL API is first-class, not an afterthought. The admin UI is functional and generates automatically from your schema.

**What's not:** Development activity has slowed compared to Strapi and Payload. The community is smaller. REST API support is not built-in — it's GraphQL-only unless you add a REST layer yourself. If your consumers prefer REST, this is a significant limitation.

**Best for:** Teams committed to GraphQL who want a clean, Prisma-based architecture.

### Directus

Directus takes a unique approach: it wraps any existing SQL database with an instant API and admin panel. You can point it at a database you already have and get an API immediately.

**How it works:** Directus connects to your SQL database, introspects the schema, and generates REST and GraphQL APIs. The admin UI lets non-technical users manage content. You can also create new tables and fields through the admin panel.

**Tech stack:** Node.js, Vue.js (admin), supports PostgreSQL, MySQL, SQLite, MS SQL, MariaDB, CockroachDB.

```bash
npx create-directus-project my-project
```

**What's good:** The database-first approach is powerful for brownfield projects. If you have an existing database with content, Directus gives you an API and admin UI without migrating anything. The admin UI is one of the most polished in the open-source CMS space. Database support is the broadest of any option here.

**What's not:** Directus is not a Node.js-native CMS in the traditional sense — it's a database abstraction layer with a CMS on top. Custom business logic goes through Directus's extension system (Flows, hooks, endpoints), which has its own learning curve. Performance can vary depending on the complexity of your database schema and queries.

**Best for:** Teams with existing databases who want an instant API and admin UI, or teams who want maximum database flexibility.

### Ghost

Ghost started as a blogging platform and has evolved into a publishing-focused CMS with built-in newsletter and membership features.

**How it works:** Ghost provides a beautiful Markdown-based editor, a content API for headless delivery, and built-in features for newsletters, paid subscriptions, and member management. It can run as a traditional blog or as a headless CMS.

**Tech stack:** Node.js, Ember.js (admin), MySQL.

```bash
ghost install
```

**What's good:** The writing experience is one of the best. The editor is distraction-free and pleasant to use. Built-in newsletter delivery and membership management mean you don't need to integrate Mailchimp or Stripe separately. For publishing-focused projects, Ghost is hard to beat.

**What's not:** Content modeling is limited. Ghost is designed for posts, pages, and tags. If you need custom content types — products, events, case studies, portfolios — Ghost doesn't support them natively. The Content API is read-only; the Admin API handles writes but is more limited than what Strapi or Payload offer. Ghost is a publishing platform that can work headless, not a general-purpose headless CMS.

**Best for:** Blogs, newsletters, and publishing operations where the writing experience matters most.

### drop.js

drop.js brings Drupal's entity/field architecture to Node.js. If you've worked with Drupal, the mental model is familiar: content types, fields, taxonomies, entities, and a permission system. But the implementation is pure Node.js and TypeScript.

**How it works:** You define content types in JSON configuration. drop.js generates REST API endpoints, GraphQL queries, and JSON:API resources automatically. The admin UI provides 60+ pages for content management, user administration, and configuration.

**Tech stack:** TypeScript, Node.js, supports MySQL/MariaDB (Drupal-compatible schema).

```bash
npx create-drop-app my-site
```

Content type definition:

```json
{
  "name": "product",
  "label": "Product",
  "fields": {
    "description": { "type": "text_long" },
    "price": { "type": "decimal" },
    "sku": { "type": "string" },
    "image": { "type": "entity_reference", "target": "file" },
    "category": { "type": "entity_reference", "target": "taxonomy_term" }
  }
}
```

**What's good:** The sheer volume of out-of-the-box functionality is the standout feature. 220+ REST endpoints, 18 field types, and 60 admin pages ship in a single npm package. The database schema is 100% compatible with Drupal, which means you can migrate content between Drupal and drop.js. Three API protocols (REST, GraphQL, JSON:API) are available simultaneously.

**What's not:** drop.js is newer than every other option on this list. The community is small, third-party plugins are scarce, and you'll find fewer tutorials and Stack Overflow answers. The database support is limited to MySQL/MariaDB (a consequence of Drupal schema compatibility). If your team has no Drupal background, the entity/field mental model may feel unfamiliar at first.

**Best for:** Teams who want maximum out-of-the-box API coverage, Drupal-compatible data models, or are migrating from Drupal to Node.js.

## Comparison Table

| | Strapi | Payload | KeystoneJS | Directus | Ghost | drop.js |
|---|---|---|---|---|---|---|
| **Language** | JavaScript | TypeScript | TypeScript | JavaScript | JavaScript | TypeScript |
| **API Types** | REST, GraphQL | REST, GraphQL | GraphQL only | REST, GraphQL | REST (Content + Admin) | REST, GraphQL, JSON:API |
| **Admin UI** | Visual builder | Config-generated | Config-generated | Database-driven | Markdown editor | 60+ admin pages |
| **Database** | SQLite, Postgres, MySQL | MongoDB, Postgres | Postgres, MySQL, SQLite | Postgres, MySQL, SQLite, MSSQL, more | MySQL | MySQL / MariaDB |
| **Content Modeling** | Visual UI + code | Config-as-code | Config-as-code | UI + database introspection | Posts + pages only | JSON config |
| **GitHub Stars** | ~65k | ~30k | ~9k | ~29k | ~48k | <1k |
| **License** | MIT (with EE features) | MIT | MIT | GPL v3 (with BSL for Cloud) | MIT | MIT |

*Star counts are approximate and shift regularly.*

## How to Choose

### Start with your requirements, not the tool.

**If you need a visual content type builder** and a large plugin ecosystem, **Strapi** is the safe choice. It's the most proven option with the most community support.

**If your team is TypeScript-first** and you want your CMS schema in version control, **Payload** offers the best developer experience in this group.

**If you're all-in on GraphQL**, **KeystoneJS** provides the cleanest GraphQL-native experience. Just make sure you don't need REST.

**If you have an existing database** you want to put an API on top of, **Directus** is uniquely suited to that workflow.

**If you're building a publication** — blog, newsletter, magazine — **Ghost** is purpose-built for that and does it very well.

**If you want maximum API surface area out of the box** or you're migrating from Drupal, **drop.js** gives you the most endpoints and field types with the least configuration.

### Factors that actually matter:

1. **Database compatibility.** If you're on PostgreSQL, Ghost and drop.js are out (MySQL only). If you need MSSQL, only Directus supports it.

2. **API protocol.** If your frontend team wants GraphQL, make sure the CMS supports it natively. Bolted-on GraphQL is never as good as native GraphQL.

3. **Content model complexity.** If you have 5 content types with simple fields, any of these works. If you have 50 content types with complex relationships, Strapi, Payload, and drop.js handle that better than Ghost or basic Directus setups.

4. **Team expertise.** Pick the tool your team can maintain long-term. The best CMS is the one your developers actually understand.

5. **Community size.** A larger community means more answered questions, more plugins, more blog posts, and more people who've hit the same bugs you'll hit. Strapi and Ghost have the largest communities. Payload is growing fast. drop.js and KeystoneJS have smaller communities today.

## Self-Hosting Considerations

All of these can run on a single VPS. None of them require Kubernetes in production (despite what some deployment guides suggest).

Minimum viable hosting for any of these:

```
- 1 vCPU, 1-2 GB RAM VPS ($5-12/month)
- Node.js 18+
- Database (SQLite for dev, PostgreSQL or MySQL for production)
- Reverse proxy (nginx or Caddy)
- Process manager (PM2 or systemd)
```

For production, add:

- Automated backups of the database
- SSL certificate (Let's Encrypt via Caddy or Certbot)
- Monitoring (uptime checks at minimum)
- A deployment pipeline (even a simple git pull + restart script)

If you want managed hosting, Strapi and Directus offer cloud versions. Ghost has Ghost(Pro). Payload has Payload Cloud. For the others, you're self-hosting or using a generic Node.js hosting platform like Railway, Render, or Fly.io.

## Final Thoughts

There's no single "best" open-source headless CMS. There's the best one for your project, your team, and your constraints.

If you're paralyzed by choice, here's a pragmatic approach: pick two that match your database and API requirements, build a quick prototype with each (content types, a few entries, fetch from a frontend), and see which one your team prefers to work with. You'll know within a day.

The good news is that all of these are actively maintained, genuinely open source, and capable of powering production applications. The headless CMS space has matured past the "will this project survive" phase for the major players. Pick one and build something.
