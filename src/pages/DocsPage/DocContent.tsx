import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { loadDoc } from './loader';
import { findAdjacent } from './sidebar';
import styles from './DocsPage.module.css';

interface DocContentProps {
  slug: string;
}

function isExternal(href: string) {
  return /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:');
}

export function DocContent({ slug }: Readonly<DocContentProps>) {
  const doc = loadDoc(slug);
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }, [slug, hash]);

  const { prev, next } = useMemo(() => findAdjacent(slug), [slug]);

  if (!doc) {
    return (
      <article className={styles.article}>
        <h1>Not found</h1>
        <p>
          The page you are looking for does not exist.{' '}
          <Link to="/documentation">Back to documentation</Link>.
        </p>
      </article>
    );
  }

  const { frontmatter, body } = doc;

  return (
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        {frontmatter.title && (
          <h1 className={styles.articleTitle}>{frontmatter.title}</h1>
        )}
        {frontmatter.description && (
          <p className={styles.articleDescription}>{frontmatter.description}</p>
        )}
      </header>

      <div className={styles.markdown}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
          components={{
            a: ({ href, children, ...rest }) => {
              if (!href) return <a {...rest}>{children}</a>;
              if (isExternal(href)) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...rest}
                  >
                    {children}
                  </a>
                );
              }
              const to = href.startsWith('/')
                ? `/documentation${href.replace(/\/$/, '')}`
                : href;
              return (
                <a
                  href={to}
                  onClick={(e) => {
                    if (
                      e.defaultPrevented ||
                      e.button !== 0 ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.altKey
                    )
                      return;
                    e.preventDefault();
                    navigate(to);
                  }}
                  {...rest}
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {body}
        </ReactMarkdown>
      </div>

      <nav className={styles.pager} aria-label="Pager">
        {prev ? (
          <Link to={`/documentation/${prev.slug}`} className={styles.pagerPrev}>
            <span className={styles.pagerLabel}>Previous</span>
            <span className={styles.pagerTitle}>{prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/documentation/${next.slug}`} className={styles.pagerNext}>
            <span className={styles.pagerLabel}>Next</span>
            <span className={styles.pagerTitle}>{next.label}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
