import HeroText from './HeroText';
import { HeroSubtitle, HeroSubtitleAlignRight, HeroTitle, HeroTitleContainer } from './styled';

function HeroSection() {

  return (
    <div className="section hero">
      <div className="container">
        <HeroTitleContainer>
          <HeroTitle>Create{' '}
            <HeroSubtitle>Anki flashcards{' '}</HeroSubtitle>
            <HeroSubtitleAlignRight>fast</HeroSubtitleAlignRight>
          </HeroTitle>
        </HeroTitleContainer>
        <HeroText>
          We are making it the easiest and fastest way to create beautiful Anki
          flashcards for anyone anywhere around the world!
        </HeroText>
      </div>
    </div>
  );
}

export default HeroSection;
