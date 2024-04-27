import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, useState } from 'react';

import { useCookies } from 'react-cookie';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';

import Footer from './components/Footer';
import GlobalStyle from './GlobalStyle';
import ImportPage from './pages/ImportPage/ImportPage';
import isOfflineMode from './lib/isOfflineMode';
import DebugPage from './pages/DebugPage';
import FavoritesPage from './pages/FavoritesPage';
import { PageLayout } from './components/Layout/PageLayout';
import DeleteAccountPage from './pages/DeleteAccountPage';
import { getErrorMessage } from './components/errors/helpers/getErrorMessage';
import { sendError } from './lib/SendError';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NewPasswordPage = lazy(() => import('./pages/NewPasswordPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));

const queryClient = new QueryClient();

function App() {
  const [cookies, setCookie] = useCookies(['token']);
  if (isOfflineMode() && !cookies.token) {
    setCookie('token', '?');
  }

  const [apiError, setError] = useState<unknown>(null);
  /**
   * This error handling is for network errors and errors happening in the background.
   * This code should be deleted and error handling should be unified for network requests.
   * */
  const handledError = (error: unknown) => {
    const errorMessage = getErrorMessage(error);
    sendError(error);
    setError(errorMessage);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
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
              path="/forgot"
              element={<ForgotPasswordPage setErrorMessage={handledError} />}
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
    </QueryClientProvider>
  );
}

export default App;
