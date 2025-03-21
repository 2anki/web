import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

/* eslint-disable no-console */

export interface NotionData {
  loading: boolean;
  workSpace: string | null;
  connected: boolean;
  connectionLink: string;
  error?: Error;
}

export default function useNotionData(backend: Backend): NotionData {
  const [connectionLink, updateConnectionLink] = useState('');
  const [connected, updateConnected] = useState(false);
  const [workSpace, setWorkSpace] = useState<string | null>(
    localStorage.getItem('__workspace')
  );
  const [error, setError] = useState<Error>();
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('[useNotionData] Starting data fetch');
      try {
        console.log('[useNotionData] Calling getNotionConnectionInfo');
        const data = await backend.getNotionConnectionInfo();
        console.log('[useNotionData] Received data:', data);

        if (data && !data.isConnected) {
          console.log('[useNotionData] Not connected, updating link');
          updateConnectionLink(data.link);
          updateConnected(data.isConnected);
        } else {
          console.log('[useNotionData] Connected, updating state');
          updateConnectionLink(data.link);
          updateConnected(true);
        }
        console.log('[useNotionData] Setting workspace:', data.workspace);
        setWorkSpace(data.workspace);
      } catch (err) {
        console.error('[useNotionData] Error fetching data:', err);
        setError(err as Error);
        updateConnected(false);
      } finally {
        console.log(
          '[useNotionData] Finishing fetch, setting loading to false'
        );
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      console.log('[useNotionData] Cleanup');
    };
  }, []);

  return {
    loading,
    workSpace,
    connected,
    connectionLink,
    error,
  };
}
