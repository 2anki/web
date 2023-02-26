import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, useMemo, useState } from 'react';

import '@fremtind/jkl-accordion/accordion.min.css';
import '@fremtind/jkl-alert-message/alert-message.min.css';

import { useCookies } from 'react-cookie';
import { captureException } from '@sentry/react';
import UploadPage from './pages/Upload';
import HomePage from './pages/Home';

import Footer from './components/Footer';
import CardOptionsStore from './store/CardOptionsStore';
import StoreContext from './store/StoreContext';
import GlobalStyle from './GlobalStyle';
import ImportPage from './pages/Import/ImportPage';
import isOfflineMode from './lib/isOfflineMode';
import { ErrorType } from './components/errors/helpers/types';
import DebugPage from './pages/Debug';
import FavoritesPage from './pages/Favorites';
import { PageLayout } from './components/Layout/PageLayout';
import DeleteAccountPage from './pages/Delete';

const RegisterPage = lazy(() => import('./pages/Register'));
const SearchPage = lazy(() => import('./pages/Search'));
const LoginPage = lazy(() => import('./pages/Login'));
const NewPasswordPage = lazy(() => import('./pages/NewPassword'));
const MyUploadsPage = lazy(() => import('./pages/MyUploads'));

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

  return (
    <>
      <GlobalStyle />
      <StoreContext.Provider value={oldStore}>
        <BrowserRouter>
          <PageLayout error={apiError}>
            <Routes>
              <Route path="/favorites"
                     element={
                       <FavoritesPage setError={handledError} />
                     } />
              <Route path="/uploads"
                     element={
                       <MyUploadsPage setError={handledError} />
                     } />
              <Route path="/upload"
                     element={
                       <UploadPage setErrorMessage={handledError} />
                     }
              />
              <Route path="/register"
                     element={
                       <RegisterPage setErrorMessage={handledError} />
                     } />
              <Route path="/search"
                     element={
                       <SearchPage setError={handledError} />
                     } />
              <Route path="/login" element={
                <LoginPage setErrorMessage={handledError} />
              } />
              <Route path="/users/r/:id" element={
                <NewPasswordPage setErrorMessage={handledError} />
              } />
              <Route path="/import" element={
                <ImportPage />
              } />
              <Route path="/debug" element={
                <DebugPage />
              } />
              <Route path="/delete-account" element={
                <DeleteAccountPage setError={handledError} />
              } />
              <Route path="/" element={
                <HomePage />
              } />
            </Routes>
            <Footer />
          </PageLayout>
        </BrowserRouter>
      </StoreContext.Provider>
    </>
  );
}

export default App;
