import { Button } from '@nordnet/ui';
import { SearchInput } from './styled';
import { getQueryValue } from '../helpers/getQueryValue';

interface SearchBarProps {
  onSearchQueryChanged: (query: string) => void;
  onSearchClicked: () => void;
  inProgress: boolean;
}

function SearchBar({
  onSearchQueryChanged,
  onSearchClicked,
  inProgress
}: SearchBarProps) {
  return (
    <div className="my-1 mt-4 has-text-centered is-flex is-justify-content-center">
      <div className="field has-addons">
        <SearchInput
          defaultValue={getQueryValue()}
          className="input"
          type="text"
          placeholder="  🔍 🅰  📑 "
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchClicked();
            }
          }}
          onChange={(event) => {
            onSearchQueryChanged(event.target.value);
          }}
        />
        <Button type="button" onClick={onSearchClicked} loading={inProgress}>
          Search
        </Button>
      </div>
    </div>
  );
}

export default SearchBar;
