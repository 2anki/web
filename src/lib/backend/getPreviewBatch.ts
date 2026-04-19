import { get } from './api';

export interface PreviewBlock {
  id: string;
  type: string;
  html: string;
}

export interface PreviewBatch {
  blocks: PreviewBlock[];
  nextCursor: string | null;
  hasMore: boolean;
  pageTitle?: string;
  pageUrl?: string | null;
}

export const getPreviewBatch = async (
  pageId: string,
  cursor?: string | null
): Promise<PreviewBatch> => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  const qs = params.toString();
  const url = `/api/notion/preview/${encodeURIComponent(pageId)}${
    qs ? `?${qs}` : ''
  }`;
  const data = await get(url);
  return data as PreviewBatch;
};
