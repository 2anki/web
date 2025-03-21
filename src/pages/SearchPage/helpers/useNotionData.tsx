import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

export interface NotionData {
  loading: boolean;
  workSpace: string | null;
  connected: boolean;
  connectionLink: string;
  error?: Error;
}

export default function useNotionData(backend: Backend): NotionData {
  const [state, setState] = useState<NotionData>(() => ({
    loading: true,
    workSpace: localStorage.getItem('__workspace'),
    connected: false,
    connectionLink: '',
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await backend.getNotionConnectionInfo();
        const newState = {
          loading: false,
          connected: data.isConnected ?? true,
          connectionLink: data.link,
          workSpace: data.workspace,
        };
        setState(newState);
      } catch (err) {
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
