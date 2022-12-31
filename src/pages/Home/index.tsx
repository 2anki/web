import TestimonialsSection from './components/Sections/testimonials';
import BenefitsSection from './components/Sections/benefits';
import AboutSection from './components/Sections/about';
import HeroSection from './components/Sections/hero';
import NewsSection from './components/Sections/news/NewsSection';
import { HomeContainer } from '../../components/styled';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

interface Prop {
  isPatron: boolean;
}

export default function HomePage({isPatron}: Prop) {
  return (
    <>
      <NavigationBar isPatron={isPatron}/>
      <HomeContainer>
        <HeroSection />
        <AboutSection />
        <TestimonialsSection />
        <BenefitsSection />
        <NewsSection />
      </HomeContainer>
    </>
  );
}
