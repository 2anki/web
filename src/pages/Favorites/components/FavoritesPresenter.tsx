import { Dispatch, SetStateAction } from 'react';
import Favorites from './Favorites';
import { ErrorHandlerType } from '../../../components/errors/helpers/types';
import NotionObject from '../../../lib/interfaces/NotionObject';

interface Props {
  favorites: NotionObject[];
  setError: ErrorHandlerType;
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
}

export default function FavoritesPresenter({setError, setFavorites, favorites}: Props) {
  return (
    <div>
      <h3 className="title is-4">Your favorites</h3>
      <div className="box mt-4 mb-0">
        <Favorites
          setError={setError}
          setFavorites={setFavorites}
          favorites={favorites}
        />
      </div>
    </div>
  );
}
