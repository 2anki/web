import { getQueryValue } from '../helpers/getQueryValue';
import searchStyles from '../SearchPage.module.css';

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
    <div>
      <div className={searchStyles.searchLabel}>Search Notion</div>
      <input
        defaultValue={getQueryValue()}
        type="text"
        className={searchStyles.searchInput}
        placeholder="Start typing..."
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            onSearchClicked();
          }
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onSearchQueryChanged(event.target.value);
        }}
      />
      <div className={searchStyles.returnHint}>Results update as you type</div>
      {inProgress && (
        <div className={searchStyles.searchingIndicator}>
          <span className={searchStyles.searchingDot} />
          <span className={searchStyles.searchingDot} />
          Searching...
        </div>
      )}
    </div>
  );
}

export default SearchBar;
