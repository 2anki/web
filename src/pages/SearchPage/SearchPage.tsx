/* eslint-disable no-console */
import React from 'react';
import SearchContainer from './components/SearchContainer';
import useNotionData from './helpers/useNotionData';
import ConnectNotion from './components/ConnectNotion';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../lib/backend/get2ankiApi';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import styles from '../../styles/shared.module.css';

interface SearchPageProps {
  setError: ErrorHandlerType;
}

export function SearchPage({ setError }: SearchPageProps) {
  const notionData = useNotionData(get2ankiApi());

  let content;
  if (notionData.loading) {
    content = (
      <div className={styles.textCenter}>
        <LoadingIndicator />
      </div>
    );
  } else if (notionData.error) {
    content = <ErrorPresenter error={notionData.error} />;
  } else if (!notionData.connected) {
    content = (
      <>
        <h1 className={`${styles.title} ${styles.textCenter}`}>
          Connect to Notion or Upload Manually
        </h1>
        <ConnectNotion
          ready={!notionData.connected}
          connectionLink={notionData.connectionLink}
        />
      </>
    );
  } else {
    content = <SearchContainer backend={get2ankiApi()} setError={setError} />;
  }

  return <div className={styles.page}>{content}</div>;
}
