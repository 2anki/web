import { useHistory } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';
import SearchBar from './SearchBar';
import NotionObject from '../../../lib/interfaces/NotionObject';
import ListSearchResults from './ListSearchResults';
import Favorites from './Favorites';
import useFavorites from '../helpers/useFavorites';
import Backend from '../../../lib/Backend';

interface SearchPresenterProps {
  inProgress: boolean;
  myPages: NotionObject[];
  setSearchQuery: Dispatch<SetStateAction<string>>;
  triggerSearch: (force: boolean) => void;
}

export default function SearchPresenter(props: SearchPresenterProps) {
  const history = useHistory();
  const {
    inProgress, myPages, setSearchQuery, triggerSearch,
  } = props;

  const [favorites, setFavorites] = useFavorites(new Backend());

  return (
    <>
      <SearchBar
        inProgress={inProgress}
        onSearchQueryChanged={(s) => {
          history.push({
            pathname: '/search',
            search: `?q=${s}`,
          });
          setSearchQuery(s);
        }}
        onSearchClicked={() => triggerSearch(false)}
      />
      <Favorites setFavorites={setFavorites} favorites={favorites} />
      <ListSearchResults setFavorites={setFavorites} results={myPages} />
    </>
  );
}
