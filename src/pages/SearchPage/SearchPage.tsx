import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import ConnectNotion from './components/ConnectNotion';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';

interface SearchPageProps {
  setError: ErrorHandlerType;
}

export function SearchPage({ setError }: SearchPageProps) {
  const notionData = useNotionData(get2ankiApi());
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
        backend={get2ankiApi()}
        setError={setError}
      />
    </>
  );
}
