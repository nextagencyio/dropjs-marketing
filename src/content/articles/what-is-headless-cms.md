A headless CMS is a content management system that has no opinion about how your content gets displayed. It stores and manages content, exposes it through APIs, and gets out of the way. You build the frontend however you want.

If you've worked with WordPress or Drupal, you know the traditional model: the CMS handles everything from content storage to HTML rendering. A headless CMS deliberately breaks that coupling.

## How Traditional CMS Works

In a traditional (or "monolithic") CMS, the backend and frontend are a single application. WordPress stores your content in MySQL and renders it using PHP templates. Drupal does roughly the same thing with its theme layer. The CMS owns the entire request lifecycle.

This works well for many use cases. But the moment you need to serve that same content to a mobile app, a kiosk, a smartwatch, or a different frontend framework, you're fighting the architecture.

The traditional model assumes one output: a server-rendered HTML page. Everything else becomes a workaround.

## How a Headless CMS Works

A headless CMS strips away the frontend rendering layer entirely. What remains is:

- A **content repository** with structured data modeling
- An **admin interface** for creating and managing content
- **API endpoints** that deliver content as raw data (JSON, typically)

The "head" in this metaphor is the presentation layer. Removing it means your content is decoupled from any specific rendering technology. A React app, a Swift iOS app, a Vue storefront, and a static site generator can all consume the same content from the same API.

### The API Layer

The API is what makes headless work. Most headless CMS platforms expose content through one or more API protocols:

**REST API** — The most common approach. Each content type gets its own endpoint. You fetch articles from `/api/articles`, users from `/api/users`, and so on. Predictable, well-understood, easy to cache.

**GraphQL** — A query language that lets the client specify exactly which fields it needs. No over-fetching, no under-fetching. Popular with frontend developers who want precise control over payloads.

**JSON:API** — A specification for building REST APIs in JSON. It standardizes how relationships, pagination, filtering, and sparse fieldsets work. Less common but powerful when you need relationship-heavy data.

Here's what a typical headless CMS API response looks like. This example fetches an article from a REST endpoint:

```bash
curl https://your-site.com/api/articles/getting-started
```

```json
{
  "data": {
    "type": "article",
    "id": "42",
    "attributes": {
      "title": "Getting Started with Headless CMS",
      "slug": "getting-started",
      "body": "<p>This is the article content...</p>",
      "status": true,
      "created": "2026-03-15T10:30:00Z",
      "changed": "2026-03-20T14:22:00Z"
    },
    "relationships": {
      "author": {
        "data": { "type": "user", "id": "7" }
      },
      "category": {
        "data": { "type": "taxonomy_term", "id": "3" }
      },
      "image": {
        "data": { "type": "file", "id": "158" }
      }
    }
  }
}
```

The frontend receives structured data. It decides how to render it. The CMS doesn't care whether that data ends up in a React component, a mobile app screen, or an email template.

## Content Modeling

One of the most important concepts in any headless CMS is **content modeling** — defining the structure of your content before you create it.

Instead of a blank text editor (like a traditional WordPress post), a headless CMS lets you define **content types** with specific **fields**. An `article` content type might have:

- A `title` field (text, required)
- A `body` field (rich text)
- A `featured_image` field (image reference)
- A `category` field (taxonomy reference)
- A `published_date` field (datetime)
- A `meta_description` field (text, max 160 characters)

This structured approach matters because APIs need predictable data shapes. Your frontend code knows that every article will have these fields. No surprises, no defensive null-checking on fields that might or might not exist.

Some platforms let you define content types through a visual UI. Others use configuration files. For example, in drop.js you define content types in JSON:

```json
{
  "name": "article",
  "label": "Article",
  "fields": {
    "body": { "type": "text_long", "required": true },
    "image": { "type": "entity_reference", "target": "file" },
    "category": { "type": "entity_reference", "target": "taxonomy_term" }
  }
}
```

That JSON definition generates REST, GraphQL, and JSON:API endpoints automatically — no extra code required.

### Field Types

Most headless CMS platforms support a common set of field types:

- **Text** — plain text, rich text, formatted HTML
- **Number** — integer, decimal, float
- **Boolean** — true/false toggles
- **Date/time** — timestamps, date ranges
- **Media** — images, files, videos
- **Reference** — relationships to other content (articles referencing authors, products referencing categories)
- **JSON** — arbitrary structured data
- **Geolocation** — latitude/longitude coordinates

References are particularly important. They let you model relationships: an article has an author, a product belongs to a category, a page contains a list of components. These relationships get serialized in the API response so your frontend can resolve them.

## When Headless Makes Sense

Headless CMS isn't universally better. It solves specific problems.

### Multi-Channel Delivery

If you need the same content on a website, a mobile app, a digital signage system, and an email newsletter, headless is the clear choice. You manage content once and distribute it everywhere through APIs.

Traditional CMS platforms can bolt on REST APIs (WordPress has its REST API, Drupal has JSON:API), but the content model was designed for web pages first. The API is an afterthought, and it shows.

### JavaScript Frontend Frameworks

If your team builds with React, Vue, Svelte, Next.js, Nuxt, or Astro, a headless CMS fits naturally. Your frontend fetches data from the API and renders it using components. There's no server-side template language to learn, no theme system to fight.

### JAMstack / Static Sites

Static site generators like Astro, Next.js (static export), or Eleventy pull content from APIs at build time and generate static HTML. Fast, secure, cheap to host. Headless CMS is the standard content source for this architecture.

### Microservices Architecture

If your application is already decomposed into services, a headless CMS becomes just another service. It handles content. Other services handle authentication, payments, search, etc. Everything communicates through APIs.

### Teams with Frontend Expertise

If your developers are primarily frontend/JavaScript engineers, a headless CMS with a React or Vue admin panel will feel more natural than learning PHP templates in WordPress or Twig in Drupal.

## When Traditional CMS Is Fine

Don't overcomplicate things. A traditional CMS is perfectly good when:

**You're building a simple website.** A marketing site with 10 pages, a blog, and a contact form doesn't need API-driven architecture. WordPress or a similar traditional CMS will get you live faster.

**Your editors need visual page building.** Traditional CMS platforms excel at WYSIWYG editing and visual preview. In a headless setup, content editors type into form fields and can't easily see how the page will look. Some headless platforms are adding preview capabilities, but it's still harder than a traditional CMS.

**You don't have a dedicated frontend team.** Headless CMS requires someone to build and maintain the frontend. If your team is content editors and a single developer who's comfortable with WordPress themes, going headless adds complexity without clear benefit.

**Your timeline is tight.** Traditional CMS platforms come with themes. Pick one, customize it, launch. Headless requires building the frontend from scratch (or using a starter template). That takes more time.

## The Major Headless CMS Options

The ecosystem has matured significantly. Here are the broad categories:

### SaaS (Hosted)

- **Contentful** — The enterprise standard. Generous content model, strong CDN, high price at scale.
- **Sanity** — Developer-friendly, real-time collaboration, customizable editing studio. Content Lake architecture is unique.
- **Hygraph** (formerly GraphCMS) — GraphQL-native. Good for teams already committed to GraphQL.

SaaS platforms handle hosting, scaling, and maintenance. The trade-off is vendor lock-in and pricing that scales with usage.

### Open Source (Self-Hosted)

- **Strapi** — The most popular open-source headless CMS. Visual content type builder, plugin ecosystem.
- **Payload** — TypeScript-first, config-as-code approach. Excellent developer experience.
- **drop.js** — Drupal's entity/field architecture implemented natively in Node.js. Single npm package, 220+ REST endpoints out of the box.
- **Directus** — Wraps any existing SQL database with an instant API. Good for brownfield projects.
- **KeystoneJS** — Prisma-based, GraphQL-first. Clean API design.

Open source means you own your data and infrastructure. The trade-off is that you manage hosting, updates, and scaling yourself.

## Making the Decision

Ask yourself these questions:

1. **How many output channels do I need?** If it's just a website, traditional CMS might be simpler. If it's website + mobile app + anything else, go headless.
2. **What's my team's skill set?** Frontend-heavy teams thrive with headless. Generalist or content-focused teams may prefer traditional.
3. **Do I need visual editing?** If content editors need WYSIWYG drag-and-drop, traditional CMS still has an edge here.
4. **What's my content model complexity?** Simple blog posts? Either works. Complex structured content with relationships across dozens of types? Headless platforms typically handle this better.
5. **What's my budget for infrastructure?** Self-hosted headless CMS needs a server. SaaS headless CMS has monthly fees. Traditional CMS on shared hosting is the cheapest option.

There's no universally correct answer. Headless CMS solves real architectural problems, but it also introduces complexity that not every project needs. Pick the tool that matches your actual requirements, not the one that sounds most modern.
