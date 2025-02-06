import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: 1.5rem 1rem;
  width: 100%;
`;

const Links = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  li {
    white-space: nowrap;
  }

  li:not(:last-child):after {
    content: '|';
    margin-left: 1rem;
    color: #dbdbdb;
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

function Footer() {
  return (
    <StyledFooter className="has-text-centered">
      <div className="container">
        <div className="is-flex is-flex-direction-column is-align-items-center">
          <div>Copyright © 2024-2025 Alexander Alemayhu.</div>
          <Links>
            <li>
              <a
                target="_blank"
                href="https://github.com/2anki/2anki.net/blob/main/README.md"
                rel="noreferrer"
              >
                About
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://docs.2anki.net/misc/terms-of-service/"
                rel="noreferrer"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://docs.2anki.net/misc/privacy-policy/"
                rel="noreferrer"
              >
                Privacy
              </a>
            </li>
          </Links>
        </div>
      </div>
    </StyledFooter>
  );
}

export default Footer;
