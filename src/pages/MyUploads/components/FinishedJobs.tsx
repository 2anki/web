import UploadObjectEntry from './UploadObjectEntry';
import UserUpload from '../../../lib/interfaces/UserUpload';

interface Prop {
  uploads: UserUpload[] | undefined;
  deleteUpload: (key: string) => void;
}

export function FinishedJobs({uploads, deleteUpload}: Prop) {
  if (!uploads || uploads.length === 0) {
    return null;
  }

  return <>
    <h2 className="title is -2">Finished Jobs</h2>
    {uploads.map((u) => (
      <UploadObjectEntry
        data-hj-suppress
        size={`${u.size_mb ? u.size_mb.toFixed(2) : 0}`}
        key={u.key}
        title={u.filename}
        icon={null}
        url={`/api/download/u/${u.key}`}
        deleteUpload={() => deleteUpload(u.key)}
      />
    ))}
  </>
}
