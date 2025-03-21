/* eslint-disable no-console */
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
  console.log('[SearchPage] NotionData:', notionData);

  let content;
  if (notionData.loading) {
    console.log('[SearchPage] Showing loading state');
    content = (
      <div className="has-text-centered">
        <LoadingIndicator />
      </div>
    );
  } else if (notionData.error) {
    console.log('[SearchPage] Showing error state');
    content = <ErrorPresenter error={notionData.error} />;
  } else if (!notionData.connected) {
    console.log('[SearchPage] Showing not connected state');
    content = (
      <>
        <h1 className="title is-2 has-text-centered">
          Connect to Notion or Upload Manually
        </h1>
        <ConnectNotion
          ready={!notionData.connected}
          connectionLink={notionData.connectionLink}
        />
      </>
    );
  } else {
    console.log('[SearchPage] Showing search container');
    content = (
      <SearchContainer
        ready={notionData.connected}
        notionData={notionData}
        backend={get2ankiApi()}
        setError={setError}
      />
    );
  }

  return <div className="section">{content}</div>;
}
