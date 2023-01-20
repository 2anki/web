import UserUpload from '../../../lib/interfaces/UserUpload';

interface Prop {
  uploads: UserUpload[] | undefined;
  isDeletingAll: boolean;
  deleteAllUploads: () => void;
}

export function DeleteAllButton({
  uploads,
  isDeletingAll,
  deleteAllUploads,
}: Prop) {
  if (!uploads || uploads.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      title="Delete all"
      className={`button is-small ${isDeletingAll ? 'is-loading' : ''} `}
      onClick={() => {
        deleteAllUploads();
      }}
    >
      <i className="fa-solid fa-trash" />
    </button>
  );
}
