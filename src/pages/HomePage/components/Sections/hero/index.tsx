import HeroText from './HeroText';
import styles from '../../../../../styles/shared.module.css';
import {
  HeroSubtitle,
  HeroSubtitleAlignRight,
  HeroTitle,
  HeroTitleContainer,
} from './styled';

function HeroSection() {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroInner}>
        <HeroTitleContainer>
          <HeroTitle>
            Create <HeroSubtitle>Anki flashcards </HeroSubtitle>
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
