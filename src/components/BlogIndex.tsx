import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

export function BlogIndex() {
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <div className="blog-page">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Blog</span>
          <h1 className="section-title">Engineering blog</h1>
          <p className="section-subtitle">
            Guides, comparisons, and tutorials on headless CMS architecture, content management, and building with drop.js.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="blog-category">
            <h2 className="blog-category-title">{category}</h2>
            <div className="blog-grid">
              {articles
                .filter((a) => a.category === category)
                .map((article) => (
                  <Link
                    key={article.slug}
                    to={`/blog/${article.slug}`}
                    className="blog-card"
                  >
                    <span className="blog-card-category">{article.category}</span>
                    <h3 className="blog-card-title">{article.title}</h3>
                    <p className="blog-card-excerpt">{article.excerpt}</p>
                    <div className="blog-card-meta">
                      <span>{article.date}</span>
                      <span>&middot;</span>
                      <span>{article.readTime}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
