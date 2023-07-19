import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, useMemo, useState } from 'react';

import { useCookies } from 'react-cookie';
import Bugsnag from '@bugsnag/js';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';

import Footer from './components/Footer';
import CardOptionsStore from './store/CardOptionsStore';
import StoreContext from './store/StoreContext';
import GlobalStyle from './GlobalStyle';
import ImportPage from './pages/ImportPage/ImportPage';
import isOfflineMode from './lib/isOfflineMode';
import { ErrorType } from './components/errors/helpers/types';
import DebugPage from './pages/DebugPage';
import FavoritesPage from './pages/FavoritesPage';
import { PageLayout } from './components/Layout/PageLayout';
import DeleteAccountPage from './pages/DeleteAccountPage';
import { getErrorMessage } from './components/errors/helpers/getErrorMessage';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NewPasswordPage = lazy(() => import('./pages/NewPasswordPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));

function App() {
  const [cookies, setCookie] = useCookies(['token']);
  if (isOfflineMode() && !cookies.token) {
    setCookie('token', '?');
  }

  const loadDefaults = localStorage.getItem('skip-defaults') !== 'true';
  const oldStore = useMemo(() => new CardOptionsStore(loadDefaults), []);
  const [apiError, setError] = useState<ErrorType | null>(null);
  /**
   * This error handling is for network errors and errors happening in the background.
   * This code should be deleted and error handling should be unified for network requests.
   * */
  const handledError = (error: ErrorType) => {
    const errorMessage = getErrorMessage(error);
    Bugsnag.notify(getErrorMessage(error))
    setError(errorMessage);
  };

  return (
    <>
      <GlobalStyle />
      <StoreContext.Provider value={oldStore}>
        <BrowserRouter>
          <PageLayout error={apiError}>
            <Routes>
              <Route
                path="/favorites"
                element={<FavoritesPage setError={handledError} />}
              />
              <Route
                path="/uploads"
                element={<DownloadsPage setError={handledError} />}
              />
              <Route
                path="/upload"
                element={<UploadPage setErrorMessage={handledError} />}
              />
              <Route
                path="/register"
                element={<RegisterPage setErrorMessage={handledError} />}
              />
              <Route
                path="/search"
                element={<SearchPage setError={handledError} />}
              />
              <Route
                path="/login"
                element={<LoginPage setErrorMessage={handledError} />}
              />
              <Route
                path="/users/r/:id"
                element={<NewPasswordPage setErrorMessage={handledError} />}
              />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/debug" element={<DebugPage />} />
              <Route
                path="/delete-account"
                element={<DeleteAccountPage setError={handledError} />}
              />
              <Route path="/" element={<HomePage />} />
            </Routes>
            <Footer />
          </PageLayout>
        </BrowserRouter>
      </StoreContext.Provider>
    </>
  );
}

export default App;
