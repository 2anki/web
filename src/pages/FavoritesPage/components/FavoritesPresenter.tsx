import { Dispatch, SetStateAction } from 'react';
import Favorites from './Favorites';

import { ErrorHandlerType } from '../../../components/errors/helpers/types';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { EmptyStateFigure } from './EmptyStateFigure';

interface Props {
  favorites: NotionObject[];
  setError: ErrorHandlerType;
  setFavorites: Dispatch<SetStateAction<NotionObject[]>>;
}

export default function FavoritesPresenter({
  setError,
  setFavorites,
  favorites
}: Props) {
  if (favorites.length === 0) {
    return <EmptyStateFigure />;
  }
  return (
    <Favorites
      setError={setError}
      setFavorites={setFavorites}
      favorites={favorites}
    />
  );
}
