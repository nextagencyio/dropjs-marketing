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
            The CMS framework for{' '}
            <span className="gradient-text">the AI era</span>
          </h1>
          <p className="hero-subtitle">
            Define content types in JSON, get a full REST API instantly.
            Built on Node.js with Drupal's best ideas, designed for AI-assisted development.
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

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to build content-driven apps</h2>
            <p className="section-subtitle">
              A complete CMS framework with an entity/field system, auto-generated APIs, and first-class AI support.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon cyan">{'{}'}</div>
              <h3>Entity/Field System</h3>
              <p>
                Define content types with configurable fields in simple JSON.
                12 built-in field types including text, number, reference, file, and more.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <span>DB</span>
              </div>
              <h3>Database Agnostic</h3>
              <p>
                SQLite for development, MySQL or PostgreSQL for production.
                Switch databases without changing a line of application code.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">/</div>
              <h3>Auto-Generated API</h3>
              <p>
                Every entity type automatically gets full REST endpoints --
                list, get, create, update, and delete -- with zero configuration.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">
                <span>&rarr;</span>
              </div>
              <h3>Drupal Migration</h3>
              <p>
                Drupal-compatible multi-table storage means seamless migration.
                Analyze, generate schemas, and migrate content with a single CLI command.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon pink">AI</div>
              <h3>AI-Native Development</h3>
              <p>
                Every API surface designed to be discoverable and operable by AI coding agents.
                Built for the era of AI-assisted development.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon cyan">
                <span>&#x1f512;</span>
              </div>
              <h3>Auth &amp; Permissions</h3>
              <p>
                Role-based access control, session management, password reset,
                and first-user auto-admin. Secure by default, extensible by design.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <span>&#x2699;</span>
              </div>
              <h3>Admin UI</h3>
              <p>
                Built-in React admin panel for managing content, content types,
                taxonomy, users, and roles — no custom code required.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                <span>&#x21c4;</span>
              </div>
              <h3>Webhooks</h3>
              <p>
                Register HTTP callbacks for entity lifecycle events.
                Get notified on create, update, and delete via your own endpoints.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">
                <span>&#x26a1;</span>
              </div>
              <h3>Event System</h3>
              <p>
                Async event bus with priority-ordered hooks. React to presave, insert,
                update, delete, and query events across all entity types.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon cyan">
                <span>&#x25b6;</span>
              </div>
              <h3>Taxonomy System</h3>
              <p>
                Vocabularies with hierarchical terms, tree API, content counts,
                and drag-to-reorder — all managed from the admin UI or REST API.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <span>&#x21ba;</span>
              </div>
              <h3>Revision History</h3>
              <p>
                Built-in content versioning. List, load, revert, and diff between
                revisions — every save is tracked automatically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                <span>&#x25a3;</span>
              </div>
              <h3>File Uploads</h3>
              <p>
                Upload API with media library and auto-generated image styles —
                thumbnail, medium, and large — powered by sharp.
              </p>
            </div>
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
              A JSON content type definition gives you entities, fields, validation, API endpoints, and admin UI.
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
<span className="syn-keyword">import</span> {'{'} <span className="syn-type">Entity</span> {'}'} <span className="syn-keyword">from</span> <span className="syn-string">'@dropjs/core'</span><span className="syn-punctuation">;</span>
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
            <h2 className="section-title">Modular by design</h2>
            <p className="section-subtitle">
              Use only what you need. Every package is independently installable and composable.
            </p>
          </div>

          <div className="arch-diagram">
            <div className="arch-layer">
              <div className="arch-box app-layer">Your Application</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-layer">
              <div className="arch-box api-layer">@dropjs/api &middot; @dropjs/admin &middot; @dropjs/cli</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-modules">
              <div className="arch-module">@dropjs/auth</div>
              <div className="arch-module">@dropjs/field</div>
              <div className="arch-module">@dropjs/migrate</div>
              <div className="arch-module">@dropjs/db</div>
            </div>

            <div className="arch-connector">|</div>

            <div className="arch-layer">
              <div className="arch-box core-layer">@dropjs/core</div>
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
