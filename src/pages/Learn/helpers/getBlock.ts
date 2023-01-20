import { ChildrenType } from '../types';

export const getBlock = (children: ChildrenType, index: number) => {
  if (!children) {
    return null;
  }
  return children[index];
};
