import { useHistory } from 'react-router-dom';
import SearchBar from './SearchBar';
import NotionObject from '../../../lib/interfaces/NotionObject';
import ListSearchResults from './ListSearchResults';
import Favorites from './Favorites';
import useFavorites from '../helpers/useFavorites';
import Backend from '../../../lib/backend';
import { ErrorHandlerType } from '../../../components/errors/helpers/types';

interface SearchPresenterProps {
  inProgress: boolean;
  myPages: NotionObject[];
  setSearchQuery: (value: string) => void;
  triggerSearch: (force: boolean) => void;
  setError: ErrorHandlerType;
}

export default function SearchPresenter(props: SearchPresenterProps) {
  const history = useHistory();
  const { inProgress, myPages, setSearchQuery, triggerSearch, setError } =
    props;

  const [favorites, setFavorites] = useFavorites(new Backend());

  // TODO: replace this with react-router API
  return (
    <>
      <SearchBar
        inProgress={inProgress}
        onSearchQueryChanged={(s) => {
          history.push({
            pathname: '/search',
            search: `?q=${s}`
          });
          setSearchQuery(s);
        }}
        onSearchClicked={() => triggerSearch(false)}
      />
      <Favorites
        setError={setError}
        setFavorites={setFavorites}
        favorites={favorites}
      />
      <ListSearchResults
        setError={setError}
        setFavorites={setFavorites}
        results={myPages}
      />
    </>
  );
}
