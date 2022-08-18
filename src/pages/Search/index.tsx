import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import Backend from '../../lib/backend';
import ConnectNotion from './components/ConnectNotion';
import LoadingPage from '../Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/types';

interface SearchPageProps {
  isPatron: boolean;
  setError: ErrorHandlerType;
}

const backend = new Backend();
function SearchPage({ isPatron, setError }: SearchPageProps) {
  const notionData = useNotionData(backend);
  if (notionData.loading) {
    return <LoadingPage />;
  }

  const { connected, connectionLink } = notionData;

  return (
    <>
      <NavigationBar isPatron={isPatron} />
      {!connected && <ConnectNotion connectionLink={connectionLink} />}
      {connected && (
        <SearchContainer
          notionData={notionData}
          backend={backend}
          setError={setError}
        />
      )}
    </>
  );
}

export default SearchPage;
