import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import { lazy, useMemo, useState } from 'react';
import styled from 'styled-components';

import '@fremtind/jkl-accordion/accordion.min.css';
import '@fremtind/jkl-alert-message/alert-message.min.css';

import {
  ErrorAlertMessage,
} from '@fremtind/jkl-alert-message-react';

import { captureException } from '@sentry/react';
// import { useLocation } from 'react-router';
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
import Backend from './lib/Backend';

const TemplatePage = lazy(() => import('./pages/Templates'));
const PreSignupPage = lazy(() => import('./pages/Register'));
const SearchPage = lazy(() => import('./pages/Search'));
const LoginPage = lazy(() => import('./pages/Login'));
const NewPasswordPage = lazy(() => import('./pages/NewPassword'));
const LearnPage = lazy(() => import('./pages/Learn'));
const VerifyPage = lazy(() => import('./pages/Verify'));
const MyUploadsPage = lazy(() => import('./pages/MyUploads'));

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const backend = new Backend();
function App() {
  const loadDefaults = localStorage.getItem('skip-defaults') !== 'true';
  const store = useMemo(() => new CardOptionsStore(loadDefaults), []);
  const [errorMessage, setErrorMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [isPatron] = usePatreon(backend, (error) => {
    captureException(error);
  });

  // const location = useLocation();
  const { location } = window;// .pathnamegg;

  return (
    <>
      <GlobalStyle />
      <StoreContext.Provider value={store}>
        <BrowserRouter>
          <Layout>
            {/* We don't want a header on the sign-up page */}
            {location.pathname.match(/^(?!.*(login|search|signup)).*$/)
              && <NavigationBar isPatron={isPatron} />}
            {errorMessage && (
            <ErrorAlertMessage
              dismissed={dismissed}
              dismissAction={{
                handleDismiss: () => setDismissed(true),
              }}
            >
              {errorMessage}
            </ErrorAlertMessage>
            )}
            <Routes>
              <Route path="/uploads">
                <MyUploadsPage setError={setErrorMessage} />
              </Route>
              <Route path="/verify">
                <VerifyPage />
              </Route>
              <Route path="/learn">
                <LearnPage setError={setErrorMessage} />
              </Route>
              <Route path="/tm">
                <TemplatePage />
              </Route>
              <Route path="/upload">
                <UploadPage setErrorMessage={setErrorMessage} isPatron={isPatron} />
              </Route>
              <Route path="/pre-signup">
                <PreSignupPage />
              </Route>
              <Route path="/search">
                <SearchPage isPatron={isPatron} />
              </Route>
              <Route path="/login">
                <LoginPage setErrorMessage={setErrorMessage} />
              </Route>
              <Route path="/users/r/:id">
                <NewPasswordPage setErrorMessage={setErrorMessage} />
              </Route>
              <Route path="/settings">
                <SettingsPage />
              </Route>
              <Route path="/import">
                <ImportPage />
              </Route>
              <Route path="/">
                <HomePage />
              </Route>
            </Routes>
            <Footer />
          </Layout>
        </BrowserRouter>
      </StoreContext.Provider>
    </>
  );
}

export default App;
