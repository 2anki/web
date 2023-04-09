import { StyledSection } from './styled';

function HeroSection() {
  return (
    <StyledSection className="section hero has-background-white">
      <div className="container">
        <h1 className="title">The most used Notion to Anki converter</h1>
        <p className="subtitle">
          We are making it the easiest and fastest way to create beautiful Anki
          flashcards for anyone anywhere around the world!
        </p>
      </div>
    </StyledSection>
  );
}

export default HeroSection;
