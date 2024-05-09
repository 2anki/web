import { getErrorMessage } from './helpers/getErrorMessage';
import { useDismissed } from './helpers/useDismissed';
import { goToLoginPage } from '../../pages/RegisterPage/goToLoginPage';

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
      <div className="modal-background has-background-white" />
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
        <button type="button" className="button is-link" onClick={() => goToLoginPage()}>Login</button>
      </div>
    </div>
  );
}
