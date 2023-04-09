import TestimonialsSection from './components/Sections/testimonials';
import BenefitsSection from './components/Sections/benefits';
import AboutSection from './components/Sections/about';
import HeroSection from './components/Sections/hero';
import NewsSection from './components/Sections/news/NewsSection';
import { HomeContainer } from '../../components/styled';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import UploadForm from '../Upload/components/UploadForm';
import { ErrorHandlerType } from '../../components/errors/helpers/types';

interface Prop {
  setErrorMessage: ErrorHandlerType;
}

export default function HomePage({ setErrorMessage }: Prop) {
  return (
    <>
      <NavigationBar />
      <HomeContainer>
        <HeroSection />
        <UploadForm setErrorMessage={setErrorMessage} />
        <AboutSection />
        <TestimonialsSection />
        <BenefitsSection />
        <NewsSection />
      </HomeContainer>
    </>
  );
}
