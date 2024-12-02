import UserUpload from '../../../lib/interfaces/UserUpload';

interface Prop {
  uploads: UserUpload[] | undefined;
  deleteUpload: (key: string) => void;
}

export function FinishedJobs({ uploads, deleteUpload }: Prop) {
  if (!uploads || uploads.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <h2 className="title is-4 mt-5 is-flex is-align-items-center">
        <img
          src="/icons/Anki_app_logo.png"
          alt="Anki Logo"
          width="32px"
          className="mr-2"
        />
        Available Anki Flashcard Decks
      </h2>
      <p className="mb-4">
        Below is a list of Anki Flashcard Deck files that have been successfully
        generated and are ready for download.
      </p>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th className="is-narrow">Actions</th>
            <th>Name</th>
            <th className="is-narrow">Download</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((u) => (
            <tr key={u.key}>
              <td>
                <button
                  type="button"
                  onClick={() => deleteUpload(u.key)}
                  className="button is-small is-danger is-light"
                >
                  Delete
                </button>
              </td>
              <td data-hj-suppress>{u.filename}</td>
              <td>
                <a
                  href={`/api/download/u/${u.key}`}
                  className="button is-small is-info is-light"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
