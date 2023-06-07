import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import Backend from '../../lib/backend';
import ConnectNotion from './components/ConnectNotion';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/types';

interface SearchPageProps {
  setError: ErrorHandlerType;
}

const backend = new Backend();
export function SearchPage({ setError }: SearchPageProps) {
  const notionData = useNotionData(backend);
  if (notionData.loading) {
    return <LoadingIndicator />;
  }

  const { connected, connectionLink } = notionData;

  return (
    <>
      <ConnectNotion ready={!connected} connectionLink={connectionLink} />
      <SearchContainer
        ready={connected}
        notionData={notionData}
        backend={backend}
        setError={setError}
      />
    </>
  );
}
