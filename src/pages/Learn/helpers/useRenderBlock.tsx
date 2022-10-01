import { useEffect, useState } from 'react';
import Backend from '../../../lib/backend';

type BackSide = {
  frontSide: string;
  backSide: string;
  loading: boolean;
};

type RenderBlockResponse = {
  frontSide: string;
  backSide: string;
};

export const useRenderBlock = (id: string | undefined): BackSide => {
  const [backSide, setBackSide] = useState('loading');
  const [frontSide, setFrontSide] = useState('loading');
  const [loading, setLoading] = useState(false);
  const backend = new Backend();

  useEffect(() => {
    setLoading(true);
    if (id) {
      backend.renderBlock(id).then((response: unknown) => {
        const res = response as RenderBlockResponse;
        if (res) {
          setBackSide(res.backSide);
          setFrontSide(res.frontSide);
          setLoading(false);
        }
      });
    }
  }, [id]);
  return { loading, backSide, frontSide };
};
