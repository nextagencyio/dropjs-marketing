import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { articles, getRelatedArticles } from '../data/articles';

const markdownModules = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
});

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const article = articles.find((a) => a.slug === slug);
  const related = slug ? getRelatedArticles(slug) : [];

  useEffect(() => {
    if (!slug) return;
    const path = `../content/articles/${slug}.md`;
    const loader = markdownModules[path];
    if (loader) {
      (loader() as Promise<string>).then((md) => {
        setContent(md);
        setLoading(false);
      });
    } else {
      setContent('Article not found.');
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="blog-page">
        <div className="container">
          <h1 className="section-title">Article not found</h1>
          <Link to="/blog" className="btn btn-secondary">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <div className="blog-post-header">
          <Link to="/blog" className="blog-back-link">&larr; Back to blog</Link>
          <span className="blog-card-category">{article.category}</span>
          <h1 className="blog-post-title">{article.title}</h1>
          <div className="blog-card-meta">
            <span>{article.date}</span>
            <span>&middot;</span>
            <span>{article.readTime}</span>
          </div>
        </div>

        {loading ? (
          <div className="blog-post-content"><p>Loading...</p></div>
        ) : (
          <div className="blog-post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {related.length > 0 && (
          <div className="blog-related">
            <h2 className="blog-related-title">Related articles</h2>
            <div className="blog-grid">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="blog-card">
                  <span className="blog-card-category">{r.category}</span>
                  <h3 className="blog-card-title">{r.title}</h3>
                  <p className="blog-card-excerpt">{r.excerpt}</p>
                  <div className="blog-card-meta">
                    <span>{r.date}</span>
                    <span>&middot;</span>
                    <span>{r.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
