JAMstack is an architecture pattern, not a specific technology. It stands for JavaScript, APIs, and Markup. The core idea: pre-render as much as possible, serve it from a CDN, and use APIs for dynamic functionality.

The term was coined by Netlify's CEO Mathieu Billeau around 2015, but the pattern existed before the branding. Static site generators like Jekyll and Hugo were doing this for years — generating HTML at build time and deploying it to static hosting.

## The Architecture

A JAMstack application has three layers.

**Markup** — Pre-rendered HTML, generated at build time by a static site generator or framework. This is the output that gets deployed to a CDN. It's not server-rendered on each request. It's built once and served as static files.

**JavaScript** — Client-side code that handles interactivity, dynamic content loading, and anything that can't be pre-rendered. This runs in the browser after the static page loads.

**APIs** — Server-side functionality accessed through HTTPS endpoints. Authentication, form submissions, payments, content fetching, search — anything that requires server logic is handled by third-party services or custom serverless functions.

The architecture looks like this:

```
[CDN] → serves pre-rendered HTML/CSS/JS
  ↕
[Browser JS] → fetches dynamic data from APIs
  ↕
[APIs] → headless CMS, auth service, payment gateway, serverless functions
```

The key distinction from traditional web architecture: there's no origin server generating HTML per request. The CDN is the server. Dynamic behavior happens client-side or through API calls.

## History: Static Sites to JAMstack

The evolution is worth understanding because it explains why JAMstack architecture makes the trade-offs it does.

**2008-2013: Static site generators.** Jekyll (2008), Hugo (2013), and others generated HTML from Markdown files at build time. Fast, secure, and cheap to host. But limited — no dynamic content without embedding third-party JavaScript widgets.

**2014-2017: The API layer.** Headless CMS platforms (Contentful, 2013; Prismic, 2013) provided content APIs. Now static sites could pull content from a CMS at build time. Netlify (2014) made deployment trivial. The "JAMstack" term emerged.

**2018-2020: Framework era.** Gatsby (React-based static site generator) proved you could build complex applications with this pattern. Next.js added static export alongside its server-rendering capabilities. Nuxt did the same for Vue. These frameworks blurred the line between static sites and dynamic applications.

**2021-present: Hybrid rendering.** Next.js introduced ISR (Incremental Static Regeneration), letting you revalidate static pages without full rebuilds. Astro shipped with partial hydration — only the interactive components load JavaScript. The architecture became more nuanced, mixing static generation with on-demand rendering.

## Benefits

JAMstack's advantages are architectural, not aspirational. They come directly from serving pre-rendered content from a CDN.

### Performance

Static HTML served from a CDN edge node is fast. There's no database query, no server-side rendering, no waiting for a PHP or Node.js process. The first byte arrives from the geographically nearest CDN node. Time to First Byte (TTFB) is typically under 50ms.

Compare this to a WordPress page: the request hits an origin server, PHP executes, MySQL queries run, HTML is generated, and the response travels back. Even with page caching, you're dealing with cache misses, origin round trips, and cache invalidation complexity.

### Security

No origin server means a dramatically reduced attack surface. There's no database to SQL-inject, no server process to exploit, no admin login page to brute-force. The "server" is a CDN serving static files.

Dynamic functionality happens through API calls to isolated services, each with its own security boundary. A vulnerability in your payment API doesn't compromise your content or authentication.

### Scalability

CDNs scale by design. Serving static files from edge nodes handles traffic spikes without any infrastructure changes. A site that gets 100 visitors or 100,000 visitors costs roughly the same to serve. There's no database connection pool to exhaust, no server CPU to max out.

### Developer Experience

JAMstack projects use modern frontend tooling: React, Vue, Svelte, TypeScript, component libraries, hot module replacement, and the npm ecosystem. Developers work in their preferred framework, deploy with `git push`, and get preview deployments for every pull request.

## The Headless CMS Connection

A JAMstack site needs content from somewhere. For anything beyond a personal blog, that content source is usually a headless CMS.

The CMS stores and manages structured content. The frontend framework fetches it through the CMS API. This fetch happens in one of three ways:

### Static Site Generation (SSG)

Content is fetched at build time. The framework calls the CMS API during the build process, retrieves all content, and generates static HTML pages.

```javascript
// Next.js getStaticProps — runs at build time
export async function getStaticProps() {
  const res = await fetch('https://your-cms.com/api/articles');
  const articles = await res.json();

  return {
    props: { articles }
  };
}
```

The result is purely static HTML. Fast, cacheable, and the CMS doesn't need to be running when visitors access the site. The trade-off: content changes require a rebuild.

### Incremental Static Regeneration (ISR)

A hybrid approach introduced by Next.js. Pages are statically generated but revalidate after a configurable interval.

```javascript
export async function getStaticProps() {
  const res = await fetch('https://your-cms.com/api/articles');
  const articles = await res.json();

  return {
    props: { articles },
    revalidate: 60 // Regenerate this page every 60 seconds
  };
}
```

The first request after the revalidation window triggers a background rebuild of that specific page. Users always see a cached version — never a loading state. This eliminates full-site rebuilds for content changes.

### Server-Side Rendering (SSR)

Content is fetched on every request. The page is generated server-side and sent to the client. This is technically not "pure" JAMstack (there's an origin server generating HTML), but modern frameworks like Next.js and Nuxt blend SSR and SSG freely.

```javascript
// Next.js getServerSideProps — runs on every request
export async function getServerSideProps() {
  const res = await fetch('https://your-cms.com/api/articles');
  const articles = await res.json();

  return {
    props: { articles }
  };
}
```

Use SSR for pages that need real-time content or personalization. Use SSG/ISR for everything else.

## Webhooks: Triggering Rebuilds

The missing piece in a JAMstack + CMS setup is: how does the frontend know when content changes?

Webhooks. When content is created, updated, or deleted in the CMS, the CMS sends an HTTP POST to a configured URL. That URL triggers a rebuild or revalidation on your hosting platform.

```
[Editor saves article in CMS]
    → CMS fires webhook POST to https://your-site.com/api/revalidate
    → Hosting platform rebuilds affected pages
    → CDN serves updated content
```

Webhook reliability matters. If the webhook fails silently, your site shows stale content. Look for webhook features like retry logic, delivery logs, and payload signing (HMAC) to verify the webhook actually came from your CMS.

## JAMstack CMS Options

The headless CMS market is crowded. Here's how the major options compare specifically for JAMstack use cases.

**Contentful** — The enterprise default. Excellent CDN-backed Content Delivery API. Webhooks with retry. Rich content modeling. The downside: pricing scales with API calls and content volume, which can spike for sites with frequent rebuilds.

**Sanity** — Real-time content lake with GROQ query language. Strong webhook support. The editing experience (Sanity Studio) is highly customizable. Unique real-time preview capabilities. Pricing is based on API CDN bandwidth and dataset size.

**Strapi** — Open-source, self-hosted. Webhooks built in. REST and GraphQL APIs. You control the infrastructure, which means predictable costs but you own the ops burden. The v5 release improved webhook reliability significantly.

**drop.js** — Open-source Node.js CMS with 220+ auto-generated API endpoints (REST, GraphQL, JSON:API). Webhooks with HMAC signing for payload verification. Content types defined in JSON config. Install with `npx create-drop-app my-site`. Self-hosted, so API response times depend on your infrastructure rather than a shared SaaS CDN.

### Webhook Comparison

| Feature | Contentful | Sanity | Strapi | drop.js |
|---------|-----------|--------|--------|---------|
| Webhook support | Yes | Yes | Yes | Yes |
| HMAC signing | Yes | Yes | No (manual) | Yes |
| Retry on failure | Yes | Yes | No | Yes |
| Delivery logs | Yes | Yes | Limited | Yes |
| Custom headers | Yes | Yes | Yes | Yes |

## Practical Example: drop.js + Next.js

Here's a concrete setup: drop.js as the headless CMS, Next.js as the frontend framework, deployed to Vercel.

### Content Model (drop.js)

```json
{
  "name": "blog_post",
  "label": "Blog Post",
  "fields": {
    "summary": { "type": "text_long" },
    "body": { "type": "text_rich" },
    "featured_image": { "type": "entity_reference", "target": "file" },
    "tags": { "type": "entity_reference", "target": "taxonomy_term", "cardinality": -1 }
  }
}
```

### Fetch Content at Build Time (Next.js)

```javascript
// app/blog/page.tsx
async function getBlogPosts() {
  const res = await fetch('https://cms.example.com/api/blog-posts?sort=-created', {
    next: { revalidate: 60 }
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      {posts.data.map(post => (
        <article key={post.id}>
          <h2>{post.attributes.title}</h2>
          <p>{post.attributes.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

### Webhook Revalidation Endpoint (Next.js API Route)

```javascript
// app/api/revalidate/route.ts
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature');

  // Verify HMAC signature from drop.js
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (signature !== expected) {
    return new Response('Invalid signature', { status: 401 });
  }

  const payload = JSON.parse(body);

  // Revalidate the affected paths
  revalidatePath('/blog');
  revalidatePath(`/blog/${payload.data.attributes.slug}`);

  return Response.json({ revalidated: true });
}
```

When an editor publishes a blog post in drop.js, the webhook fires, the Next.js API route verifies the HMAC signature, and the affected pages are revalidated. The CDN serves the updated content within seconds.

## When JAMstack Is NOT the Right Choice

JAMstack has real trade-offs. Don't force it where it doesn't fit.

**Highly dynamic sites.** If every page is personalized per user (dashboards, social feeds, real-time collaboration tools), pre-rendering doesn't help. You're server-rendering everything anyway. Use a traditional server-rendered framework.

**Very large sites with frequent updates.** A site with 500,000 pages where content changes every minute will struggle with build times and rebuild queues. ISR helps, but at extreme scale you're essentially doing SSR with extra steps.

**Complex server-side logic.** If your application needs database transactions, real-time websockets, background job processing, or complex authorization logic, the serverless function model becomes unwieldy. A monolithic server application may be simpler.

**Content preview requirements.** Editors who need live, instant preview of draft content in the actual frontend context will find JAMstack previews more complex to set up than a traditional CMS where the preview is built into the rendering layer.

## Making the Decision

JAMstack is a good default for content-driven websites that need performance, security, and scalability. Marketing sites, blogs, documentation sites, e-commerce storefronts, and portfolio sites all map naturally to this architecture.

The choice of headless CMS matters less than the choice of architecture. Pick a CMS with reliable APIs, solid webhook support, and a content modeling approach that fits your mental model. Then pair it with the frontend framework your team knows best. The architecture handles the rest.
