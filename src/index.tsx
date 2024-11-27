import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
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

  const container = document.getElementById('root');
  const root = createRoot(container!);

  root.render(
    <React.StrictMode>
      <Suspense fallback={<LoadingIndicator />}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </React.StrictMode>
  );
}

main();
