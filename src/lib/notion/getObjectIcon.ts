import { ObjectIcon } from '../types';

export default function getObjectIcon(p: ObjectIcon): string {
  if (!p || !p.icon) {
    return '';
  }
  const iconType = p.icon.type;
  if (iconType === 'emoji') return p.icon.emoji as string;
  if (iconType === 'external') {
    return p.icon.external.url;
  }
  if (iconType === 'file') {
    return p.icon.file.url;
  }
  return '';
}
