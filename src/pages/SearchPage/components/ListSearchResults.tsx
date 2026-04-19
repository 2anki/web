import { Dispatch, SetStateAction } from 'react';
import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import NotionObject from '../../../lib/interfaces/NotionObject';
import SearchObjectEntry from './SearchObjectEntry';
import styles from '../../../styles/shared.module.css';

interface ListSearchResultsProps {
  results: NotionObject[];
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
  handleEmpty?: boolean;
  setError: ErrorHandlerType;
  searchQuery?: string;
  workSpace?: string | null;
}

export default function ListSearchResults(
  props: ListSearchResultsProps
): React.ReactNode {
  const {
    results,
    handleEmpty = true,
    setFavorites,
    setError,
    searchQuery,
    workSpace,
  } = props;
  const isEmpty = results.length < 1;

  if (isEmpty && handleEmpty) {
    const scope = workSpace ? `in “${workSpace}”` : 'in your Notion workspace';
    const headline = searchQuery
      ? `No pages match “${searchQuery}” ${scope}`
      : `No pages found ${scope}`;
    return (
      <div className={styles.emptyState}>
        <p>{headline}</p>
        <p className={styles.secondaryText}>
          Try a different search term, or make sure the page is shared with
          the 2anki integration — see{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.notion.so/help/guides/understanding-notions-sharing-settings"
          >
            Notion's sharing settings
          </a>
          .
        </p>
      </div>
    );
  }
  return (
    <>
      {results.map((p) => (
        <SearchObjectEntry
          setError={setError}
          setFavorites={setFavorites}
          isFavorite={p.isFavorite}
          type={p.object}
          key={p.url}
          title={p.title}
          icon={p.icon}
          url={p.url}
          id={p.id}
        />
      ))}
    </>
  );
}
