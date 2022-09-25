import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

type BackSide = {
  data: string;
};

export const getBackSide = (id: string | undefined) => {
  const backend = new Backend();
  const [backSide, setBackSide] = useState('loading');
  useEffect(() => {
    if (id) {
      backend.renderBlock(id).then((response: unknown) => {
        const res = response as BackSide;
        setBackSide(res.data);
      });
    }
  }, [id]);
  return backSide;
};
