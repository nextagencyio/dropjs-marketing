import './App.css'

function App() {
  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <a href="#" className="nav-logo">
            <img src="/logo-transparent.png" alt="drop.js" className="nav-logo-img" />
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#code">Code</a></li>
            <li><a href="#architecture">Architecture</a></li>
            <li><a href="#quickstart">Quick Start</a></li>
            <li><a href="https://github.com/nextagencyio/dropjs#readme" target="_blank" rel="noopener noreferrer">Docs</a></li>
            <li><a href="https://github.com/nextagencyio/dropjs" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            Open Source &middot; ISC License
          </div>
          <h1>
            Drupal's power,{' '}
            <span className="gradient-text">headless on Node.js</span>
          </h1>
          <p className="hero-subtitle">
            A headless Node.js port of Drupal's entity/field architecture.
            Define content types in JSON, get a full REST API and GraphQL endpoint instantly.
            220+ endpoints, 60 admin pages, and 500+ passing tests.
          </p>
          <div className="hero-buttons">
            <a href="#quickstart" className="btn btn-primary">
              Get Started
            </a>
            <a
              href="https://github.com/nextagencyio/dropjs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View on GitHub
            </a>
          </div>
          <div className="hero-install">
            <code>
              <span className="prompt">$</span>
              <span className="cmd">npx create-drop-app my-site</span>
            </code>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">18</span>
              <span className="stat-label">Field Types</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">220+</span>
              <span className="stat-label">API Endpoints</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">60</span>
              <span className="stat-label">Admin Pages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Passing Tests</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">42</span>
              <span className="stat-label">API Handlers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to build content-driven apps</h2>
            <p className="section-subtitle">
              Drupal's proven content architecture, rebuilt for Node.js.
              From entity/field system to GraphQL, admin UI and beyond — everything included.
            </p>
          </div>

          <div className="feature-groups">
            <div className="feature-group">
              <h3 className="feature-group-title cyan">Content Management</h3>
              <ul className="feature-list">
                <li><strong>Entity/Field System</strong> — 18 field types with configurable content types in JSON</li>
                <li><strong>Taxonomy</strong> — Vocabularies with hierarchical terms, tree API, weight-based reordering</li>
                <li><strong>Revision History</strong> — Full versioning with list, load, revert, and diff</li>
                <li><strong>Comments</strong> — Threaded commenting with Drupal-style thread ordering</li>
                <li><strong>Content Workflow</strong> — Moderation states: draft, review, published, archived</li>
                <li><strong>Paragraphs</strong> — Structured content components with parent-child relationships</li>
                <li><strong>URL Aliases</strong> — Human-readable paths with automatic pattern-based generation</li>
              </ul>
            </div>

            <div className="feature-group">
              <h3 className="feature-group-title purple">API &amp; Integration</h3>
              <ul className="feature-list">
                <li><strong>Auto-Generated REST API</strong> — Full CRUD for every entity type, 220+ endpoints</li>
                <li><strong>GraphQL</strong> — Dynamic schema from entity types with queries, mutations, and playground</li>
                <li><strong>Webhooks</strong> — HTTP callbacks with HMAC signing for entity lifecycle events</li>
                <li><strong>JSON:API</strong> — Optional JSON:API 1.0 output format via Accept header</li>
                <li><strong>OpenAPI/Swagger</strong> — Auto-generated API docs at /api/docs</li>
                <li><strong>Batch API</strong> — Execute multiple operations in a single request</li>
              </ul>
            </div>

            <div className="feature-group">
              <h3 className="feature-group-title pink">Admin &amp; UI</h3>
              <ul className="feature-list">
                <li><strong>Admin UI</strong> — 60 pages built with Next.js 15 + Tailwind for content, structure, config</li>
                <li><strong>Layout Builder</strong> — Configurable page layouts with sections and 5 layout types</li>
                <li><strong>Views System</strong> — Drupal Views-inspired list builder with filters, sorts, pagination</li>
                <li><strong>Media Library</strong> — File uploads with image styles (thumbnail, medium, large)</li>
                <li><strong>Menu System</strong> — Hierarchical navigation menus with weight-based ordering</li>
                <li><strong>Block System</strong> — 8 default regions with visibility conditions and placement management</li>
                <li><strong>Content Preview</strong> — Draft preview with token-based access and TTL expiry</li>
              </ul>
            </div>

            <div className="feature-group">
              <h3 className="feature-group-title green">Developer Experience</h3>
              <ul className="feature-list">
                <li><strong>Database Agnostic</strong> — SQLite for dev, MySQL/PostgreSQL for production</li>
                <li><strong>Full TypeScript</strong> — End-to-end type safety across entities, queries, fields, and API handlers</li>
                <li><strong>18 Field Types</strong> — string, text, integer, float, boolean, email, date, link, file, image, color, and more</li>
                <li><strong>Drupal Migration</strong> — Analyze, generate schemas, and migrate content via CLI</li>
                <li><strong>Event System</strong> — Async event bus with priority-ordered hooks</li>
                <li><strong>Validation</strong> — Server-side field constraints: required, max_length, pattern, and custom validators</li>
              </ul>
            </div>

            <div className="feature-group">
              <h3 className="feature-group-title orange">Enterprise</h3>
              <ul className="feature-list">
                <li><strong>Auth &amp; Permissions</strong> — RBAC with 19 permissions, sessions, password reset, CSRF</li>
                <li><strong>Multilingual</strong> — 16 default languages with translation CRUD and language negotiation</li>
                <li><strong>Search</strong> — FTS5 full-text search with porter stemming and auto-indexing</li>
                <li><strong>Scheduled Publishing</strong> — Time-based content state transitions with cron</li>
                <li><strong>Content Locking</strong> — Pessimistic edit locking with TTL, renewal, admin break</li>
                <li><strong>Config Sync</strong> — Import/export all configuration as JSON with diff</li>
                <li><strong>Rate Limiting</strong> — Per-route rate limits for auth, mutations, and read endpoints</li>
                <li><strong>Queue System</strong> — Persistent task queue with claim, release, and background processing</li>
              </ul>
            </div>
          </div>

          <div className="compat-callout">
            <h3>100% Drupal-Compatible Database</h3>
            <p>
              drop.js generates a byte-identical database schema to Drupal 11.
              Export your SQLite database and import it directly into a Drupal installation — all content,
              fields, taxonomy, and configuration transfer seamlessly. Migrate from Drupal or back to it at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="code-example" id="code">
        <div className="container">
          <div className="section-header">
            <span className="section-label">See it in action</span>
            <h2 className="section-title">Define once, build everything</h2>
            <p className="section-subtitle">
              Drupal's entity/field system in Node.js. A JSON content type definition gives you entities, fields, validation, REST + GraphQL endpoints, and admin UI.
            </p>
          </div>

          <div className="code-panels">
            {/* Left: JSON definition */}
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-dot red" />
                <span className="code-dot yellow" />
                <span className="code-dot green" />
                <span className="code-panel-title">article.content-type.json</span>
              </div>
              <pre>
{`{`}
{'\n  '}<span className="syn-key">"entity_type"</span><span className="syn-punctuation">:</span> <span className="syn-string">"node"</span><span className="syn-punctuation">,</span>
{'\n  '}<span className="syn-key">"bundle"</span><span className="syn-punctuation">:</span> <span className="syn-string">"article"</span><span className="syn-punctuation">,</span>
{'\n  '}<span className="syn-key">"label"</span><span className="syn-punctuation">:</span> <span className="syn-string">"Article"</span><span className="syn-punctuation">,</span>
{'\n  '}<span className="syn-key">"fields"</span><span className="syn-punctuation">:</span> {'{'}
{'\n    '}<span className="syn-key">"title"</span><span className="syn-punctuation">:</span> {'{'}
{'\n      '}<span className="syn-key">"type"</span><span className="syn-punctuation">:</span> <span className="syn-string">"string"</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"required"</span><span className="syn-punctuation">:</span> <span className="syn-number">true</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"max_length"</span><span className="syn-punctuation">:</span> <span className="syn-number">255</span>
{'\n    '}{'}'}<span className="syn-punctuation">,</span>
{'\n    '}<span className="syn-key">"body"</span><span className="syn-punctuation">:</span> {'{'}
{'\n      '}<span className="syn-key">"type"</span><span className="syn-punctuation">:</span> <span className="syn-string">"text_long"</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"label"</span><span className="syn-punctuation">:</span> <span className="syn-string">"Body"</span>
{'\n    '}{'}'}<span className="syn-punctuation">,</span>
{'\n    '}<span className="syn-key">"field_tags"</span><span className="syn-punctuation">:</span> {'{'}
{'\n      '}<span className="syn-key">"type"</span><span className="syn-punctuation">:</span> <span className="syn-string">"entity_reference"</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"label"</span><span className="syn-punctuation">:</span> <span className="syn-string">"Tags"</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"cardinality"</span><span className="syn-punctuation">:</span> <span className="syn-number">-1</span>
{'\n    '}{'}'}<span className="syn-punctuation">,</span>
{'\n    '}<span className="syn-key">"field_featured"</span><span className="syn-punctuation">:</span> {'{'}
{'\n      '}<span className="syn-key">"type"</span><span className="syn-punctuation">:</span> <span className="syn-string">"boolean"</span><span className="syn-punctuation">,</span>
{'\n      '}<span className="syn-key">"label"</span><span className="syn-punctuation">:</span> <span className="syn-string">"Featured"</span>
{'\n    '}{'}'}
{'\n  '}{'}'}
{'\n'}{'}'}
              </pre>
            </div>

            {/* Right: TypeScript usage */}
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-dot red" />
                <span className="code-dot yellow" />
                <span className="code-dot green" />
                <span className="code-panel-title">app.ts</span>
              </div>
              <pre>
<span className="syn-keyword">import</span> {'{'} <span className="syn-type">Entity</span> {'}'} <span className="syn-keyword">from</span> <span className="syn-string">'dropjs'</span><span className="syn-punctuation">;</span>
{'\n'}
{'\n'}<span className="syn-comment">// Create an article</span>
{'\n'}<span className="syn-keyword">const</span> article <span className="syn-operator">=</span> <span className="syn-keyword">await</span> <span className="syn-type">Entity</span>.<span className="syn-function">create</span><span className="syn-punctuation">(</span>
{'\n  '}<span className="syn-string">'node'</span><span className="syn-punctuation">,</span> <span className="syn-string">'article'</span><span className="syn-punctuation">,</span> {'{'}
{'\n    '}title<span className="syn-punctuation">:</span> <span className="syn-string">'Hello World'</span><span className="syn-punctuation">,</span>
{'\n    '}body<span className="syn-punctuation">:</span> {'{'} value<span className="syn-punctuation">:</span> <span className="syn-string">'My first post.'</span> {'}'}<span className="syn-punctuation">,</span>
{'\n    '}status<span className="syn-punctuation">:</span> <span className="syn-number">true</span>
{'\n  '}{'}'}
{'\n'}<span className="syn-punctuation">)</span><span className="syn-punctuation">;</span>
{'\n'}
{'\n'}<span className="syn-comment">// Query with conditions</span>
{'\n'}<span className="syn-keyword">const</span> ids <span className="syn-operator">=</span> <span className="syn-keyword">await</span> <span className="syn-type">Entity</span>.<span className="syn-function">query</span><span className="syn-punctuation">(</span><span className="syn-string">'node'</span><span className="syn-punctuation">)</span>
{'\n  '}.<span className="syn-function">condition</span><span className="syn-punctuation">(</span><span className="syn-string">'type'</span><span className="syn-punctuation">,</span> <span className="syn-string">'article'</span><span className="syn-punctuation">)</span>
{'\n  '}.<span className="syn-function">condition</span><span className="syn-punctuation">(</span><span className="syn-string">'status'</span><span className="syn-punctuation">,</span> <span className="syn-number">true</span><span className="syn-punctuation">)</span>
{'\n  '}.<span className="syn-function">sort</span><span className="syn-punctuation">(</span><span className="syn-string">'created'</span><span className="syn-punctuation">,</span> <span className="syn-string">'DESC'</span><span className="syn-punctuation">)</span>
{'\n  '}.<span className="syn-function">range</span><span className="syn-punctuation">(</span><span className="syn-number">0</span><span className="syn-punctuation">,</span> <span className="syn-number">10</span><span className="syn-punctuation">)</span>
{'\n  '}.<span className="syn-function">execute</span><span className="syn-punctuation">()</span><span className="syn-punctuation">;</span>
{'\n'}
{'\n'}<span className="syn-comment">// REST API auto-generated</span>
{'\n'}<span className="syn-comment">// GET    /api/node/article</span>
{'\n'}<span className="syn-comment">// GET    /api/node/article/:id</span>
{'\n'}<span className="syn-comment">// POST   /api/node/article</span>
{'\n'}<span className="syn-comment">// PATCH  /api/node/article/:id</span>
{'\n'}<span className="syn-comment">// DELETE /api/node/article/:id</span>
{'\n'}<span className="syn-comment">// ?sort=-created&amp;include=field_tags</span>
{'\n'}<span className="syn-comment">// GraphQL also at /api/graphql</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="architecture" id="architecture">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Architecture</span>
            <h2 className="section-title">One package, clean domains</h2>
            <p className="section-subtitle">
              A single <code>dropjs</code> package with domain-based modules — everything included, nothing to wire up.
            </p>
          </div>

          <div className="arch-diagram">
            <div className="arch-layer">
              <div className="arch-box app-layer">Your Application</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-layer">
              <div className="arch-box core-layer">dropjs</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-modules">
              <div className="arch-module">core</div>
              <div className="arch-module">api</div>
              <div className="arch-module">auth</div>
              <div className="arch-module">field</div>
            </div>

            <div className="arch-modules">
              <div className="arch-module">db</div>
              <div className="arch-module">migrate</div>
              <div className="arch-module">admin</div>
              <div className="arch-module">cli</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-modules-row">
              <div className="arch-module">SQLite</div>
              <div className="arch-module">MySQL / PostgreSQL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="quickstart" id="quickstart">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Quick Start</span>
            <h2 className="section-title">Up and running in seconds</h2>
            <p className="section-subtitle">
              Three commands. That's all it takes.
            </p>
          </div>

          <div className="quickstart-terminal">
            <div className="terminal-header">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="terminal-title">Terminal</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd">npx create-drop-app my-site</span>
              </div>
              <div className="terminal-line">
                <span className="output">Creating drop.js project in ./my-site...</span>
              </div>
              <div className="terminal-line">&nbsp;</div>
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd">cd my-site</span>
              </div>
              <div className="terminal-line">&nbsp;</div>
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="cmd">npx drop dev</span>
              </div>
              <div className="terminal-line">
                <span className="output">Server running at http://localhost:3000</span>
              </div>
              <div className="terminal-line">
                <span className="output">Admin UI at http://localhost:3000/admin</span>
              </div>
              <div className="terminal-line">
                <span className="output">API at http://localhost:3000/api</span>
              </div>
              <div className="terminal-line">
                <span className="output">Swagger docs at http://localhost:3000/api/docs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            Built by{' '}
            <a
              href="https://github.com/nextagencyio"
              target="_blank"
              rel="noopener noreferrer"
            >
              nextagencyio
            </a>
          </div>
          <ul className="footer-links">
            <li>
              <a
                href="https://github.com/nextagencyio/dropjs"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nextagencyio/dropjs/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Issues
              </a>
            </li>
          </ul>
          <div className="footer-note">
            ISC License &middot; drop.js is open source software
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
