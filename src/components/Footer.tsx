import styled from 'styled-components';

const StyledFooter = styled.footer`
    padding: 1.5rem 0rem;
    align-items: center;
    justify-content: center;
    bottom: 0;
    width: 100%;
`;

const Links = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: inline;

    li:not(:first-child):before {
        content: ' | ';
    }

    :first-child {
        padding-right: 0.2rem;
    }
`;

function Footer() {

  return <StyledFooter className="is-flex is-justify-content-space-around mx-2">
    <div>Copyright © 2024 Alexander Alemayhu.</div>
    {/* Earn Credits | About | Terms | Privacy | Blog */}
    <div>
      <Links className="is-flex">
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
            href="https://alemayhu.notion.site/Terms-of-services-931865161517453b99fb6495e400061d"
            rel="noreferrer"
          >
            Terms
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://alemayhu.notion.site/Privacy-38c6e8238ac04ea9b2485bf488909fd0"
            rel="noreferrer"
          >
            Privacy
          </a>
        </li>
      </Links>
    </div>
  </StyledFooter>;
}

export default Footer;
