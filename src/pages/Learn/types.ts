import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export type ChildrenType = Array<
  PartialBlockObjectResponse | BlockObjectResponse
> | null;

export type BlockType = PartialBlockObjectResponse | BlockObjectResponse | null;
