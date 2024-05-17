import { Dispatch, SetStateAction } from 'react';
import Favorites from './Favorites';

import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import NotionObject from '../../../lib/interfaces/NotionObject';
import { UploadContainer } from '../../UploadPage/styled';
import { getVisibleText } from '../../../lib/text/getVisibleText';

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
    return <UploadContainer>{getVisibleText('favorites.empty')}</UploadContainer>;
  }
  return (
    <Favorites
      setError={setError}
      setFavorites={setFavorites}
      favorites={favorites}
    />
  );
}
