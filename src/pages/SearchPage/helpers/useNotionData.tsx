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
  console.log('[useNotionData] Hook initialized');
  const [state, setState] = useState<NotionData>(() => {
    console.log('[useNotionData] Initial state');
    return {
      loading: true,
      workSpace: localStorage.getItem('__workspace'),
      connected: false,
      connectionLink: '',
    };
  });

  useEffect(() => {
    console.log('[useNotionData] Current state:', state);
    const fetchData = async () => {
      console.log('[useNotionData] Starting data fetch');
      try {
        console.log('[useNotionData] Calling getNotionConnectionInfo');
        const data = await backend.getNotionConnectionInfo();
        console.log('[useNotionData] Received data:', data);

        const newState = {
          loading: false,
          connected: data.isConnected ?? true,
          connectionLink: data.link,
          workSpace: data.workspace,
        };
        console.log('[useNotionData] Setting new state:', newState);

        setState(newState);
      } catch (err) {
        console.error('[useNotionData] Error:', err);
        setState({
          loading: false,
          connected: false,
          connectionLink: '',
          workSpace: null,
          error: err as Error,
        });
      }
    };

    if (state.loading) {
      fetchData();
    }
  }, [state.loading]);

  return state;
}
