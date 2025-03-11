import React, { useState } from 'react';
import { getKeys } from './helpers/getKeys';
import { ErrorPresenter } from '../../components/errors/ErrorPresenter';
import { useUserLocals } from '../../lib/hooks/useUserLocals';

export function DebugPage() {
  const [show, setShow] = useState(false);
  const { data } = useUserLocals();

  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <section className="section">
      <h1 className="title">Debug page</h1>
      <div className="container">
        <h2 className="subtitle">User Locals</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>

        <h2 className="subtitle mt-4">Local Storage</h2>
        <pre>
          {getKeys(localStorage).map(
            (key) =>
              `localStorage.setItem(${key}, ${JSON.stringify(
                localStorage.getItem(key)
              )});\n`
          )}
        </pre>
        <div className="buttons is-justify-content-space-between mt-2">
          <div className="control">
            <button
              className="button"
              type="button"
              onClick={() => setShow(!show)}
            >
              {show ? 'Hide' : 'Show'}
            </button>
            {show && (
              <ErrorPresenter error={new Error('This is a test error')} />
            )}
          </div>

          <div className="control">
            <button
              className="button"
              type="button"
              onClick={resetLocalStorage}
            >
              Reset local storage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
