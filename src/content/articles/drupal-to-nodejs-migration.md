Drupal is a powerful CMS. It has an unmatched content modeling system, a mature entity/field architecture, and 20 years of battle-tested features. But running a Drupal site in 2026 means PHP, Composer dependency hell, Drush maintenance scripts, and a shrinking pool of developers who want to work with that stack.

If you have been thinking about migrating your Drupal site to Node.js but dreading the prospect of rebuilding your content model from scratch, this guide is for you.

## Why Migrate to Node.js

The practical reasons teams leave Drupal tend to be the same:

**Hiring.** Finding senior Drupal developers is harder every year. Finding JavaScript/TypeScript developers is not. Your content model is a competitive advantage. Your tech stack should not be a hiring bottleneck.

**Tooling.** The Node.js ecosystem moves faster. TypeScript, ESLint, Prettier, Vitest, hot module reloading, single-command deploys. PHP tooling has improved, but the JavaScript/TypeScript developer experience is ahead.

**Frontend flexibility.** Drupal's Twig templating is capable but rigid. Most modern projects want React, Vue, Svelte, or Astro on the frontend. You can use Drupal as a headless CMS, but then you are maintaining a PHP backend solely as a content API. That is a lot of infrastructure for a JSON endpoint.

**Deployment simplicity.** A Drupal site needs PHP, a web server (Apache or Nginx), a database, Composer, and often Redis or Memcached. A Node.js application needs Node.js and a database. Containerization, serverless, and PaaS deployments are straightforward.

These are not criticisms of Drupal. They are pragmatic observations about where the industry has moved.

## Why drop.js Specifically

drop.js is not just another headless CMS that happens to run on Node.js. It is a ground-up reimplementation of Drupal's entity/field architecture in TypeScript.

This matters for migration because:

**The database schema is compatible.** drop.js uses the same table structures as Drupal 11. Entity tables, field data tables, revision tables, taxonomy term tables. This is not "inspired by" Drupal. It is structurally identical.

**The concepts map 1:1.** Nodes, bundles, fields, taxonomy vocabularies, terms, entity references, paragraphs, revisions, URL aliases, permissions, roles, content workflows. Every core Drupal concept has a direct equivalent in drop.js with the same name and the same semantics.

**Migration tooling exists.** drop.js ships CLI commands specifically designed to analyze a Drupal database, generate content type definitions, and migrate content.

If you are running Drupal 9, 10, or 11, drop.js is the shortest path to Node.js.

## Migration Approaches

There are three ways to migrate, and the right one depends on your situation.

### Approach 1: Direct Database Migration

If your Drupal site uses SQLite, you can potentially use the database directly. drop.js reads the same schema, so pointing it at a copy of your Drupal database gives you immediate access to your content through Node.js APIs.

For MySQL or PostgreSQL, the process involves exporting your Drupal database and importing it into the database drop.js is configured to use. Because the schemas are compatible, the data does not need to be transformed at the field level.

This approach is the fastest but requires the most careful testing. Drupal modules may have added custom tables or altered core tables in ways that need attention.

### Approach 2: Content Migration via API

If your Drupal site exposes JSON:API endpoints (core in Drupal 9+), you can export content programmatically and import it into drop.js.

This approach is cleaner because it goes through the content API layer, which normalizes data. It is also slower for large sites and requires your Drupal site to be running during migration.

```bash
# Export articles from Drupal's JSON:API
curl https://your-drupal-site.com/jsonapi/node/article?page[limit]=50 > articles.json

# Import into drop.js
curl -X POST http://localhost:3000/api/node/article \
  -H "Content-Type: application/json" \
  -d @articles.json
```

For production migrations, you would script this with pagination, error handling, and relationship resolution. But the data format is the same on both sides because both systems implement JSON:API.

### Approach 3: Schema Migration with CLI Tools

This is the recommended approach for most teams. drop.js provides CLI commands that automate the analysis, schema generation, and content migration process.

## Step-by-Step: CLI Migration

### Step 1: Analyze Your Drupal Database

The `migrate:analyze` command connects to your Drupal database and reports what it finds: content types, fields, taxonomy vocabularies, entity references, and potential issues.

```bash
npx drop migrate:analyze --source mysql://user:pass@localhost/drupal_db
```

Output:

```
Analyzing Drupal database...

Content Types Found:
  - article (47 entities)
    Fields: body, field_image, field_tags, field_category, field_author_bio
  - page (12 entities)
    Fields: body, field_hero_image, field_sidebar_blocks
  - event (23 entities)
    Fields: body, field_date, field_location, field_price, field_registration_link

Taxonomy Vocabularies:
  - tags (156 terms)
  - categories (8 terms, hierarchical)
  - event_types (5 terms)

Paragraphs Types:
  - text_block (used 89 times)
  - image_gallery (used 12 times)
  - call_to_action (used 34 times)

Entity References:
  - article.field_tags -> taxonomy_term.tags (multi-value)
  - article.field_category -> taxonomy_term.categories (single-value)
  - page.field_sidebar_blocks -> paragraph (multi-value)

Potential Issues:
  - Custom table: webform_submission (not migratable, requires manual handling)
  - Module-specific field: field_metatag (Metatag module format, needs mapping)

Analysis complete. Run `npx drop migrate:generate` to create content type definitions.
```

This gives you a clear picture of what you are working with before committing to the migration.

### Step 2: Generate Content Type Definitions

The `migrate:generate` command reads your Drupal database schema and produces drop.js JSON content type definitions.

```bash
npx drop migrate:generate --source mysql://user:pass@localhost/drupal_db --output ./content-types
```

This creates JSON files for each content type:

```
content-types/
  article.json
  page.json
  event.json
  taxonomy/
    tags.json
    categories.json
    event_types.json
  paragraphs/
    text_block.json
    image_gallery.json
    call_to_action.json
```

Here is what a generated `article.json` looks like:

```json
{
  "type": "article",
  "label": "Article",
  "fields": {
    "body": {
      "type": "text_long",
      "label": "Body",
      "required": true
    },
    "field_image": {
      "type": "image",
      "label": "Image"
    },
    "field_tags": {
      "type": "entity_reference",
      "label": "Tags",
      "target_type": "taxonomy_term",
      "target_bundle": "tags",
      "cardinality": -1
    },
    "field_category": {
      "type": "entity_reference",
      "label": "Category",
      "target_type": "taxonomy_term",
      "target_bundle": "categories",
      "cardinality": 1
    },
    "field_author_bio": {
      "type": "text_long",
      "label": "Author Bio"
    }
  }
}
```

Review these files. The generator handles the straightforward mappings automatically, but you may want to adjust labels, add validation rules, or remove fields you no longer need.

### Step 3: Migrate Content

Once you are satisfied with the content type definitions, run the content migration:

```bash
npx drop migrate:content --source mysql://user:pass@localhost/drupal_db
```

```
Migrating content...

Taxonomy terms:
  - tags: 156/156 migrated
  - categories: 8/8 migrated
  - event_types: 5/5 migrated

Paragraphs:
  - text_block: 89/89 migrated
  - image_gallery: 12/12 migrated
  - call_to_action: 34/34 migrated

Nodes:
  - article: 47/47 migrated
  - page: 12/12 migrated
  - event: 23/23 migrated

URL Aliases: 82/82 migrated
Revisions: 203/203 migrated

Migration complete.
```

Taxonomy terms and paragraphs migrate first because nodes reference them. The migration tool resolves these dependencies automatically.

## Mapping Drupal Concepts to drop.js

If you know Drupal, you already know drop.js. Here is the concept mapping:

| Drupal | drop.js | Notes |
|--------|---------|-------|
| Node | Entity (node) | Same entity type, same base fields |
| Content Type | Bundle | Defined in JSON instead of YAML/config |
| Field | Field | 18 types supported, same storage model |
| Taxonomy Vocabulary | Vocabulary | Identical concept |
| Taxonomy Term | Term | Hierarchical, with parent reference |
| Paragraph | Paragraph | Parent-child relationship preserved |
| View | View | Query builder with filters and sorts |
| Revision | Revision | Same revision table structure |
| URL Alias | URL Alias | Pattern-based and custom aliases |
| Role | Role | Same RBAC model |
| Permission | Permission | 19 core permissions |
| Content Moderation | Content Workflow | Draft, Review, Published, Archived |
| Module | Event Hook | Extensibility through hooks, not modules |
| Twig Template | Any Frontend | Headless by design, bring your own |

### What Changes

**PHP to TypeScript.** Your custom module code, hooks, and preprocess functions become TypeScript. If you have custom REST resources, they become drop.js event hooks or custom route handlers.

**Twig to anything.** Drupal's theme layer is gone entirely. Your frontend is now a separate application: Next.js, Nuxt, Astro, SvelteKit, a mobile app, or whatever you choose. This is the point of going headless.

**Composer to npm.** Dependency management moves from `composer.json` to `package.json`. No more `composer update` and praying.

**Drush to drop CLI.** Site management commands change from `drush cr`, `drush updb` to `npx drop` equivalents.

**Module system to event hooks.** Drupal's hook system and plugin architecture are replaced by a simpler event-based extensibility model. You will not find an equivalent for every contrib module, but core functionality (the entity/field system, taxonomy, permissions, revisions, workflows) is built in.

### What Stays the Same

**The entity/field data model.** This is the big one. Your content structure does not change. Entities have fields. Fields have types, cardinality, and validation. Entity references create relationships. This is identical.

**Taxonomy.** Vocabularies contain terms. Terms can be hierarchical. Content references terms through entity reference fields. Exactly the same.

**Revisions.** Every entity edit creates a revision. You can load any previous revision, compare revisions, and revert. The revision storage model is the same.

**Content workflow.** Draft, Review, Published, Archived. Content moves through states with permission checks at each transition.

**Permissions and RBAC.** Roles have permissions. Users have roles. Content access is checked against permissions. The model is familiar.

**URL aliases.** Pattern-based automatic aliases and manual overrides. `/node/47` becomes `/blog/my-article-title`.

## Testing and Validation

After migration, verify that everything came across correctly.

### Content Counts

```bash
# Compare article counts
echo "Drupal:"
drush sqlq "SELECT COUNT(*) FROM node WHERE type='article'"

echo "drop.js:"
curl -s http://localhost:3000/api/node/article | jq '.meta.count'
```

Run this for every content type, taxonomy vocabulary, and paragraph type.

### Field Data Spot Checks

Pick 5-10 entities of each type and compare field values between Drupal and drop.js:

```bash
# Drupal
curl -s https://drupal-site.com/jsonapi/node/article/ENTITY_UUID | jq '.data.attributes'

# drop.js
curl -s http://localhost:3000/api/node/article/ENTITY_UUID | jq '.data.attributes'
```

Pay particular attention to:

- **Rich text fields**: HTML should be preserved exactly
- **Entity references**: Referenced entities should resolve correctly
- **Multi-value fields**: All values should be present, in order
- **Date fields**: Timezone handling can differ. Verify timestamps match.
- **File and image fields**: File paths will change. Verify files are accessible.

### URL Aliases

```bash
# Get all aliases from drop.js
curl -s http://localhost:3000/api/url-alias | jq '.data[].attributes.alias'
```

Compare against your Drupal aliases. If you have a large site, script this and diff the outputs.

### Revision History

For content types with revisions enabled, verify that revision history is intact:

```bash
# Get revisions for a specific article
curl -s http://localhost:3000/api/node/article/ENTITY_ID/revisions
```

Check that the revision count matches and that the revision timestamps are correct.

## Post-Migration Checklist

After validating the data, there are a few more things to address:

- **Redirects.** If your URL structure changes, set up 301 redirects from old Drupal paths to new paths. This preserves SEO value.
- **Media files.** Copy uploaded files from Drupal's `sites/default/files` directory to drop.js's file storage location. Update file path references if the base URL changes.
- **Custom functionality.** Audit your Drupal custom modules. List every custom hook, form alter, and REST resource. Determine which ones need to be reimplemented as drop.js event hooks and which are no longer needed.
- **Cron jobs.** If you have scheduled tasks in Drupal (cron hooks), recreate them as scheduled tasks in your Node.js environment.
- **Search.** If you were using Drupal's Search API with Solr, evaluate whether drop.js's built-in full-text search meets your needs or whether you need to integrate an external search service.
- **Forms.** Webforms do not migrate automatically. If you rely heavily on Drupal's Webform module, plan to rebuild forms in your frontend framework or use a form service.

## Timeline Expectations

For a typical Drupal site with 5-10 content types, a few taxonomy vocabularies, and under 10,000 entities:

| Phase | Time Estimate |
|-------|---------------|
| Analysis and planning | 1-2 days |
| Schema generation and review | 1 day |
| Content migration | 1 day |
| Frontend development | 1-3 weeks (depends on complexity) |
| Testing and validation | 2-3 days |
| Custom functionality reimplementation | 1-2 weeks (depends on modules) |

The content migration itself is fast. The time investment is in rebuilding the frontend and reimplementing custom functionality.

## Is This Right for Your Project

Migration makes sense if:

- Your team is stronger in JavaScript/TypeScript than PHP
- You want to use a modern frontend framework
- Your Drupal site is primarily a content API (or you want it to be)
- You are tired of Drupal's operational overhead

Migration might not make sense if:

- You rely heavily on contrib modules with no Node.js equivalent (e.g., complex commerce setups, deeply integrated Webform workflows)
- Your team is productive with Drupal and hiring is not a problem
- Your site is about to be decommissioned anyway

The honest answer is that migration is work. drop.js reduces the content migration effort from "rebuild everything" to "run some CLI commands and validate." But the frontend and custom functionality still need to be rebuilt. Plan for that.
