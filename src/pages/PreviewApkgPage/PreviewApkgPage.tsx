import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { SkeletonList } from '../../components/Skeleton/Skeleton';
import sharedStyles from '../../styles/shared.module.css';
import styles from './PreviewApkgPage.module.css';
import {
  useApkgPreviewMeta,
  useApkgPreviewStream,
} from './useApkgPreviewStream';
import { CardFrame } from './CardFrame';

interface PreviewApkgPageProps {
  setError: ErrorHandlerType;
}

export default function PreviewApkgPage({
  setError,
}: Readonly<PreviewApkgPageProps>) {
  const { key } = useParams<{ key: string }>();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const meta = useApkgPreviewMeta(key);
  const stream = useApkgPreviewStream(key);

  useEffect(() => {
    const firstError = stream.error ?? meta.error;
    if (firstError) setError(firstError);
  }, [stream.error, meta.error, setError]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          stream.hasNextPage &&
          !stream.isFetchingNextPage
        ) {
          stream.fetchNextPage();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [stream]);

  const cards = useMemo(
    () => stream.data?.pages.flatMap((page) => page.cards) ?? [],
    [stream.data]
  );

  if (!key) {
    return (
      <div className={sharedStyles.page}>
        <p className={styles.empty}>Missing upload id.</p>
      </div>
    );
  }

  const fatal = stream.error && !stream.data;
  if (fatal) {
    return (
      <div className={sharedStyles.page}>
        <header className={sharedStyles.pageHeader}>
          <Link to="/downloads" className={styles.backLink}>
            ← Back to downloads
          </Link>
          <h1 className={sharedStyles.title}>Preview</h1>
        </header>
        <ErrorPresenter
          error={stream.error as Error}
          onRetry={() => stream.refetch()}
        />
      </div>
    );
  }

  const total = meta.data?.totalCards ?? stream.data?.pages[0]?.total;
  const loadedCount = cards.length;

  return (
    <div className={sharedStyles.page}>
      <header className={sharedStyles.pageHeader}>
        <Link to="/downloads" className={styles.backLink}>
          ← Back to downloads
        </Link>
        <h1 className={sharedStyles.title} data-hj-suppress>
          Deck preview
        </h1>
        <p className={styles.summary}>
          {meta.data?.deckNames.length
            ? `${meta.data.deckNames.join(', ')} · `
            : ''}
          {total != null
            ? `${loadedCount} of ${total} cards loaded`
            : 'Loading…'}
        </p>
      </header>

      {stream.isLoading && cards.length === 0 ? (
        <SkeletonList count={4} />
      ) : (
        <div className={styles.cards}>
          {cards.length === 0 && (
            <p className={styles.empty}>This deck has no cards to preview.</p>
          )}
          {cards.map((card) => (
            <CardFrame key={card.id} card={card} />
          ))}
        </div>
      )}

      <div
        ref={sentinelRef}
        className={styles.sentinel}
        aria-hidden="true"
      />

      {stream.isFetchingNextPage && (
        <div className={styles.loadingRow}>Loading more…</div>
      )}
    </div>
  );
}
