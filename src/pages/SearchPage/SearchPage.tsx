import React from 'react';
import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import ConnectNotion from './components/ConnectNotion';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';

interface SearchPageProps {
  setError: ErrorHandlerType;
}

export function SearchPage({ setError }: SearchPageProps) {
  const notionData = useNotionData(get2ankiApi());
  const { connected, connectionLink, error } = notionData;

  let content;
  if (notionData.loading) {
    content = (
      <div className="has-text-centered">
        <LoadingIndicator />
      </div>
    );
  } else if (error) {
    content = <ErrorPresenter error={error} />;
  } else if (!connected) {
    content = (
      <>
        <h1 className="title is-2 has-text-centered">
          Connect to Notion or Upload Manually
        </h1>
        <ConnectNotion ready={!connected} connectionLink={connectionLink} />
      </>
    );
  } else {
    content = (
      <SearchContainer
        ready={connected}
        notionData={notionData}
        backend={get2ankiApi()}
        setError={setError}
      />
    );
  }

  return <div className="section">{content}</div>;
}
