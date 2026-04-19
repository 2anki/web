import { Navigate } from 'react-router-dom';
import HeroSection from './components/Sections/hero';
import UploadForm from '../UploadPage/components/UploadForm/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import heroStyles from './components/Sections/hero/Hero.module.css';
import { useSettingsCardsOptions } from '../../components/modals/SettingsModal/useSettingsCardsOptions';
import { HomePageAnonHeader } from './components/HomePageAnonHeader';
import { VideosAndDocs } from './components/VideosAndDocs';
import { useUserLocals } from '../../lib/hooks/useUserLocals';
import styles from '../../styles/shared.module.css';

interface HomePageProps {
  setErrorMessage: ErrorHandlerType;
  // isLoggedIn kept for back-compat with App.tsx; the redirect below reads
  // it directly from useUserLocals so we can also gate on isLoading and
  // avoid a landing-page flash before the redirect fires.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoggedIn: boolean;
}

export function HomePage({
  setErrorMessage,
}: Readonly<HomePageProps>) {
  useSettingsCardsOptions(null);
  const { data } = useUserLocals();
  const isLoggedIn = !!data?.user?.id;

  if (isLoggedIn) {
    return <Navigate to="/upload" replace />;
  }

  return (
    <div>
      <HeroSection />
      <div className={heroStyles.formSection}>
        <UploadForm setErrorMessage={setErrorMessage} />
      </div>
      <div className={styles.contentSection}>
        <HomePageAnonHeader />
        <VideosAndDocs />
        <p>Happy learning!</p>
      </div>
    </div>
  );
}
