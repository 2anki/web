import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen';
import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import Backend from '../../lib/Backend';
import ConnectNotion from './components/ConnectNotion';

interface SearchPageProps {
  isPatron: boolean;
}

const backend = new Backend();
function SearchPage({ isPatron }: SearchPageProps) {
  const notionData = useNotionData(backend);
  if (notionData.loading) {
    return <LoadingScreen />;
  }

  const { connected, connectionLink } = notionData;

  return (
    <>
      <NavigationBar isPatron={isPatron} />
      {!connected && <ConnectNotion connectionLink={connectionLink} />}
      {connected && <SearchContainer notionData={notionData} backend={backend} />}
    </>
  );
}

export default SearchPage;
