import { SearchInput } from './styled';
import { getQueryValue } from '../helpers/getQueryValue';
import styles from '../../../styles/shared.module.css';

interface SearchBarProps {
  onSearchQueryChanged: (query: string) => void;
  onSearchClicked: () => void;
  inProgress: boolean;
}

function SearchBar({
  onSearchQueryChanged,
  onSearchClicked,
  inProgress,
}: SearchBarProps) {
  return (
    <div className={styles.searchBarWrapper}>
      <div className={styles.searchBarGroup}>
        <div>
          <SearchInput
            defaultValue={getQueryValue()}
            type="text"
            placeholder="  🔍 🅰  📑 "
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                onSearchClicked();
              }
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onSearchQueryChanged(event.target.value);
            }}
          />
        </div>
        <div>
          <button
            type="button"
            onClick={onSearchClicked}
            className={styles.searchButton}
            disabled={inProgress}
          >
            {inProgress ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
