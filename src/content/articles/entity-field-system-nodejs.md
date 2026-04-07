---
title: "Drupal's Entity/Field System in Node.js: How drop.js Works"
excerpt: "A deep dive into how drop.js implements Drupal's entity/field architecture natively in Node.js."
category: "Drupal"
readTime: "10 min read"
date: "April 2026"
---

Drupal's content modeling system is the best in the CMS world. That is not marketing. It is a factual statement backed by 20 years of iteration on entity types, field types, entity references, paragraphs, taxonomy, revisions, and content workflows. No other CMS has this depth of structured content modeling.

The problem is that the system is locked inside a PHP application. drop.js unlocks it.

drop.js implements Drupal's entity/field architecture natively in Node.js with TypeScript. Not "inspired by." Not "similar to." The same data model, the same database schema, the same concepts, with the same names. The schema is byte-identical to Drupal 11.

This article walks through every major Drupal concept and shows its drop.js equivalent side by side.

## Content Types

In Drupal, content types are defined through YAML configuration files (or the admin UI, which generates YAML).

### Drupal (YAML)

```yaml
# config/sync/node.type.article.yml
langcode: en
status: true
name: Article
type: article
description: 'Use articles for time-sensitive content like news and blog posts.'
new_revision: true
preview_mode: 1
display_submitted: true
```

### drop.js (JSON)

```json
{
  "type": "article",
  "label": "Article",
  "description": "Use articles for time-sensitive content like news and blog posts.",
  "revision": true
}
```

The core concept is identical: a content type is a bundle that defines the structure for a group of entities. In both systems, creating a content type gives you a base set of fields (title, status, created, changed, author) automatically.

The difference is format and tooling. Drupal uses YAML and the configuration management system. drop.js uses JSON files. Both can also be managed through admin UIs.

## Fields

Drupal supports dozens of field types through core and contrib modules. drop.js ships 18 field types that cover the core content modeling needs.

### Drupal (YAML Field Storage + Field Instance)

In Drupal, adding a field requires two config files: field storage (defines the field globally) and field instance (attaches it to a content type).

```yaml
# field.storage.node.field_subtitle.yml
langcode: en
status: true
id: node.field_subtitle
field_name: field_subtitle
entity_type: node
type: string
settings:
  max_length: 255
cardinality: 1

# field.field.node.article.field_subtitle.yml
langcode: en
status: true
id: node.article.field_subtitle
field_name: field_subtitle
entity_type: node
bundle: article
label: Subtitle
required: false
settings: {}
```

### drop.js (JSON)

```json
{
  "type": "article",
  "label": "Article",
  "fields": {
    "field_subtitle": {
      "type": "string",
      "label": "Subtitle",
      "max_length": 255,
      "required": false
    }
  }
}
```

One file instead of two. The field definition is inline with the content type definition. The storage details are inferred from the field type.

### Supported Field Types

| drop.js Type | Drupal Equivalent | Storage |
|--------------|-------------------|---------|
| `string` | `string` | `VARCHAR(255)` |
| `text_long` | `text_long` | `LONGTEXT` with format |
| `integer` | `integer` | `INT` |
| `float` | `float` | `FLOAT` |
| `boolean` | `boolean` | `TINYINT` |
| `email` | `email` | `VARCHAR(254)` |
| `date` | `datetime` | `VARCHAR(20)` |
| `link` | `link` | `VARCHAR(2048)` + title |
| `file` | `file` | File reference |
| `image` | `image` | File reference + alt/title |
| `color` | `color_field` (contrib) | `VARCHAR(7)` |
| `entity_reference` | `entity_reference` | Target ID + type |
| `list_string` | `list_string` | `VARCHAR(255)` |
| `list_integer` | `list_integer` | `INT` |
| `list_float` | `list_float` | `FLOAT` |
| `decimal` | `decimal` | `NUMERIC(precision, scale)` |
| `telephone` | `telephone` | `VARCHAR(256)` |
| `timestamp` | `timestamp` | `INT` |

Field cardinality works the same way: `cardinality: 1` for single value, `cardinality: -1` for unlimited, or any positive integer for a fixed maximum.

## Entity References

Entity references are how Drupal models relationships between content. An article references an author (user), a category (taxonomy term), or related articles (other nodes). drop.js handles this identically.

### Drupal

```yaml
# field.storage.node.field_related_articles.yml
type: entity_reference
settings:
  target_type: node
cardinality: 3

# field.field.node.article.field_related_articles.yml
settings:
  handler: default:node
  handler_settings:
    target_bundles:
      article: article
```

### drop.js

```json
{
  "field_related_articles": {
    "type": "entity_reference",
    "label": "Related Articles",
    "target_type": "node",
    "target_bundle": "article",
    "cardinality": 3
  }
}
```

In both systems, entity references store the target entity ID and resolve it when the entity is loaded. The JSON:API and GraphQL responses include relationship data that your frontend can follow to load related content.

```bash
# Fetch an article with related articles included
curl http://localhost:3000/api/node/article/1?include=field_related_articles
```

The `?include=` parameter works the same way as Drupal's JSON:API module because drop.js implements the same JSON:API specification.

## Taxonomy

Drupal's taxonomy system is one of its best features: vocabularies contain terms, terms can be hierarchical, and content references terms through entity reference fields.

### Drupal

```yaml
# taxonomy.vocabulary.tags.yml
vid: tags
name: Tags
description: 'Free-form tagging for articles'
weight: 0

# A term is created through the UI or API:
# POST /jsonapi/taxonomy_term/tags
# { "data": { "attributes": { "name": "JavaScript" } } }
```

### drop.js

```json
{
  "vocabulary": "tags",
  "label": "Tags",
  "description": "Free-form tagging for articles"
}
```

Terms are created the same way:

```bash
curl -X POST http://localhost:3000/api/taxonomy_term/tags \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "type": "taxonomy_term--tags",
      "attributes": {
        "name": "JavaScript"
      }
    }
  }'
```

Hierarchical taxonomy works the same way. Set a `parent` field on a term to nest it under another term. This gives you category trees, navigation menus, and multi-level classification without any extra configuration.

```bash
# Create a child term
curl -X POST http://localhost:3000/api/taxonomy_term/tags \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "type": "taxonomy_term--tags",
      "attributes": {
        "name": "React",
        "parent": [{ "target_id": 1 }]
      }
    }
  }'
```

## Paragraphs

Drupal's Paragraphs module is the standard approach for building flexible, component-based content. Instead of dumping everything into a single body field, editors compose pages from reusable paragraph types: text blocks, image galleries, CTAs, accordions, and whatever else you define.

This is one of the things other CMS platforms struggle to replicate. drop.js implements it as a core feature.

### Drupal

In Drupal, you install the Paragraphs module, define paragraph types with fields, and add an entity reference revisions field to your content type that targets paragraphs.

```yaml
# paragraphs.paragraphs_type.text_block.yml
id: text_block
label: 'Text Block'

# field.field.paragraph.text_block.field_body.yml
field_name: field_body
entity_type: paragraph
bundle: text_block
label: Body
```

### drop.js

```json
{
  "type": "text_block",
  "label": "Text Block",
  "entity_type": "paragraph",
  "fields": {
    "field_body": {
      "type": "text_long",
      "label": "Body",
      "required": true
    }
  }
}
```

Then reference paragraphs from a content type:

```json
{
  "type": "page",
  "label": "Page",
  "fields": {
    "field_content": {
      "type": "entity_reference",
      "label": "Content Sections",
      "target_type": "paragraph",
      "target_bundle": ["text_block", "image_gallery", "call_to_action"],
      "cardinality": -1
    }
  }
}
```

The parent-child relationship between the node and its paragraphs is maintained automatically. When you load a page, its paragraphs are available through the entity reference field. When you delete a page, its paragraphs are cleaned up.

### Fetching Paragraphs via API

```bash
# Get a page with all its content sections
curl http://localhost:3000/api/node/page/1?include=field_content
```

Or with GraphQL:

```graphql
query {
  nodePage(id: "1") {
    title
    fieldContent {
      ... on ParagraphTextBlock {
        fieldBody {
          value
        }
      }
      ... on ParagraphImageGallery {
        fieldImages {
          url
          alt
        }
      }
      ... on ParagraphCallToAction {
        fieldHeading
        fieldLink {
          uri
          title
        }
      }
    }
  }
}
```

This is how you build flexible page layouts with a headless CMS without reaching for a visual page builder. The structure is defined. The content is structured. Your frontend renders the components based on the paragraph type.

## Revisions

Every entity in Drupal can have revision history. Every edit creates a new revision. You can view previous revisions, compare them, and revert. drop.js implements the same system with the same storage model.

### How It Works

Both systems store the current revision in the entity base table and all revisions in a separate revision table. Field data is also versioned in `*_revision` tables.

```bash
# Get all revisions for an article
curl http://localhost:3000/api/node/article/1/revisions
```

```json
{
  "data": [
    {
      "id": "1",
      "revision_id": 3,
      "attributes": {
        "title": "Updated Title",
        "changed": "2026-04-07T14:30:00Z",
        "revision_log": "Fixed typo in title"
      }
    },
    {
      "id": "1",
      "revision_id": 2,
      "attributes": {
        "title": "Original Title (v2)",
        "changed": "2026-04-06T10:00:00Z",
        "revision_log": "Added featured image"
      }
    },
    {
      "id": "1",
      "revision_id": 1,
      "attributes": {
        "title": "Original Title",
        "changed": "2026-04-05T09:00:00Z",
        "revision_log": "Initial creation"
      }
    }
  ]
}
```

```bash
# Load a specific revision
curl http://localhost:3000/api/node/article/1/revisions/2

# Revert to a previous revision
curl -X POST http://localhost:3000/api/node/article/1/revisions/2/revert
```

Because the database schema is the same, revision data migrated from Drupal is immediately accessible through drop.js. Your content history survives the migration.

## Views (Query Builder)

Drupal Views is arguably the most powerful feature in Drupal. It is a visual query builder that generates lists, grids, tables, and feeds from your content with filters, sorts, relationships, exposed filters, and pagination.

drop.js implements the same concept through its views system.

### Drupal (Views UI generates config)

```yaml
# views.view.recent_articles.yml
display:
  default:
    display_options:
      filters:
        status:
          value: '1'
        type:
          value: article
      sorts:
        created:
          order: DESC
      pager:
        type: full
        options:
          items_per_page: 10
```

### drop.js (JSON)

```json
{
  "id": "recent_articles",
  "label": "Recent Articles",
  "entity_type": "node",
  "bundle": "article",
  "filters": {
    "status": { "value": true }
  },
  "sorts": {
    "created": { "direction": "DESC" }
  },
  "pagination": {
    "items_per_page": 10
  }
}
```

Views in drop.js generate API endpoints:

```bash
# The view is accessible at:
curl http://localhost:3000/api/views/recent_articles

# With exposed filters:
curl http://localhost:3000/api/views/recent_articles?field_tags=5&page=2
```

Exposed filters work the same way: define which filters visitors can control, and the API accepts those as query parameters.

## Content Workflow

Drupal's Content Moderation module provides a state machine for editorial workflows: Draft, Review, Published, Archived. Transitions between states are controlled by permissions.

### Drupal

```yaml
# workflows.workflow.editorial.yml
type_settings:
  states:
    draft:
      label: Draft
    review:
      label: Review
    published:
      label: Published
    archived:
      label: Archived
  transitions:
    submit_for_review:
      from: [draft]
      to: review
    publish:
      from: [review]
      to: published
    archive:
      from: [published]
      to: archived
    back_to_draft:
      from: [review, archived]
      to: draft
```

### drop.js

```json
{
  "workflow": "editorial",
  "label": "Editorial Workflow",
  "states": {
    "draft": { "label": "Draft" },
    "review": { "label": "Review" },
    "published": { "label": "Published" },
    "archived": { "label": "Archived" }
  },
  "transitions": {
    "submit_for_review": {
      "from": ["draft"],
      "to": "review",
      "label": "Submit for Review"
    },
    "publish": {
      "from": ["review"],
      "to": "published",
      "label": "Publish"
    },
    "archive": {
      "from": ["published"],
      "to": "archived",
      "label": "Archive"
    },
    "back_to_draft": {
      "from": ["review", "archived"],
      "to": "draft",
      "label": "Back to Draft"
    }
  }
}
```

Each transition can be gated by permissions. An author can move content from Draft to Review, but only an editor can move it from Review to Published. This maps directly to how Drupal handles editorial workflows.

```bash
# Transition an article to "review" state
curl -X PATCH http://localhost:3000/api/node/article/1 \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "attributes": {
        "moderation_state": "review"
      }
    }
  }'
```

## Permissions and RBAC

Drupal's permission system is straightforward: roles have permissions, users have roles, and content access is checked against the user's permissions.

drop.js implements the same model with 19 core permissions:

```
administer content types     create [bundle] content
edit own [bundle] content    edit any [bundle] content
delete own [bundle] content  delete any [bundle] content
administer taxonomy          create terms in [vocabulary]
edit terms in [vocabulary]   delete terms in [vocabulary]
administer users             access user profiles
administer permissions       access content overview
view own unpublished content view any unpublished content
administer url aliases       use editorial transition [name]
access administration pages
```

### Assigning Permissions

```bash
# Create a role with specific permissions
curl -X POST http://localhost:3000/api/user/role \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "attributes": {
        "id": "editor",
        "label": "Editor",
        "permissions": [
          "create article content",
          "edit any article content",
          "delete own article content",
          "use editorial transition publish",
          "access content overview"
        ]
      }
    }
  }'
```

Every API request is checked against the authenticated user's permissions. Anonymous users can only access published content. Editors can create and edit. Admins can do everything. This is the same security model Drupal has used for years.

## URL Aliases

Drupal's Pathauto module generates human-readable URL aliases from content fields. `/node/47` becomes `/blog/my-article-title`. drop.js includes this as a core feature.

### Pattern-Based Aliases

```json
{
  "pattern": "/blog/[node:title]",
  "entity_type": "node",
  "bundle": "article"
}
```

When an article titled "Getting Started with drop.js" is created, it automatically gets the alias `/blog/getting-started-with-dropjs`. The title is transliterated, lowercased, and hyphenated.

### Custom Aliases

You can also set aliases manually:

```bash
curl -X POST http://localhost:3000/api/url-alias \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "attributes": {
        "path": "/node/47",
        "alias": "/about/our-team"
      }
    }
  }'
```

Custom aliases override pattern-generated ones. This is the same precedence behavior as Drupal.

## The Bigger Picture

This is not a surface-level similarity. drop.js implements Drupal's data model at the database level. The same tables. The same column types. The same relationships between entities, fields, and revisions.

For Drupal teams moving to Node.js, this means your mental model transfers completely. For teams evaluating headless CMS options, this means you get 20 years of content modeling design decisions without the PHP dependency.

The gap between Drupal's content modeling capabilities and what most headless CMS platforms offer is significant. Features like paragraphs, revision history, taxonomy hierarchies, content workflows, and granular permissions are afterthoughts or enterprise add-ons in other systems. In drop.js, they are the foundation.
