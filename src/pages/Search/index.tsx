import NavigationBar from '../../components/NavigationBar/NavigationBar';
import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import Backend from '../../lib/backend';
import ConnectNotion from './components/ConnectNotion';
import LoadingPage from '../Loading';

interface SearchPageProps {
  isPatron: boolean;
}

const backend = new Backend();
function SearchPage({ isPatron }: SearchPageProps) {
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
        <SearchContainer notionData={notionData} backend={backend} />
      )}
    </>
  );
}

export default SearchPage;
