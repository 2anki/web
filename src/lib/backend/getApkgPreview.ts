import { get } from './api';

export interface ApkgPreviewCard {
  id: number;
  ord: number;
  templateName: string;
  deckName: string;
  noteTypeName: string;
  css: string;
  front: string;
  back: string;
}

export interface ApkgPreviewBatch {
  cards: ApkgPreviewCard[];
  nextCursor: number | null;
  total: number;
}

export interface ApkgPreviewMeta {
  totalCards: number;
  deckNames: string[];
}

export async function getApkgPreviewMeta(
  key: string
): Promise<ApkgPreviewMeta> {
  const url = `/api/apkg/${encodeURIComponent(key)}/meta`;
  return (await get(url)) as ApkgPreviewMeta;
}

export async function getApkgPreviewBatch(
  key: string,
  cursor: number | null,
  pageSize = 20
): Promise<ApkgPreviewBatch> {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', String(cursor));
  params.set('page_size', String(pageSize));
  const url = `/api/apkg/${encodeURIComponent(key)}/cards?${params.toString()}`;
  return (await get(url)) as ApkgPreviewBatch;
}
