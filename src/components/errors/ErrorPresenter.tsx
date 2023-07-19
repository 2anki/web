import { getErrorMessage } from './helpers/getErrorMessage';
import { useDismissed } from './helpers/useDismissed';

interface ErrorPresenterProps {
  error: unknown;
}

export function ErrorPresenter({ error }: ErrorPresenterProps) {
  const { dismissed, setDismissed } = useDismissed(error);

  if (!error || dismissed) {
    return null;
  }

  return (
    <div className="notification is-danger">
      <button
        aria-label="close"
        type="button"
        className="delete"
        onClick={() => setDismissed(true)}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
    </div>
  );
}
