import { useEffect, useMemo, useState } from 'react';
import styles from './MarketplacePage.module.css';

interface PublicTemplate {
  id: string;
  ownerName: string;
  name: string;
  description: string;
  baseType: string;
  noteType: object;
  previewData: Record<string, string>;
  tags: string[];
  createdAt: string;
  rating?: number;
  downloadCount?: number;
}

const FILTER_CATEGORIES = [
  'All',
  'Basic',
  'Cloze',
  'Language',
  'Medical',
  'Programming',
  'Math',
  'Minimal',
];

const PLACEHOLDER_STATS: Record<
  string,
  { rating: number; downloadCount: number }
> = {
  Basic: { rating: 4.8, downloadCount: 1240 },
  'Modern Cloze': { rating: 4.7, downloadCount: 980 },
  'Vocabulary Builder': { rating: 4.6, downloadCount: 870 },
  'Medical Studies': { rating: 4.9, downloadCount: 1560 },
  Programming: { rating: 4.5, downloadCount: 720 },
  'Minimal Clean': { rating: 4.4, downloadCount: 650 },
  'Quote Card': { rating: 4.3, downloadCount: 430 },
  'Math & Science': { rating: 4.6, downloadCount: 810 },
};

function enrichTemplate(t: PublicTemplate): PublicTemplate {
  if (t.rating !== undefined && t.downloadCount !== undefined) return t;
  const stats = PLACEHOLDER_STATS[t.name] ?? {
    rating: 4.5,
    downloadCount: 100,
  };
  return {
    ...t,
    rating: t.rating ?? stats.rating,
    downloadCount: t.downloadCount ?? stats.downloadCount,
  };
}

async function downloadTemplate(template: PublicTemplate): Promise<void> {
  const response = await fetch('/api/templates/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      noteType: template.noteType,
      previewData: template.previewData,
    }),
  });

  if (!response.ok) throw new Error('Download failed');

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${template.name}.apkg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Stars({ rating }: Readonly<{ rating: number }>) {
  return <span className={styles.starRating}>★ {rating.toFixed(1)}</span>;
}

function TemplateCard({ template }: Readonly<{ template: PublicTemplate }>) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadTemplate(template);
    } catch {
      setDownloadError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardName}>{template.name}</h2>
      {template.description && (
        <p className={styles.cardDesc}>{template.description}</p>
      )}
      {template.tags && template.tags.length > 0 && (
        <div className={styles.cardTags}>
          {template.tags.map((tag) => (
            <span key={tag} className={styles.cardTag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className={styles.cardMeta}>
        <Stars rating={template.rating ?? 4.5} />
        <span>{(template.downloadCount ?? 0).toLocaleString()} downloads</span>
      </div>
      <button
        className={styles.downloadButton}
        onClick={handleDownload}
        disabled={downloading}
        aria-label={`Download ${template.name} as APKG`}
      >
        {downloading ? 'Downloading…' : 'Download APKG'}
      </button>
      {downloadError && <p className={styles.downloadError}>{downloadError}</p>}
    </div>
  );
}

function FeaturedCard({ template }: Readonly<{ template: PublicTemplate }>) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadTemplate(template);
    } catch {
      // silent
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.featuredCard}>
      <div className={styles.featuredLeft}>
        <span className={styles.featuredBadge}>★ Featured</span>
        <h2 className={styles.featuredName}>{template.name}</h2>
        {template.description && (
          <p className={styles.featuredDesc}>{template.description}</p>
        )}
        <div className={styles.featuredMeta}>
          <Stars rating={template.rating ?? 4.5} />
          <span>
            {(template.downloadCount ?? 0).toLocaleString()} downloads
          </span>
          {template.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className={styles.cardTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.featuredRight}>
        <button
          className={styles.downloadButtonFilled}
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Downloading…' : 'Download APKG'}
        </button>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetch('/api/templates/public')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load templates');
        return r.json();
      })
      .then((data: PublicTemplate[]) => setTemplates(data.map(enrichTemplate)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(
    () =>
      [...templates].sort(
        (a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0)
      )[0] ?? null,
    [templates]
  );

  const filtered = useMemo(() => {
    const rest = featured
      ? templates.filter((t) => t.id !== featured.id)
      : templates;
    if (activeFilter === 'All') return rest;
    const lower = activeFilter.toLowerCase();
    return rest.filter(
      (t) =>
        t.baseType?.toLowerCase() === lower ||
        t.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
        t.name.toLowerCase().includes(lower)
    );
  }, [templates, featured, activeFilter]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p>Loading templates…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Template marketplace</h1>
        <p className={styles.pageSubtitle}>
          Community-built Anki note types. Download any as a ready-to-import
          APKG.
        </p>

        <a
          className={styles.aiBanner}
          href="/templates"
          rel="noopener noreferrer"
        >
          <div className={styles.aiBannerIcon}>✦</div>
          <div className={styles.aiBannerText}>
            <div className={styles.aiBannerTitle}>
              Generate flashcards with Claude AI
            </div>
            <div className={styles.aiBannerDesc}>
              Paste any text and Claude creates a deck in seconds
            </div>
          </div>
          <span className={styles.aiBannerArrow}>›</span>
        </a>

        <div className={styles.filterBar}>
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterPill} ${
                activeFilter === cat ? styles.filterPillActive : ''
              }`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {!error && templates.length === 0 && (
          <div className={styles.emptyBox}>
            No templates have been shared yet. Be the first!
          </div>
        )}

        {featured && activeFilter === 'All' && (
          <FeaturedCard template={featured} />
        )}

        <div className={styles.grid}>
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}
