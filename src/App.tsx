import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, useState } from 'react';

import { useCookies } from 'react-cookie';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';

import Footer from './components/Footer';
import isOfflineMode from './lib/isOfflineMode';
import DebugPage from './pages/DebugPage';
import { ContactPage } from './pages/ContactPage/ContactPage';
import FavoritesPage from './pages/FavoritesPage';
import { PageLayout } from './components/Layout/PageLayout';
import DeleteAccountPage from './pages/DeleteAccountPage';
import { getErrorMessage } from './components/errors/helpers/getErrorMessage';
import { sendError } from './lib/SendError';
import { useUserLocals } from './lib/hooks/useUserLocals';
import NotFoundPage from './pages/NotFoundPage';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NewPasswordPage = lazy(() => import('./pages/NewPasswordPage'));
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AccountPage = lazy(() => import('./pages/AccountPage/AccountPage'));
const SuccessfulCheckoutPage = lazy(
  () => import('./pages/SuccessfulCheckout/SuccessfulCheckout')
);

const queryClient = new QueryClient();

function AppContent({
                      error,
                      setErrorMessage
                    }: Readonly<{
  error: Error | null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setErrorMessage: (error: unknown) => void;
}>) {
  const { data, isLoading } = useUserLocals();
  const isLoggedIn = !isLoading && !!data?.user?.id;
  return (
    <BrowserRouter>
      <PageLayout error={error} isLoggedIn={isLoggedIn}>
        <Routes>
          <Route
            path="/favorites"
            element={<FavoritesPage setError={setErrorMessage} />}
          />
          <Route
            path="/uploads"
            element={<DownloadsPage setError={setErrorMessage} />}
          />
          <Route
            path="/upload"
            element={<UploadPage setErrorMessage={setErrorMessage} />}
          />
          <Route
            path="/register"
            element={<RegisterPage setErrorMessage={setErrorMessage} />}
          />
          <Route
            path="/search"
            element={<SearchPage setError={setErrorMessage} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/forgot"
            element={<ForgotPasswordPage setErrorMessage={setErrorMessage} />}
          />
          <Route
            path="/users/r/:id"
            element={<NewPasswordPage setErrorMessage={setErrorMessage} />}
          />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/delete-account"
            element={<DeleteAccountPage setError={setErrorMessage} />}
          />
          <Route
            path="/pricing"
            element={<PricingPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/"
            element={
              <HomePage
                setErrorMessage={setErrorMessage}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/successful-checkout"
            element={<SuccessfulCheckoutPage />}
          />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </PageLayout>
    </BrowserRouter>
  );
}

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
      <AppContent
        error={apiError as Error | null}
        setErrorMessage={handledError}
      />
    </QueryClientProvider>
  );
}

export default App;
