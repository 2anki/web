import { ErrorHandlerType } from '../../../components/errors/helpers/getErrorMessage';
import Backend from '../../../lib/backend';

import { NotionData } from '../helpers/useNotionData';
import useSearchQuery from '../helpers/useSearchQuery';
import SearchPresenter from './SearchPresenter';
import WorkSpaceHeader from './WorkspaceHeader';

interface SearchContainerProps {
  notionData: NotionData;
  backend: Backend;
  setError: ErrorHandlerType;
}

export default function SearchContainer({
  notionData,
  backend,
  setError,
}: SearchContainerProps) {
  const { myPages, inProgress, triggerSearch, isLoading, setSearchQuery } =
    useSearchQuery(backend, setError);

  return (
    <>
      <WorkSpaceHeader notionData={notionData} />
      <SearchPresenter
        setError={setError}
        myPages={myPages}
        inProgress={isLoading || inProgress}
        setSearchQuery={setSearchQuery}
        triggerSearch={triggerSearch}
      />
    </>
  );
}
