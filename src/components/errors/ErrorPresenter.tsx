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
    <div className={`modal ${dismissed ? '' : 'is-active'}`}>
      <div className="modal-background has-background-black" />
      <div className="modal-content">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="modal-close is-large" aria-label="close" />
      <div className="buttons my-2">
        <button type="button" className="button" onClick={() => setDismissed(true)}>Close</button>
      </div>
    </div>
  );
}
