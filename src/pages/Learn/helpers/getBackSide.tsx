import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

type BackSide = {
  backSide: string;
  loading: boolean;
};

export const getBackSide = (id: string | undefined): BackSide => {
  const [backSide, setBackSide] = useState('loading');
  const [loading, setLoading] = useState(false);
  const backend = new Backend();

  useEffect(() => {
    setLoading(true);
    if (id) {
      backend.renderBlock(id).then((response: unknown) => {
        const res = response as { data: string };
        setBackSide(res.data);
        setLoading(false);
      });
    }
  }, [id]);
  return { loading, backSide };
};
