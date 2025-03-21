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
  const [state, setState] = useState<NotionData>({
    loading: true,
    workSpace: localStorage.getItem('__workspace'),
    connected: false,
    connectionLink: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log('[useNotionData] Starting data fetch');
      try {
        console.log('[useNotionData] Calling getNotionConnectionInfo');
        const data = await backend.getNotionConnectionInfo();
        console.log('[useNotionData] Received data:', data);

        setState((prev) => ({
          ...prev,
          loading: false,
          connected: data.isConnected ?? true,
          connectionLink: data.link,
          workSpace: data.workspace,
        }));

        console.log('[useNotionData] State updated with:', {
          connected: data.isConnected ?? true,
          connectionLink: data.link,
          workSpace: data.workspace,
        });
      } catch (err) {
        console.error('[useNotionData] Error:', err);
        setState((prev) => ({
          ...prev,
          loading: false,
          connected: false,
          error: err as Error,
        }));
      }
    };

    fetchData();
  }, []);

  return state;
}
