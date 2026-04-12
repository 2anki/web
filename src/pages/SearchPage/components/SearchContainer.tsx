import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import Backend from '../../../lib/backend';

import useSearchQuery from '../helpers/useSearchQuery';
import SearchPresenter from './SearchPresenter';

interface SearchContainerProps {
  backend: Backend;
  setError: ErrorHandlerType;
}

export default function SearchContainer({
  backend,
  setError,
}: SearchContainerProps) {
  const { myPages, inProgress, triggerSearch, isLoading, setSearchQuery } =
    useSearchQuery(backend, setError);

  return (
    <SearchPresenter
      setError={setError}
      myPages={myPages}
      inProgress={isLoading || inProgress}
      setSearchQuery={setSearchQuery}
      triggerSearch={triggerSearch}
    />
  );
}
