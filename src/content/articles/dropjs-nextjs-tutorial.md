This tutorial walks through building a blog with drop.js as the headless CMS backend and Next.js as the frontend. By the end, you will have a working content API serving blog posts to a Next.js App Router application.

No shortcuts or pseudocode. Every command and code block is complete and runnable.

## Prerequisites

You need:

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn**
- Basic familiarity with Next.js and React
- A terminal and a code editor

No API keys required. drop.js runs locally with SQLite by default.

## Step 1: Set Up the drop.js Backend

Create a new drop.js project and start the dev server:

```bash
npx create-drop-app my-cms
cd my-cms
npx drop dev
```

You should see output confirming the server is running:

```
  drop.js dev server running:

  Server:   http://localhost:3000
  Admin:    http://localhost:3000/admin
  API:      http://localhost:3000/api
  Swagger:  http://localhost:3000/api/docs
```

Open `http://localhost:3000/admin` in your browser. This is the admin interface where you will create content types and add content. Create an admin account when prompted.

## Step 2: Create a Blog Post Content Type

You can create content types through the admin UI or by editing JSON configuration files. We will use the JSON approach because it is reproducible and version-controllable.

Create a file at `content-types/article.json` in your drop.js project:

```json
{
  "type": "article",
  "label": "Article",
  "description": "Blog post with body text, featured image, and tags",
  "fields": {
    "body": {
      "type": "text_long",
      "label": "Body",
      "required": true,
      "description": "The main article content"
    },
    "field_image": {
      "type": "image",
      "label": "Featured Image",
      "description": "Hero image displayed at the top of the article"
    },
    "field_tags": {
      "type": "entity_reference",
      "label": "Tags",
      "target_type": "taxonomy_term",
      "target_bundle": "tags",
      "cardinality": -1,
      "description": "Categorize this article with tags"
    },
    "field_summary": {
      "type": "string",
      "label": "Summary",
      "max_length": 300,
      "description": "Short description for listing pages and SEO"
    }
  }
}
```

Every content type in drop.js automatically gets a `title` field, a `status` field (published/unpublished), `created` and `changed` timestamps, and an `author` reference. You only define the custom fields.

The `field_tags` field uses `entity_reference` to point at taxonomy terms. The `cardinality: -1` means unlimited values (an article can have many tags).

Restart the dev server to pick up the new content type:

```bash
npx drop dev
```

## Step 3: Create a Taxonomy Vocabulary for Tags

Before adding tags to articles, you need a taxonomy vocabulary. Create `content-types/taxonomy/tags.json`:

```json
{
  "vocabulary": "tags",
  "label": "Tags",
  "description": "Article categorization tags"
}
```

After restarting, navigate to the admin UI at `http://localhost:3000/admin/taxonomy/tags` and add a few terms: "JavaScript", "TypeScript", "Next.js", "Tutorial".

## Step 4: Add Sample Content

Go to `http://localhost:3000/admin/content/add/article` and create two or three sample articles. Fill in the title, body, summary, upload a featured image, and select some tags.

Alternatively, use the REST API directly:

```bash
curl -X POST http://localhost:3000/api/node/article \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "type": "node--article",
      "attributes": {
        "title": "Getting Started with drop.js",
        "body": {
          "value": "<p>drop.js brings Drupal architecture to Node.js...</p>",
          "format": "basic_html"
        },
        "field_summary": "A quick introduction to building content APIs with drop.js",
        "status": true
      }
    }
  }'
```

Create at least two articles so you have data to work with on the list page.

You can verify your content is available by visiting `http://localhost:3000/api/node/article` in your browser. You should see a JSON response with your articles.

## Step 5: Explore the API

Before building the frontend, take a minute to understand the API. Open `http://localhost:3000/api/docs` in your browser. This is the auto-generated Swagger documentation for every endpoint in your drop.js instance.

Key endpoints for our blog:

| Endpoint | Description |
|----------|-------------|
| `GET /api/node/article` | List all articles |
| `GET /api/node/article/:id` | Get a single article |
| `GET /api/taxonomy_term/tags` | List all tags |
| `GET /graphql` | GraphQL endpoint |

The REST API follows the JSON:API specification. Responses include a `data` array (or object for single resources), and relationships are returned as references that you can include using the `?include=` parameter.

Try it:

```bash
# Get articles with their tags included
curl http://localhost:3000/api/node/article?include=field_tags

# Filter by published status
curl http://localhost:3000/api/node/article?filter[status]=1

# Sort by newest first
curl http://localhost:3000/api/node/article?sort=-created
```

## Step 6: Create the Next.js Frontend

Open a new terminal (keep drop.js running on port 3000). Create a Next.js project:

```bash
npx create-next-app@latest my-frontend --typescript --app --tailwind --src-dir
cd my-frontend
```

Add an environment variable for the drop.js API URL. Create `.env.local`:

```
DROPJS_URL=http://localhost:3000
```

### Create an API Helper

Create a utility function for fetching from drop.js. This keeps your components clean and gives you one place to handle errors.

```typescript
// src/lib/dropjs.ts

const DROPJS_URL = process.env.DROPJS_URL || 'http://localhost:3000';

export async function fetchFromDropJS(
  endpoint: string,
  options?: { revalidate?: number }
) {
  const res = await fetch(`${DROPJS_URL}${endpoint}`, {
    next: { revalidate: options?.revalidate ?? 60 },
  });

  if (!res.ok) {
    throw new Error(`drop.js API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export interface Article {
  id: string;
  attributes: {
    title: string;
    body: {
      value: string;
      summary?: string;
    };
    field_summary: string;
    created: string;
    changed: string;
    status: boolean;
  };
  relationships?: {
    field_tags?: {
      data: Array<{ id: string; type: string }>;
    };
    field_image?: {
      data: { id: string; type: string } | null;
    };
  };
}

export interface ApiResponse<T> {
  data: T[];
  included?: any[];
  meta?: {
    count: number;
  };
}
```

## Step 7: Build the Article List Page

Replace the contents of `src/app/page.tsx` with an article list:

```typescript
// src/app/page.tsx
import Link from 'next/link';
import { fetchFromDropJS, Article, ApiResponse } from '@/lib/dropjs';

export default async function HomePage() {
  const response: ApiResponse<Article> = await fetchFromDropJS(
    '/api/node/article?sort=-created&filter[status]=1'
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {response.data.map((article) => (
          <article key={article.id} className="border-b pb-6">
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-2xl font-semibold hover:text-blue-600">
                {article.attributes.title}
              </h2>
            </Link>
            <time className="text-sm text-gray-500">
              {new Date(article.attributes.created).toLocaleDateString()}
            </time>
            {article.attributes.field_summary && (
              <p className="mt-2 text-gray-700">
                {article.attributes.field_summary}
              </p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
```

This is a server component. The `fetch()` call runs on the server at build time (or on each request in dev mode). The `revalidate: 60` option in our helper tells Next.js to regenerate this page at most every 60 seconds.

## Step 8: Build the Individual Article Page

Create a dynamic route for individual articles:

```typescript
// src/app/articles/[id]/page.tsx
import { fetchFromDropJS, Article } from '@/lib/dropjs';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;

  let article: Article;
  try {
    const response = await fetchFromDropJS(
      `/api/node/article/${id}?include=field_tags`
    );
    article = response.data;
  } catch {
    notFound();
  }

  // Extract included tag data if present
  const tags: string[] = [];
  if (article.relationships?.field_tags?.data) {
    // In a full implementation, you would resolve these from the
    // `included` array in the JSON:API response
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article>
        <h1 className="text-4xl font-bold mb-4">
          {article.attributes.title}
        </h1>
        <time className="text-sm text-gray-500 block mb-8">
          {new Date(article.attributes.created).toLocaleDateString()}
        </time>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: article.attributes.body.value,
          }}
        />
      </article>
    </main>
  );
}

// Generate static paths for all articles at build time
export async function generateStaticParams() {
  const response = await fetchFromDropJS('/api/node/article');
  return response.data.map((article: Article) => ({
    id: article.id,
  }));
}
```

The `generateStaticParams` function tells Next.js to pre-render pages for every existing article at build time. New articles get generated on-demand thanks to the revalidation setting in our fetch helper.

## Step 9: Start the Frontend

```bash
npm run dev
```

Your Next.js frontend should now be running at `http://localhost:3001` (or whatever port Next.js assigns). Open it in your browser and you should see your article list. Clicking an article title takes you to the full article page.

If you see a connection error, make sure drop.js is still running on port 3000 in the other terminal.

## Step 10: The GraphQL Alternative

drop.js also exposes a GraphQL endpoint. If you prefer GraphQL over JSON:API, here is how the same list page looks:

```typescript
// src/lib/dropjs-graphql.ts
const DROPJS_URL = process.env.DROPJS_URL || 'http://localhost:3000';

export async function queryDropJS<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(`${DROPJS_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
```

```typescript
// src/app/page.tsx (GraphQL version)
import Link from 'next/link';
import { queryDropJS } from '@/lib/dropjs-graphql';

interface ArticlesData {
  nodeArticles: Array<{
    id: string;
    title: string;
    created: string;
    fieldSummary: string;
    body: {
      value: string;
      summary: string;
    };
  }>;
}

const ARTICLES_QUERY = `
  query {
    nodeArticles(
      sort: { field: "created", direction: DESC }
      filter: { status: true }
    ) {
      id
      title
      created
      fieldSummary
      body {
        value
        summary
      }
    }
  }
`;

export default async function HomePage() {
  const data = await queryDropJS<ArticlesData>(ARTICLES_QUERY);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {data.nodeArticles.map((article) => (
          <article key={article.id} className="border-b pb-6">
            <Link href={`/articles/${article.id}`}>
              <h2 className="text-2xl font-semibold hover:text-blue-600">
                {article.title}
              </h2>
            </Link>
            <time className="text-sm text-gray-500">
              {new Date(article.created).toLocaleDateString()}
            </time>
            {article.fieldSummary && (
              <p className="mt-2 text-gray-700">{article.fieldSummary}</p>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
```

The GraphQL approach has a key advantage: you get exactly the fields you ask for. No over-fetching. The JSON:API approach has its own advantage: the `?include=` parameter lets you side-load related entities in a single request without defining a custom query.

Use whichever fits your team's preferences. Both are first-class citizens in drop.js.

## Deployment

In production, drop.js and Next.js run as separate services. Here is the general approach:

### Deploy drop.js

drop.js is a Node.js application. Deploy it anywhere you run Node: a VPS, AWS EC2, Railway, Render, Fly.io, or a Docker container. Set the `PORT` environment variable if you need a specific port.

```bash
# On your server
npx create-drop-app my-cms
cd my-cms
npx drop start
```

For production, you probably want a process manager like PM2 and a reverse proxy like Nginx or Caddy in front of it. If you use a PaaS like Railway or Render, they handle that for you.

### Deploy Next.js

Deploy Next.js to Vercel, Netlify, or any Node.js host. The only configuration change is the API URL environment variable:

```
DROPJS_URL=https://your-cms.example.com
```

Set this in your hosting provider's environment variables dashboard. Every `fetch()` call in your Next.js app uses this variable through the helper function we created.

### CORS

If your Next.js frontend makes client-side requests to drop.js (for dynamic features like search or form submissions), configure CORS on the drop.js server. For server-side rendering and static generation, CORS is not needed because the requests come from your Next.js server, not from the browser.

### Webhooks for Revalidation

For near-instant content updates, configure a webhook in drop.js that calls Next.js's on-demand revalidation API when content changes:

1. In drop.js, set up a webhook that fires on content create/update/delete
2. Point it at your Next.js revalidation endpoint: `https://your-frontend.example.com/api/revalidate?secret=YOUR_SECRET`
3. In Next.js, create an API route that calls `revalidatePath()` or `revalidateTag()`

This gives you the best of both worlds: statically generated pages for performance, with instant updates when editors publish new content.

## Next Steps

This tutorial covers the fundamentals. Here are some things to explore next:

- **Image optimization**: Use Next.js `<Image>` with the drop.js image URLs for automatic resizing and format conversion
- **Preview mode**: Set up Next.js Draft Mode to preview unpublished content from drop.js
- **Search**: Use drop.js's full-text search API to build a search page
- **Pagination**: The JSON:API response includes pagination links. Use them to build paginated list pages.
- **Authentication**: If you need authenticated content (member-only articles), pass auth tokens from Next.js to the drop.js API

The complete code from this tutorial is intentionally minimal. In a production app, you would add error boundaries, loading states, and more robust type definitions. But the data-fetching pattern stays the same: call the drop.js API from Next.js server components, render the response.
