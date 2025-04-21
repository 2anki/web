import HeroSection from './components/Sections/hero';
import { HomeContainer } from '../../components/styled';
import UploadForm from '../UploadPage/components/UploadForm/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { FormSection } from './components/Sections/hero/styled';
import { useSettingsCardsOptions } from '../../components/modals/SettingsModal/useSettingsCardsOptions';
import { HomePageAnonHeader } from './components/HomePageAnonHeader';
import { HomePageLoggedInHeader } from './components/HomePageLoggedInHeader';
import { VideosAndDocs } from './components/VideosAndDocs';

interface HomePageProps {
  setErrorMessage: ErrorHandlerType;
  isLoggedIn: boolean;
}

export function HomePage({
                           setErrorMessage,
                           isLoggedIn
                         }: Readonly<HomePageProps>) {
  // Load the default settings cards options for backend compatibility
  useSettingsCardsOptions(null);

  return (
    <HomeContainer>
      <HeroSection />
      <FormSection>
        <UploadForm setErrorMessage={setErrorMessage} />
      </FormSection>
      <div className="container content">
        {!isLoggedIn && <HomePageAnonHeader />}
        {isLoggedIn && <HomePageLoggedInHeader />}
        <VideosAndDocs />
        <p>Happy learning!</p>
      </div>
    </HomeContainer>
  );
}
