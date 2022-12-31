import { useEffect, useState } from "react";
import Backend from "../../../lib/backend";

type RenderedBlock = {
  html: string;
  loading: boolean;
};

type RenderBlockResponse = {
  html: string;
};

export const useRenderBlock = (
  id: string | undefined,
  refetch: boolean
): RenderedBlock => {
  const [html, setHTML] = useState("loading")
  const [loading, setLoading] = useState(false);
  const backend = new Backend();

  useEffect(() => {
    setLoading(true);
    if (id) {
      backend.renderBlock(id).then((response: unknown) => {
        const res = response as RenderBlockResponse;
        if (res) {
          setHTML(res.html)
          setLoading(false);
        }
      });
    }
  }, [id, refetch]);
  return { loading, html };
};
