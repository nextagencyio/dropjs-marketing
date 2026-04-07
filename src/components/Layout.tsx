import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isBlog = location.pathname.startsWith('/blog');

  return (
    <>
      <nav className="nav">
        <div className="container">
          <Link to="/" className="nav-logo">
            <img src="/logo-transparent.png" alt="drop.js" className="nav-logo-img" />
          </Link>
          <ul className="nav-links">
            {isBlog ? (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><a href="https://github.com/nextagencyio/dropjs#readme" target="_blank" rel="noopener noreferrer">Docs</a></li>
                <li><a href="https://github.com/nextagencyio/dropjs" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </>
            ) : (
              <>
                <li><a href="#features">Features</a></li>
                <li><a href="#code">Code</a></li>
                <li><a href="#architecture">Architecture</a></li>
                <li><a href="#quickstart">Quick Start</a></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><a href="https://github.com/nextagencyio/dropjs#readme" target="_blank" rel="noopener noreferrer">Docs</a></li>
                <li><a href="https://github.com/nextagencyio/dropjs" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {children}

      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            Built by{' '}
            <a href="https://github.com/nextagencyio" target="_blank" rel="noopener noreferrer">
              nextagencyio
            </a>
          </div>
          <ul className="footer-links">
            <li><a href="https://github.com/nextagencyio/dropjs" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://github.com/nextagencyio/dropjs/issues" target="_blank" rel="noopener noreferrer">Issues</a></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
          <div className="footer-note">
            MIT License &middot; drop.js is open source software
          </div>
        </div>
      </footer>
    </>
  );
}
