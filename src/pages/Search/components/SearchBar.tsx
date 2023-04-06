import { Button } from '@nordnet/ui';
import { SearchInput, SearchInputContainer } from './styled';
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
    <SearchInputContainer>
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
    </SearchInputContainer>
  );
}

export default SearchBar;
