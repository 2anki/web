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
}

export default function ListSearchResults(
  props: ListSearchResultsProps
): React.ReactNode {
  const { results, handleEmpty, setFavorites, setError } = props;
  const isEmpty = results.length < 1;

  if (isEmpty && handleEmpty) {
    return (
      <div className={styles.textCenter}>
        <div className={styles.secondaryText}>
          No search results, try typing something above 👌🏾 Also ensure you{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.notion.so/help/guides/understanding-notions-sharing-settings"
          >
            understand notions sharing settings
          </a>
        </div>
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

ListSearchResults.defaultProps = {
  handleEmpty: true,
};
