import { PartialBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { renderContent } from '../helpers/renderContent';
import { Box, LoadingBox } from './styled';

interface MainContentProps {
  loading: boolean;
  block: PartialBlockObjectResponse | null;
  frontSide: string | null;
  backSide: string | null;
}

export function MainContent(props: MainContentProps) {
  const { loading, block, frontSide, backSide } = props;
  if (!block || loading) {
    return <LoadingBox />;
  }

  return (
    <Box id="main-content">
      {frontSide && renderContent(frontSide)}
      {backSide && renderContent(backSide)}
    </Box>
  );
}
