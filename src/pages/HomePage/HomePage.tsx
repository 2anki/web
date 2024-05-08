import TestimonialsSection from './components/Sections/testimonials';
import BenefitsSection from './components/Sections/benefits';
import AboutSection from './components/Sections/about';
import HeroSection from './components/Sections/hero';
import { HomeContainer } from '../../components/styled';
import UploadForm from '../UploadPage/components/UploadForm/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { FormSection } from './components/Sections/hero/styled';
import TierSection from './components/Sections/tier/TierSection';

interface HomePageProps {
  setErrorMessage: ErrorHandlerType;
}

export function HomePage({ setErrorMessage }: HomePageProps) {
  return (
    <HomeContainer>
      <HeroSection />
      <FormSection>
        <UploadForm setErrorMessage={setErrorMessage} />
      </FormSection>
      <TierSection />
      <AboutSection />
      <TestimonialsSection />
      <BenefitsSection />
    </HomeContainer>
  );
}
