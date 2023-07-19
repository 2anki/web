import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

import App from './App';

import LoadingIndicator from './components/Loading';

function main() {
  Bugsnag.start({
    apiKey: '746833cc883014579ab94b5d1222c638',
    plugins: [new BugsnagPluginReact()],
    enabledReleaseStages: ['production'],
  });

  const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<LoadingIndicator />}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

main();
