import HeroSection from './components/Sections/hero';
import UploadForm from '../UploadPage/components/UploadForm/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { FormSection } from './components/Sections/hero/styled';
import { useSettingsCardsOptions } from '../../components/modals/SettingsModal/useSettingsCardsOptions';
import { HomePageAnonHeader } from './components/HomePageAnonHeader';
import { HomePageLoggedInHeader } from './components/HomePageLoggedInHeader';
import { VideosAndDocs } from './components/VideosAndDocs';
import styles from '../../styles/shared.module.css';

interface HomePageProps {
  setErrorMessage: ErrorHandlerType;
  isLoggedIn: boolean;
}

export function HomePage({
  setErrorMessage,
  isLoggedIn,
}: Readonly<HomePageProps>) {
  useSettingsCardsOptions(null);

  return (
    <div>
      <HeroSection />
      <FormSection>
        <UploadForm setErrorMessage={setErrorMessage} />
      </FormSection>
      <div className={styles.contentSection}>
        {!isLoggedIn && <HomePageAnonHeader />}
        {isLoggedIn && <HomePageLoggedInHeader />}
        <VideosAndDocs />
        <p>Happy learning!</p>
      </div>
    </div>
  );
}
