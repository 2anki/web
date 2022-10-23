import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { lazy, useMemo, useState } from 'react';
import styled from 'styled-components';

import '@fremtind/jkl-accordion/accordion.min.css';
import '@fremtind/jkl-alert-message/alert-message.min.css';

import { useCookies } from 'react-cookie';
import { captureException } from '@sentry/react';
import { Provider } from 'react-redux';
import UploadPage from './pages/Upload';
import HomePage from './pages/Home';

import Footer from './components/Footer';
import CardOptionsStore from './store/CardOptionsStore';
import StoreContext from './store/StoreContext';
import GlobalStyle from './GlobalStyle';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SettingsPage from './pages/Settings';
import ImportPage from './pages/Import/ImportPage';
import usePatreon from './pages/MyUploads/hooks/usePatreon';
import Backend from './lib/backend';
import isOfflineMode from './lib/isOfflineMode';
import { ErrorPresenter } from './components/errors/ErrorPresenter';
import { ErrorType } from './components/errors/helpers/types';
import DebugPage from './pages/Debug';
import { store } from './store';

const TemplatePage = lazy(() => import('./pages/Templates'));
const PreSignupPage = lazy(() => import('./pages/Register'));
const SearchPage = lazy(() => import('./pages/Search'));
const LoginPage = lazy(() => import('./pages/Login'));
const NewPasswordPage = lazy(() => import('./pages/NewPassword'));
const LearnPage = lazy(() => import('./pages/Learn'));
const VerifyPage = lazy(() => import('./pages/Verify'));
const MyUploadsPage = lazy(() => import('./pages/MyUploads'));
const LoadingPage = lazy(() => import('./pages/Loading'));

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const backend = new Backend();
function App() {
  const [cookies, setCookie] = useCookies(['token']);
  if (isOfflineMode() && !cookies.token) {
    setCookie('token', '?');
  }

  const loadDefaults = localStorage.getItem('skip-defaults') !== 'true';
  const oldStore = useMemo(() => new CardOptionsStore(loadDefaults), []);
  const [apiError, setError] = useState<ErrorType | null>(null);
  const handledError = (error: ErrorType) => {
    const errorMessage = typeof error === 'string' ? new Error(error) : error;
    captureException(errorMessage);
    setError(errorMessage);
  };
  const [isPatron] = usePatreon(backend);

  return (
    <Provider store={store}>
      <GlobalStyle />
      <StoreContext.Provider value={oldStore}>
        <Router>
          <Layout>
            <NavigationBar isPatron={isPatron} />
            <ErrorPresenter error={apiError} />
            <Switch>
              <Route path="/uploads">
                <MyUploadsPage setError={handledError} />
              </Route>
              <Route path="/verify">
                <VerifyPage />
              </Route>
              <Route path="/learn">
                <LearnPage />
              </Route>
              <Route path="/tm">
                <TemplatePage />
              </Route>
              <Route path="/upload">
                <UploadPage
                  setErrorMessage={handledError}
                  isPatron={isPatron}
                />
              </Route>
              <Route path="/pre-signup">
                <PreSignupPage />
              </Route>
              <Route path="/search">
                <SearchPage setError={handledError} isPatron={isPatron} />
              </Route>
              <Route path="/login">
                <LoginPage setErrorMessage={handledError} />
              </Route>
              <Route path="/users/r/:id">
                <NewPasswordPage setErrorMessage={handledError} />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/import">
                <ImportPage />
              </Route>
              <Route path="/loading">
                <LoadingPage />
              </Route>
              <Route path="/debug">
                <DebugPage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Switch>
            <Footer />
          </Layout>
        </Router>
      </StoreContext.Provider>
    </Provider>
  );
}

export default App;
