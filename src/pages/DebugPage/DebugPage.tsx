import { useState } from 'react';
import { getKeys } from './helpers/getKeys';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';

export function DebugPage() {
  const [show, setShow] = useState(false);

  return (
    <section className="section">
      <h1 className="title">Debug page</h1>
      <div className="container">
        <pre>
          {getKeys(localStorage).map(
            (key) =>
              `localStorage.setItem(${key}, ${JSON.stringify(
                localStorage.getItem(key)
              )});\n`
          )}
        </pre>

        <button type="button" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </button>
        {
          show && <ErrorPresenter error={new Error('This is a test error')} />
        }
      </div>
    </section>
  );
}
