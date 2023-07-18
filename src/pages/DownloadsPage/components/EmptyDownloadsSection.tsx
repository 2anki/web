import UserUpload from '../../../lib/interfaces/UserUpload';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import { UploadContainer } from '../../UploadPage/styled';

interface Prop {
  hasActiveJobs: boolean;
  uploads: UserUpload[] | undefined;
}

export function EmptyDownloadsSection({ hasActiveJobs, uploads }: Prop) {
  if (hasActiveJobs || (uploads ?? []).length > 0) {
    return null;
  }
  return (
    <UploadContainer>
      {getVisibleText('downloads.empty')}
    </UploadContainer>
  );
}
