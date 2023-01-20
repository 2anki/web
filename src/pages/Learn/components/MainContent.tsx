import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { renderContent } from '../helpers/renderContent';
import { Box, LoadingBox } from './styled';

interface MainContentProps {
  loading: boolean;
  block: PartialBlockObjectResponse | null;
  html: string | null;
}

export function MainContent(props: MainContentProps) {
  const { loading, block, html } = props;
  if (!block || loading) {
    return <LoadingBox />;
  }

  return <Box id="main-content">{html && renderContent(html)}</Box>;
}
