import styled from 'styled-components';

interface Props {
  ready: boolean;
  connectionLink: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    /* Adjust for mobile responsiveness */
    flex-direction: column; /* Stack vertically on mobile */
  }
`;

const Section = styled.div`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  strong {
    font-weight: bold;
  }
`;

const Button = styled.a`
  display: block;
  width: 100%;
  padding: 1rem 0;
  text-align: center;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: #007bff; /* Blue button */

  &:hover {
    background-color: #0069d9; /* Darker blue on hover */
  }

  &.is-light {
    background-color: #f0f0f0; /* Light grey button */
    color: #333;
    &:hover {
      background-color: #ddd;
    }
  }
`;

const IntroText = styled.p`
  text-align: center;
  margin-bottom: 2rem;
`;

export default function ConnectNotion({ ready, connectionLink }: Props) {
  if (!ready) return null;

  return (
    <Wrapper>
      <IntroText>
        There are two ways to use 2anki.net. Choose how you want to use it:
      </IntroText>
      <Section className="box">
        <h3 className="title is-3">Connect to Notion</h3>
        <p className="mb-4">
          Click to convert, generated files are stored and converted in the
          background.
        </p>
        <Button className="button is-link" href={connectionLink}>
          Connect
        </Button>
      </Section>
      <Section className="box">
        <h3 className="title is-3">Manual File Upload</h3>
        <p className="mb-4">
          Upload your exported Notion files manually, and they will be
          auto-deleted.
        </p>
        <Button className="button is-light" href="/upload">
          Upload
        </Button>
      </Section>
    </Wrapper>
  );
}
