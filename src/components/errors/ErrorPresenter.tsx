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
    <article className="message is-info is-large">
      <div className="message-body">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
      </div>
      <div className="field is-grouped p-4 is-flex is-align-items-center is-justify-content-center">
        <p className="control">
          <button type="button" className="button" onClick={() => setDismissed(true)}>Close</button>
        </p>
      </div>
    </article>
  );
}
