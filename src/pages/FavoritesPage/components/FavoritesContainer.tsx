import Backend from '../../../lib/backend';
import LoadingIndicator from '../../../components/Loading';
import styles from '../../../styles/shared.module.css';

import FavoritesPresenter from './FavoritesPresenter';
import useFavorites from '../helpers/useFavorites';
import { redirectOnError } from '../../../components/shared/redirectOnError';
import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';

interface FavoritesContentProps {
  backend: Backend;
  setError: ErrorHandlerType;
}

export default function FavoritesContainer({
  setError,
  backend,
}: FavoritesContentProps) {
  const { loading, favorites, setFavorites, error } = useFavorites(backend);
  if (loading) return <LoadingIndicator />;

  if (error) {
    redirectOnError(error);
    return null;
  }

  return (
    <div className={styles.page}>
      <FavoritesPresenter
        favorites={favorites}
        setFavorites={setFavorites}
        setError={setError}
      />
    </div>
  );
}
