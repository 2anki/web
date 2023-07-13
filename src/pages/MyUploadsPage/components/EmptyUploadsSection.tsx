import UserUpload from '../../../lib/interfaces/UserUpload';
import { UploadContainer } from '../../UploadPage/styled';

interface Prop {
  hasActiveJobs: boolean;
  uploads: UserUpload[] | undefined;
}

export function EmptyUploadsSection({ hasActiveJobs, uploads }: Prop) {
  if (hasActiveJobs || (uploads ?? []).length > 0) {
    return null;
  }
  return (
    <UploadContainer>
      <p>
        You have no uploads! Make some from the{' '}
        <u>
          <a href="/search">search</a>
        </u>{' '}
        page.
      </p>
    </UploadContainer>
  );
}
