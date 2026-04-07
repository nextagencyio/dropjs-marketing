---
title: "What Is an API-First CMS? (And Why It Matters)"
excerpt: "API-first means your content is available everywhere. Here is what that looks like in practice."
category: "Concepts"
readTime: "8 min read"
date: "April 2026"
---

The term "API-first" gets thrown around a lot in CMS marketing. Most of the time it's used incorrectly. There's a meaningful distinction between a CMS that happens to have an API and one that was designed around the API from day one.

Understanding this distinction matters when you're choosing infrastructure for a project that needs to serve content to more than one consumer.

## What API-First Actually Means

In an API-first architecture, the API is the primary interface to the system. Everything else — the admin UI, the CLI, third-party integrations — is a client of that API. The API isn't a feature. It's the foundation.

This has a practical consequence: every capability the system offers is available through the API. If you can do it in the admin panel, you can do it programmatically. There's no hidden functionality locked behind a GUI.

Compare this to a traditional CMS like WordPress. WordPress was built to render web pages. The REST API was added in version 4.7 (December 2016), years after the core architecture was established. The API is useful, but it's a secondary interface layered on top of a system designed for server-side rendering.

## API-First vs. API-Enabled

This distinction matters in practice, not just in theory.

**API-enabled** means the system has an API, but the API wasn't the design priority. WordPress, Drupal (before its JSON:API core module), and most traditional CMS platforms fall here. The API often lags behind the admin UI in functionality. Some operations aren't exposed. Some require workarounds.

**API-first** means the API was designed before (or simultaneously with) the admin UI. Contentful, Sanity, Strapi, Payload, and drop.js are examples. The admin panel itself typically consumes the same API that external clients use.

Here's how you can tell the difference:

- Can you create content types through the API, or only through the admin panel?
- Does the API support every field type and relationship the system offers?
- Are webhooks, bulk operations, and file uploads all API-accessible?
- Is the API documented automatically, or is documentation a manual afterthought?

If the answer to any of these is "no," the CMS is API-enabled, not API-first.

## The Three API Formats

Most API-first CMS platforms support one API protocol. Some support two. The three main formats you'll encounter are REST, GraphQL, and JSON:API. Each has trade-offs.

### REST

REST (Representational State Transfer) maps HTTP verbs to CRUD operations on resources. Each content type gets its own URL namespace.

```bash
GET    /api/articles          # List articles
GET    /api/articles/42       # Get one article
POST   /api/articles          # Create article
PATCH  /api/articles/42       # Update article
DELETE /api/articles/42       # Delete article
```

REST is the simplest mental model. It maps cleanly to database operations, and HTTP caching works out of the box because each resource has a stable URL. The downside is over-fetching (you get every field even if you only need `title` and `slug`) and under-fetching (related data often requires additional requests).

### GraphQL

GraphQL is a query language that lets the client specify exactly which fields it needs. One endpoint, flexible queries.

```graphql
query {
  article(id: 42) {
    title
    slug
    author {
      name
    }
    category {
      label
    }
  }
}
```

This solves the over-fetching and under-fetching problems simultaneously. You get exactly the data shape your component needs in a single request. The trade-off is that caching is harder (all queries hit the same endpoint), and the server needs to handle arbitrary query complexity.

### JSON:API

JSON:API is a specification for building REST APIs with standardized conventions for relationships, pagination, filtering, sparse fieldsets, and includes. It's REST, but with strict rules.

```bash
GET /jsonapi/article/42?include=author,category&fields[article]=title,slug
```

```json
{
  "data": {
    "type": "article",
    "id": "42",
    "attributes": {
      "title": "API-First Architecture",
      "slug": "api-first-architecture"
    },
    "relationships": {
      "author": {
        "data": { "type": "user", "id": "7" }
      },
      "category": {
        "data": { "type": "taxonomy_term", "id": "3" }
      }
    }
  },
  "included": [
    {
      "type": "user",
      "id": "7",
      "attributes": { "name": "Jay Callicott" }
    },
    {
      "type": "taxonomy_term",
      "id": "3",
      "attributes": { "label": "Architecture" }
    }
  ]
}
```

JSON:API gives you the cacheability of REST with the relationship-handling power closer to GraphQL. The `include` parameter lets you sideload related data in a single request. The `fields` parameter lets you request only specific attributes. The spec is verbose, but it eliminates the "every API is a snowflake" problem.

## Same Content, Three Ways

An API-first CMS that supports all three protocols lets you choose the right tool for each use case. Here's the same article fetched from a drop.js instance three different ways.

**REST:**

```bash
curl https://example.com/api/articles/api-first-architecture
```

**GraphQL:**

```graphql
# POST https://example.com/graphql
query {
  article(slug: "api-first-architecture") {
    title
    body
    author { name }
    category { label }
  }
}
```

**JSON:API:**

```bash
curl "https://example.com/jsonapi/article?filter[slug]=api-first-architecture&include=author,category"
```

Same content, same CMS, three different protocols. Your Next.js frontend might use GraphQL for its component-driven data fetching. Your mobile app might use REST for simplicity and caching. A third-party integration might use JSON:API because it follows a published standard. None of them conflict.

Here's what the REST response for that article looks like:

```json
{
  "data": {
    "type": "article",
    "id": "15",
    "attributes": {
      "title": "API-First Architecture",
      "slug": "api-first-architecture",
      "body": "<p>Content here...</p>",
      "status": true,
      "created": "2026-03-20T09:00:00Z"
    },
    "relationships": {
      "author": {
        "data": { "type": "user", "id": "7" }
      },
      "category": {
        "data": { "type": "taxonomy_term", "id": "2" }
      }
    }
  }
}
```

And the same content via GraphQL returns only the fields you asked for — no extra attributes, no relationship stubs you don't need. The response shape matches your query exactly. This means your frontend components can define their own data requirements without over-fetching from a fixed REST schema.

## Auto-Generated API Documentation

One underappreciated benefit of API-first architecture is automated documentation. When the API is the source of truth, the system can introspect its own endpoints and generate accurate, up-to-date docs.

drop.js generates an OpenAPI/Swagger specification at `/api/docs` automatically. Every content type you define, every field, every relationship — all documented with request/response schemas, parameter descriptions, and example payloads. No manual documentation maintenance.

```bash
# OpenAPI spec (machine-readable)
curl https://example.com/api/docs/json

# Swagger UI (human-readable)
# Visit https://example.com/api/docs in your browser
```

This isn't a nice-to-have. For teams consuming the API, auto-generated docs that stay in sync with the actual implementation eliminate an entire class of bugs caused by stale documentation.

## When API-First Matters

API-first architecture solves specific problems. If your project has any of these characteristics, API-first is likely the right call.

**Multiple consumers.** A website, a mobile app, a digital kiosk, a chatbot — all consuming the same content. API-first means one content source, many outputs. You manage content once.

**Decoupled frontend.** Your team builds with React, Vue, Svelte, Next.js, Nuxt, or Astro. The CMS provides data. The frontend owns rendering. Clean separation of concerns.

**Third-party integrations.** Other systems need to read or write content programmatically. A marketing automation tool pushes content. A search service indexes it. A translation service pulls it for localization. All through the API.

**AI and automation.** LLM-powered features, content generation pipelines, and automated workflows all require programmatic access to content. An API-first CMS is already structured for this.

**IoT and edge.** Content delivered to devices, embedded systems, or edge functions. These consumers can't render HTML — they need raw JSON data from an API.

**Batch operations and content pipelines.** If you need to programmatically create, update, or migrate content in bulk — importing from a legacy system, syncing with a PIM, or running automated content transformations — the API is your entry point. An API-first CMS exposes batch endpoints that make this straightforward. An API-enabled CMS often forces you to work around limitations in endpoints that were designed for one-at-a-time admin UI operations.

## When API-First Does Not Matter

Not every project needs this level of architecture.

**Simple blogs.** A personal blog or small marketing site with one output (a website) doesn't benefit much from API-first. WordPress with a theme is simpler, faster to launch, and cheaper to maintain.

**Content-only sites with no integrations.** If your content goes to one website and nowhere else, the decoupling that API-first provides is overhead without benefit.

**Teams without frontend developers.** API-first CMS requires someone to build the consuming application. If your team is a content editor and a designer using a page builder, a traditional CMS is more productive.

**Tight deadlines with simple requirements.** API-first adds architectural decisions (which protocol, how to host the frontend, how to handle preview) that a traditional CMS answers out of the box. If you need to launch next week and the requirements are straightforward, don't over-engineer it.

## Choosing an API-First CMS

If you've decided API-first is the right approach, the main decision is hosted vs. self-hosted.

**Hosted (SaaS):** Contentful, Sanity, Hygraph. No infrastructure to manage. The trade-off is vendor lock-in, usage-based pricing that can spike, and less control over the API layer.

**Self-hosted (open source):** Strapi, Payload, KeystoneJS, drop.js. You own the infrastructure and data. The trade-off is that you manage hosting, updates, and scaling.

Within the self-hosted category, the differentiator is often API coverage. Strapi and Payload provide REST and GraphQL. KeystoneJS is GraphQL-only. drop.js generates REST, GraphQL, and JSON:API from a single content model — 220+ endpoints from one JSON configuration file.

The right choice depends on your team's expertise, your infrastructure preferences, and which API protocols your consumers need. The important thing is making a deliberate choice between API-first and API-enabled. They're not the same thing, and the difference shows up the moment you try to build something the original developers didn't anticipate.
