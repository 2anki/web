import { captureException } from '@sentry/react';
import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

export interface NotionData {
  loading: boolean;
  workSpace: string | null;
  connected: boolean;
  connectionLink: string;
}

export default function useNotionData(backend: Backend): NotionData {
  const [connectionLink, updateConnectionLink] = useState('');
  const [connected, updateConnected] = useState(false);
  const [workSpace, setWorkSpace] = useState<string | null>(
    localStorage.getItem('__workspace')
  );

  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    backend
      .getNotionConnectionInfo()
      .then((response) => {
        const { data } = response;
        if (data && !data.isConnected) {
          updateConnectionLink(data.link);
          updateConnected(data.isConnected);
        } else {
          updateConnectionLink(data.link);
          updateConnected(true);
        }
        setWorkSpace(data.workspace);
        setIsLoading(false);
      })
      .catch((error) => {
        captureException(error);
        window.location.href = '/login#login';
      });
  }, []);

  return {
    loading,
    workSpace,
    connected,
    connectionLink
  };
}
