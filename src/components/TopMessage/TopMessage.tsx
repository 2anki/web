import useQuery from '../../lib/hooks/useQuery';

function TopMessage() {
  const query = useQuery();
  const errorMessage = query.get('error');

  if (errorMessage === 'upload_limit_exceeded') {
    return (
      <div
        className="notification is-danger column is-light"
      >
        <p className="is-size-7">
          You have reached the upload limit of 100 flashcards.
        </p>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div
        className="notification is-danger column is-light"
      >
        <p className="is-size-7">
          {errorMessage}
        </p>
      </div>
    );
  }

  return null;
}

export default TopMessage;
