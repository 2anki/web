import FavoritesContainer from './components/FavoritesContainer';
import Backend from '../../lib/backend';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';

interface FavoritesPageProps {
  setError: ErrorHandlerType;
}

const backend = new Backend();

export function FavoritesPage({ setError }: FavoritesPageProps) {
  return <FavoritesContainer backend={backend} setError={setError} />;
}
