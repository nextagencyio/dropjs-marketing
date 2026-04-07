---
title: "GraphQL CMS: When and Why to Use GraphQL for Content"
excerpt: "GraphQL is not always the right choice. Here is when it shines and when REST is simpler."
category: "Guides"
readTime: "8 min read"
date: "April 2026"
---

GraphQL has become the default recommendation in CMS discussions. "Just use GraphQL" is the new "just use REST." But GraphQL isn't always the right choice for content management, and choosing it without understanding the trade-offs will cost you time.

This guide covers when GraphQL actually solves problems for CMS-driven projects, when REST is simpler, and how the major open-source CMS platforms handle GraphQL.

## What GraphQL Solves

GraphQL was created at Facebook in 2012 to solve a specific problem: the News Feed needed to fetch deeply nested, heterogeneous data in a single round trip on mobile devices with limited bandwidth. That origin story matters because it tells you what GraphQL is optimized for.

### Over-Fetching

A REST endpoint for an article returns everything:

```json
{
  "id": 42,
  "title": "GraphQL for Content",
  "slug": "graphql-for-content",
  "body": "<p>5000 words of HTML...</p>",
  "summary": "A short summary",
  "metaDescription": "SEO text",
  "created": "2026-03-15T10:30:00Z",
  "changed": "2026-04-01T08:00:00Z",
  "status": true,
  "sticky": false,
  "promoted": true
}
```

If your component only needs `title` and `slug` for a listing page, you're transferring the entire `body` field for nothing. On a page that renders 50 articles, that waste adds up.

GraphQL lets you request exactly what you need:

```graphql
query {
  articles {
    title
    slug
  }
}
```

The response contains only those two fields. Nothing extra.

### Under-Fetching

Suppose your article page needs the article, its author's name, and its category label. With REST, that's potentially three requests:

```bash
GET /api/articles/42
GET /api/users/7
GET /api/categories/3
```

Three round trips. On a mobile connection, each one adds latency. GraphQL resolves this in a single query:

```graphql
query {
  article(id: 42) {
    title
    body
    author {
      name
      avatar
    }
    category {
      label
      slug
    }
  }
}
```

One request. One response. Exactly the data shape your component expects.

### Typed Schema as Documentation

Every GraphQL API has a schema that describes every type, field, and relationship. This schema is introspectable — tools like GraphQL Playground and GraphiQL let you explore the API, autocomplete queries, and validate them before execution.

This is more than documentation. It's a contract. Your frontend code can be validated against the schema at build time. If someone removes a field from the CMS, your CI pipeline catches the breaking change before it hits production.

## When GraphQL Makes Sense for CMS

Not every project benefits from GraphQL. These are the scenarios where it genuinely pays off.

### Complex Content Relationships

If your content model has deep nesting — articles with authors who have profiles with social links, articles in categories that belong to sections, articles with related articles that have their own authors — GraphQL eliminates the cascade of REST requests needed to resolve these relationships.

### Mobile and Bandwidth-Sensitive Clients

Mobile apps on cellular connections benefit from precise data fetching. Requesting only the fields a screen needs reduces payload size and improves perceived performance. This was GraphQL's original use case, and it's still the strongest one.

### Micro-Frontends and Component-Driven Data

When different frontend teams own different components on the same page, each component can define its own GraphQL fragment specifying exactly the data it needs. Fragments compose cleanly:

```graphql
fragment ArticleCard on Article {
  title
  slug
  summary
  image { url alt }
}

fragment ArticleMeta on Article {
  author { name }
  category { label }
  created
}

query HomePage {
  featuredArticles: articles(promoted: true, limit: 5) {
    ...ArticleCard
    ...ArticleMeta
  }
}
```

Each team maintains its own fragment. The query composes them. No coordination needed over which fields the REST endpoint should return.

### Content Aggregation

If your frontend pulls content from multiple sources — a CMS, a product catalog, a user service — a GraphQL gateway can stitch these together into a single schema. One query, multiple backends.

## When REST Is Simpler

GraphQL introduces complexity that REST doesn't have. Be honest about whether your project needs it.

### Caching

REST caching is straightforward. Each resource has a URL. HTTP caches, CDNs, and browser caches all work with URLs natively. `GET /api/articles/42` is cached by every layer in the stack without configuration.

GraphQL sends all queries as `POST` requests to a single endpoint. HTTP caches don't cache `POST` requests. You need application-level caching (Apollo Client, urql), persisted queries, or a CDN that understands GraphQL. This is solvable, but it's extra work.

### Simple CRUD Operations

If your frontend mostly creates, reads, updates, and deletes individual resources, REST's verb-to-operation mapping is clearer:

```
POST   /api/articles     → Create
GET    /api/articles/42   → Read
PATCH  /api/articles/42   → Update
DELETE /api/articles/42   → Delete
```

GraphQL mutations work fine for this, but the REST pattern is more immediately readable and requires less boilerplate.

### Team Familiarity

If your team knows REST well and doesn't know GraphQL, the learning curve is a real cost. GraphQL has concepts (resolvers, fragments, variables, directives, schema stitching) that take time to internalize. For a project with a simple content model and a tight deadline, learning GraphQL in production is risky.

### Webhooks and External Integrations

Third-party services overwhelmingly expect REST. Webhook receivers, Zapier integrations, CI/CD pipelines, and serverless functions all work with HTTP methods and JSON payloads. Wiring these into a GraphQL API requires an additional translation layer.

## GraphQL CMS Options

Here's how the major headless CMS platforms handle GraphQL.

**Contentful** — Native GraphQL API alongside REST. The GraphQL API is a first-class citizen, well-documented, and supports the full Content Delivery API. No setup needed. Limited to read operations — mutations require the REST Management API.

**Sanity** — Primarily uses GROQ (their custom query language), which is similar to GraphQL in flexibility. GraphQL is available as a deployed API, but it's not the default path. If your team prefers standard GraphQL, you'll be working against the grain.

**Strapi** — GraphQL is available via the `@strapi/plugin-graphql` plugin. Install it, and Strapi auto-generates a GraphQL schema from your content types. Works well, but it's a plugin — not part of the core. GraphQL support can lag behind REST when new features ship.

**Payload** — Native GraphQL alongside REST. Both are generated from your collection and global configs. GraphQL is first-class, with full mutation support and access control integration.

**KeystoneJS** — GraphQL-first. KeystoneJS generates a complete GraphQL API from your schema definition. REST is not provided at all. If you want REST, you build it yourself. This is the purest GraphQL CMS option.

**drop.js** — Auto-generates GraphQL alongside REST and JSON:API from a single content type definition. Define the content model once in JSON, get all three API protocols. Includes a GraphQL Playground for interactive exploration.

## Practical Example: drop.js GraphQL

Here's the workflow: you define a content type, and the GraphQL API is generated automatically.

### Define a Content Type

```json
{
  "name": "project",
  "label": "Project",
  "fields": {
    "summary": { "type": "text_long" },
    "client": { "type": "string" },
    "launch_date": { "type": "datetime" },
    "technologies": { "type": "list_string" },
    "featured_image": { "type": "entity_reference", "target": "file" },
    "category": { "type": "entity_reference", "target": "taxonomy_term" }
  }
}
```

### Auto-Generated Query

The GraphQL Playground at `/graphql` lets you immediately query this content type:

```graphql
query {
  projects(limit: 10, sort: "-launch_date") {
    id
    title
    summary
    client
    launch_date
    technologies
    featured_image {
      url
      alt
    }
    category {
      label
      slug
    }
  }
}
```

### Auto-Generated Mutation

Creating content through GraphQL works the same way:

```graphql
mutation {
  createProject(input: {
    title: "New Portfolio Site"
    summary: "A complete redesign using Next.js and drop.js"
    client: "Acme Corp"
    launch_date: "2026-04-15T00:00:00Z"
    technologies: ["Next.js", "TypeScript", "drop.js"]
    category: "3"
  }) {
    id
    title
    slug
  }
}
```

No resolver code to write. No schema definition to maintain. The content model JSON is the single source of truth, and the GraphQL schema is derived from it. The Playground at `/graphql` provides autocomplete, documentation, and query history out of the box.

## GraphQL Gotchas

If you go the GraphQL route, be aware of these common issues.

### N+1 Queries

Naive GraphQL implementations hit the database once per field per item. A query for 50 articles with their authors can generate 50 separate author queries. The solution is a DataLoader pattern (batching and caching database calls), but you need to verify your CMS handles this correctly. Most mature CMS platforms (Payload, KeystoneJS, drop.js) implement DataLoader or equivalent batching internally.

### Query Complexity and Depth

Without limits, a client can send a deeply nested query that overwhelms your server:

```graphql
query {
  articles {
    author {
      articles {
        author {
          articles {
            # ...infinite nesting
          }
        }
      }
    }
  }
}
```

Production GraphQL APIs need query depth limits and complexity analysis. Check whether your CMS provides these out of the box or if you need to configure them.

### Caching Strategies

As mentioned above, GraphQL caching requires more thought than REST caching. The main approaches:

- **Client-side normalized caching** (Apollo Client, urql) — the client maintains a local cache keyed by type and ID. Works well for interactive apps.
- **Persisted queries** — the client sends a query hash instead of the full query string. The server maps hashes to pre-approved queries. This enables CDN caching and prevents arbitrary queries.
- **Response caching** — cache the full JSON response based on the query and variables. Simpler but less granular.

## Making the Decision

Choose GraphQL for your CMS if your project has complex relationships, bandwidth-sensitive clients, or component-driven frontends that benefit from precise data fetching.

Choose REST if your project has simple content models, needs strong HTTP caching, integrates heavily with third-party services, or your team is more productive with REST.

If you're unsure, pick a CMS that supports both. You can start with REST for simplicity and adopt GraphQL for specific use cases where it provides clear value. You don't have to make a binary choice — the protocols can coexist.
