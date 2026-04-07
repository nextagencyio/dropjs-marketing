If you're evaluating headless CMS options for your next project, you've probably already looked at Strapi. It's the most popular open-source headless CMS for a reason: solid developer experience, big community, and a polished admin panel. But it's not the only option.

This is an honest comparison between Strapi and drop.js -- where each one wins, where each one falls short, and which one makes sense for different types of projects.

## Quick comparison

| Feature | Strapi | drop.js |
|---|---|---|
| **License** | MIT (with EE features) | MIT |
| **Language** | JavaScript/TypeScript | TypeScript-first |
| **Setup** | `npx create-strapi-app` | `npx create-drop-app` |
| **Content modeling** | Visual builder + code | JSON config files |
| **REST API** | Yes | Yes |
| **GraphQL** | Plugin | Built-in |
| **JSON:API** | No | Built-in |
| **Swagger docs** | Plugin | Built-in |
| **Total endpoints** | Varies by content types | 220+ |
| **Admin UI** | React (polished) | Next.js (60 pages) |
| **Database** | SQLite, MySQL, PostgreSQL | SQLite, MySQL, PostgreSQL |
| **Drupal compatibility** | No | 100% database compatible |
| **Plugin system** | Large marketplace | Everything included |
| **Content workflow** | Enterprise only | Built-in (draft/review/published/archived) |
| **Multilingual** | Plugin | Built-in (16 languages) |

## Setup and first run

Both tools get you from zero to running API in under five minutes. Strapi's `create-strapi-app` CLI scaffolds a project and launches the admin panel where you create your first content type visually. drop.js uses `create-drop-app` and has you define content types in JSON files.

```bash
# Strapi
npx create-strapi-app my-project --quickstart

# drop.js
npx create-drop-app my-site
```

Strapi's visual content type builder is genuinely good for prototyping. You click through a UI, add fields, set validations, and your API is ready. The downside: those content type definitions live in auto-generated JSON files that aren't always easy to review in a PR.

drop.js skips the visual builder entirely. You write JSON config files by hand.

```json
{
  "name": "article",
  "label": "Article",
  "fields": {
    "title": {
      "type": "string",
      "required": true,
      "label": "Title"
    },
    "body": {
      "type": "text_long",
      "label": "Body"
    },
    "category": {
      "type": "entity_reference",
      "target": "taxonomy_term",
      "label": "Category"
    },
    "hero_image": {
      "type": "image",
      "label": "Hero Image"
    }
  }
}
```

This is a trade-off, not a win. If you value visual tooling and onboarding non-technical team members, Strapi's builder is better. If you want content type definitions that live cleanly in version control and are reviewable in pull requests, drop.js's approach is better.

## API surface

Strapi generates REST endpoints for each content type. GraphQL is available via plugin. You get the standard CRUD operations plus filtering, sorting, and pagination.

drop.js generates REST, GraphQL, and JSON:API endpoints out of the box -- no plugins to install. You also get auto-generated Swagger documentation. The total endpoint count is 220+, which includes admin endpoints, batch operations, and utility routes.

```bash
# drop.js gives you all three API styles for every content type
GET /api/articles              # REST
GET /jsonapi/node/article      # JSON:API
POST /graphql                  # GraphQL

# Plus auto-generated docs
GET /api/docs                  # Swagger UI
```

If your frontend team uses JSON:API (common with Drupal or Ember.js backgrounds), drop.js supports it natively. With Strapi, you'd need a custom solution.

## Admin UI

This is where Strapi has a clear advantage. Strapi's admin panel is polished, well-designed React application. It handles content editing, media management, user roles, and plugin configuration. Years of iteration show.

drop.js ships a 60-page Next.js admin interface. It covers content management, taxonomy, user administration, and permissions. It's functional and gets the job done, but it hasn't had the same level of design investment as Strapi's admin.

If your editors and content team spend significant time in the admin panel, Strapi provides a better experience today.

## TypeScript support

Both projects support TypeScript, but the depth differs. Strapi added TypeScript support in v4 and improved it in v5. You can write your customizations in TypeScript and get type generation for your content types.

drop.js is TypeScript-first from the ground up. The entire framework, including the core, admin, and all 18 field types, is written in TypeScript. You get end-to-end type safety without any configuration or code generation step.

This matters most if you're extending the CMS or building custom integrations. With drop.js, every internal API is fully typed. With Strapi, some internal APIs still have gaps in their type definitions.

## Content modeling

Strapi gives you 14 field types including text, rich text, number, date, media, JSON, relation, component, and dynamic zone. Components and dynamic zones let you build flexible, reusable content structures.

drop.js offers 18 field types and includes some that Strapi doesn't have out of the box: paragraphs (structured content components similar to Strapi's dynamic zones but following Drupal's paragraph pattern), hierarchical taxonomy with vocabulary support, and entity references with configurable target bundles.

```json
{
  "paragraphs_field": {
    "type": "paragraphs",
    "label": "Page Sections",
    "allowed_types": ["hero", "text_block", "image_gallery", "cta"]
  }
}
```

Both approaches work well. Strapi's component system is more visual to configure. drop.js's paragraph system is more familiar if you're coming from Drupal.

## Database and Drupal compatibility

Both support SQLite, MySQL, and PostgreSQL. For most projects, this is a wash.

Where drop.js diverges is Drupal 11 database compatibility. drop.js uses the exact same database schema as Drupal 11. You can export your drop.js SQLite database and import it directly into a Drupal installation. No migration scripts, no data transformation.

This sounds niche, but it solves a real problem. If you start a project on drop.js and later need Drupal's full ecosystem (contributed modules, enterprise hosting on Acquia/Pantheon, a larger developer pool), you can migrate without losing data. No other Node.js CMS offers this escape hatch.

## Ecosystem and plugins

Strapi has a large plugin marketplace with community and official plugins for SEO, email, search, authentication providers, and more. This is a genuine advantage -- you can extend Strapi's functionality without writing everything yourself.

drop.js takes the opposite approach: ship everything in one package. Taxonomy, workflows, multilingual support, webhooks, full-text search, batch API, RBAC with 19 permissions -- it's all included. No plugins to install, no compatibility matrix to manage, no breaking changes when a third-party plugin doesn't update.

The trade-off is flexibility. Strapi's plugin system lets the community build features the core team hasn't prioritized. drop.js gives you a complete but opinionated feature set.

## Stability and upgrades

Strapi's v4 to v5 upgrade was painful for many teams. The migration involved significant breaking changes: new document structure, revised API responses, updated plugin APIs, and removed features. Migration guides were extensive, and many community plugins broke.

drop.js follows Drupal's proven architectural patterns, which have been refined over 20+ years. The entity/field system, content workflows, and permission model are battle-tested concepts. This doesn't guarantee no breaking changes, but the foundation is more stable because the patterns aren't being invented from scratch.

## Content workflow

Strapi's content workflow (draft/publish states, review stages) is an Enterprise Edition feature. If you're on the free community edition, you get basic draft/publish only.

drop.js includes a full content workflow out of the box: draft, in review, published, and archived states. Revision history is also built-in, letting you track and revert changes. No enterprise license needed.

```bash
# drop.js content states available on every content type
draft → in_review → published → archived
```

If your team needs approval workflows without paying for Strapi Enterprise, this is a significant difference.

## Where Strapi wins

**Community and ecosystem.** Strapi has been around longer, has more tutorials, more Stack Overflow answers, more YouTube videos, and more blog posts. When you hit a problem, someone has probably solved it.

**Visual content type builder.** For teams that include non-developers or for rapid prototyping, the visual builder is faster than editing JSON files.

**Admin panel polish.** More design investment, better UX, more intuitive for content editors who live in the admin daily.

**Hosting options.** Strapi Cloud provides managed hosting. drop.js requires self-hosting.

## Where drop.js wins

**Drupal compatibility.** If there's any chance you'll need to migrate to Drupal later, or if your organization has Drupal expertise, this is unique. No other Node.js CMS can export a database that Drupal reads natively.

**Everything included.** Workflows, multilingual, taxonomy, full-text search, webhooks, batch API -- all in one `npm install`. No plugin hunting, no compatibility issues.

**JSON config in git.** Content type definitions are plain JSON files. PRs are clean, diffs are readable, and your entire content model is version-controlled by default.

**API breadth.** REST + GraphQL + JSON:API + Swagger docs from a single package. 220+ endpoints without installing anything extra.

**TypeScript depth.** End-to-end type safety from the framework core through to your custom code.

## Which should you pick?

Pick Strapi if you need a large community, visual tooling for non-developers, or managed cloud hosting. It's the safe, well-documented choice with the most third-party resources.

Pick drop.js if you want everything in one package, need Drupal database compatibility, prefer JSON config files over visual builders, or need content workflows without an enterprise license. It's the better choice for teams that are comfortable in code and want fewer moving parts.

Both are solid, MIT-licensed, self-hostable headless CMS options. The right choice depends on your team's background and your project's specific requirements -- not on which one has better marketing.
