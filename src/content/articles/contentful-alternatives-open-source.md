---
title: "Contentful Alternatives: Open Source Options for 2026"
excerpt: "Contentful gets expensive at scale. Here are the open source headless CMS alternatives with honest comparisons."
category: "Comparisons"
readTime: "9 min read"
date: "April 2026"
---

Contentful is a good product. The API is clean, the content modeling is flexible, and the developer experience is polished. But at some point, most teams hit the same wall: pricing.

The free tier caps you at 5 users and 1 million API calls per month. The Team plan jumps to $300/month. After that, you're in "contact sales" territory, which usually means four-figure monthly bills. For a headless CMS that stores your content, that adds up fast.

There's also the lock-in problem. Your content lives on Contentful's servers, structured in Contentful's format. Migrating out means writing custom export scripts, mapping field types, and rebuilding your content model elsewhere. The longer you use it, the harder it is to leave.

These are the two reasons developers search for Contentful alternatives: cost and control.

## What to look for in an alternative

Before evaluating specific tools, here's what matters:

- **Self-hosted option.** You control the data, the server, and the backups. No surprise pricing changes.
- **API compatibility.** REST and/or GraphQL that your frontend can consume without major refactoring.
- **Content modeling flexibility.** Relations, nested components, localization, media handling.
- **Admin UI.** Your content team needs somewhere to work. The admin panel matters.
- **Active development.** Open-source projects die. Check commit frequency, issue response times, and release cadence.

## Comparison table

| Feature | Contentful | Strapi | Payload | Directus | drop.js | Sanity |
|---|---|---|---|---|---|---|
| **Open source** | No | Yes (MIT) | Yes (MIT) | Yes (GPL) | Yes (MIT) | Toolkit only |
| **Self-hosted** | No | Yes | Yes | Yes | Yes | Partial |
| **REST API** | Yes | Yes | Yes | Yes | Yes | Yes (GROQ) |
| **GraphQL** | Yes | Plugin | Yes | No (extension) | Built-in | No (GROQ instead) |
| **JSON:API** | No | No | No | No | Built-in | No |
| **Admin UI** | Hosted | React | React | Vue.js | Next.js | React (hosted) |
| **Content modeling** | Visual (web) | Visual + code | Code (TS config) | Visual (web) | Code (JSON config) | Code (JS/TS schema) |
| **Free tier** | 5 users, 1M calls | Unlimited (self-host) | Unlimited (self-host) | Unlimited (self-host) | Unlimited (self-host) | 3 users, generous limits |
| **Paid plans** | From $300/mo | From $29/mo (Cloud) | From $50/mo (Cloud) | From $99/mo (Cloud) | Self-host only | From $15/user/mo |

## Strapi

Strapi is the most popular open-source headless CMS, and for good reason. If you're coming from Contentful, it's the closest experience you'll find in a self-hosted tool.

The content type builder is visual -- you add fields, set validations, and configure relations through a web UI. The admin panel is polished React that content editors can use without developer assistance. REST APIs are generated automatically, and GraphQL is available via plugin.

```bash
npx create-strapi-app my-project --quickstart
# Admin running at http://localhost:1337/admin
```

**Strengths:** Large community, extensive plugin marketplace, visual content modeling, Strapi Cloud for managed hosting.

**Trade-offs:** The v4 to v5 migration was rough -- significant breaking changes and many community plugins needed updates. Some features (content workflow, review stages) are locked behind the Enterprise Edition. The plugin ecosystem is a double-edged sword: you get flexibility, but you also get dependency management headaches.

**Best for:** Teams that want the closest self-hosted equivalent to Contentful's developer experience, especially if non-developers need to manage content types.

## Payload

Payload is the newer entrant that's been gaining serious traction. It's TypeScript-first, and content types are defined in code rather than through a visual builder.

```typescript
// payload.config.ts
const Articles: CollectionConfig = {
  slug: 'articles',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'publishedDate', type: 'date' },
  ],
}
```

This code-based approach means your content model lives in your repository, is reviewable in PRs, and gets full TypeScript type checking. The admin panel auto-generates from your config and looks clean.

**Strengths:** Excellent TypeScript DX, code-based config, built-in authentication, access control, and file uploads. Local API (call your CMS functions directly in your Next.js app without HTTP requests). Active development with frequent releases.

**Trade-offs:** Smaller community than Strapi. Fewer tutorials and Stack Overflow answers. The code-first approach means non-developers can't modify content types without a developer deploying changes.

**Best for:** TypeScript-heavy teams that want their CMS config in code, especially if you're already using Next.js.

## Directus

Directus takes a fundamentally different approach: it wraps any existing SQL database with an instant API and admin panel. You point it at your PostgreSQL or MySQL database, and it introspects the schema to generate REST endpoints and a Vue.js admin UI.

```bash
npx create-directus-project my-project
# Or connect to an existing database
```

This makes it uniquely useful if you have existing data. No migration needed -- Directus reads your tables as-is and builds an API around them.

**Strengths:** Works with existing databases, database-agnostic, clean Vue.js admin, flexible permission system. Good for teams that want an API layer over existing data without rewriting their schema.

**Trade-offs:** GraphQL support is limited and requires extensions. The "database-first" approach means content modeling is tied to SQL schema design, which can be awkward for complex content structures like nested components or polymorphic content. Performance can lag with complex relational queries on large datasets.

**Best for:** Teams with existing SQL databases that need an API and admin UI without migration. Also good for projects where the database schema is the source of truth.

## drop.js

drop.js approaches the problem differently from all of the above. It implements Drupal's entity/field system natively in Node.js. If you know Drupal's architecture -- entities, bundles, fields, taxonomy, paragraphs -- you'll recognize the patterns immediately, but everything runs on Node.js with TypeScript.

Content types are defined in JSON configuration files:

```json
{
  "name": "article",
  "label": "Article",
  "fields": {
    "title": {
      "type": "string",
      "required": true
    },
    "body": {
      "type": "text_long"
    },
    "tags": {
      "type": "entity_reference",
      "target": "taxonomy_term",
      "vocabulary": "tags"
    }
  }
}
```

From that config, you get REST, GraphQL, and JSON:API endpoints -- 220+ total across all content types, taxonomy, users, and admin operations. Swagger documentation is auto-generated. No plugins to install.

```bash
npx create-drop-app my-site
# 220+ endpoints ready, including:
# REST:     GET /api/articles
# GraphQL:  POST /graphql
# JSON:API: GET /jsonapi/node/article
# Docs:     GET /api/docs
```

**Strengths:** Everything ships in one package -- content workflows (draft/review/published/archived), multilingual support for 16 languages, hierarchical taxonomy, paragraphs, revision history, RBAC with 19 permissions, full-text search, webhooks, and batch API. The unique feature is 100% Drupal 11 database compatibility: you can export the SQLite database and import it directly into Drupal.

**Trade-offs:** Smaller community than Strapi or Payload. No visual content type builder -- you edit JSON files. The admin UI is functional but less polished than Strapi's. No managed cloud hosting option.

**Best for:** Teams that need enterprise content modeling features out of the box without plugins, teams with Drupal experience or a potential Drupal migration path, and projects that want REST + GraphQL + JSON:API from a single install.

## Sanity

Sanity isn't open source in the traditional sense -- the backend is proprietary and hosted. But the studio (admin UI) and client libraries are open source, and the free tier is genuinely generous: 3 users, 500K API requests, 20GB bandwidth, 10GB assets.

Sanity uses GROQ, its own query language, instead of GraphQL or REST. GROQ is powerful -- it handles complex queries more concisely than GraphQL in many cases -- but it's another thing to learn.

```javascript
// GROQ query
*[_type == "article" && category->title == "Engineering"] {
  title,
  publishedAt,
  "author": author->name,
  body
} | order(publishedAt desc)[0...10]
```

**Strengths:** Real-time collaboration (Google Docs-style editing), excellent structured content modeling, generous free tier, fast CDN-backed API. The content lake architecture handles complex queries well.

**Trade-offs:** Not fully self-hostable. Vendor lock-in still applies -- your data lives on Sanity's servers. GROQ is powerful but proprietary, so you're learning a query language you can't use anywhere else. Pricing scales with usage (API calls, bandwidth, assets).

**Best for:** Teams that want a managed service with a better pricing model than Contentful, especially for content-heavy sites with real-time collaboration needs. A middle ground between fully hosted (Contentful) and fully self-hosted.

## Making the decision

The choice depends on what drove you away from Contentful in the first place.

**If it's purely pricing:** Self-host Strapi or Payload. Both are free, well-documented, and have active communities. You'll pay for hosting instead of per-seat licensing, which is almost always cheaper.

**If it's vendor lock-in:** Any self-hosted option solves this, but consider data portability too. drop.js's Drupal compatibility gives you an additional exit strategy. Directus works with standard SQL, which is inherently portable.

**If it's feature gaps:** Look at what you actually need. Content workflows? drop.js includes them free; Strapi charges for Enterprise. Real-time collaboration? Sanity. Existing database you can't migrate? Directus. Type-safe local API in Next.js? Payload.

**If it's all three:** Start with what matches your team's skills. PHP/Drupal background? drop.js. JavaScript generalists? Strapi or Payload. Database-first mindset? Directus.

There's no single "best Contentful alternative." There are trade-offs, and the right choice depends on your team, your project, and which trade-offs you're willing to make.
