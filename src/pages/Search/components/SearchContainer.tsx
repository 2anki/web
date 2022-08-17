import { PageContainer } from '../../../components/styled';
import Backend from '../../../lib/backend';
import LoadingPage from '../../Loading';

import { NotionData } from '../helpers/useNotionData';
import useSearchQuery from '../helpers/useSearchQuery';
import SearchPresenter from './SearchPresenter';
import WorkSpaceHeader from './WorkspaceHeader';

interface SearchContentProps {
  backend: Backend;
  notionData: NotionData;
}

export default function SearchContainer(props: SearchContentProps) {
  const { backend, notionData } = props;
  const { myPages, inProgress, triggerSearch, isLoading, setSearchQuery } =
    useSearchQuery(backend);

  if (isLoading) return <LoadingPage />;

  return (
    <PageContainer>
      <WorkSpaceHeader notionData={notionData} />
      <SearchPresenter
        myPages={myPages}
        inProgress={inProgress}
        setSearchQuery={setSearchQuery}
        triggerSearch={triggerSearch}
      />
    </PageContainer>
  );
}
