import { ErrorHandlerType } from '../../../components/errors/helpers/types';
import { PageContainer } from '../../../components/styled';
import Backend from '../../../lib/backend';
import LoadingPage from '../../Loading';

import FavoritesPresenter from './FavoritesPresenter';
import useFavorites from '../helpers/useFavorites';

interface FavoritesContentProps {
  backend: Backend;
  setError: ErrorHandlerType;
}

export default function FavoritesContainer({ setError, backend }: FavoritesContentProps) {
  const [isLoading, favorites, setFavorites] = useFavorites(backend);
  if (isLoading) return <LoadingPage />;

  return (
    <PageContainer>
      <FavoritesPresenter
        favorites={favorites}
        setFavorites={setFavorites}
        setError={setError}
      />
    </PageContainer>
  );
}
