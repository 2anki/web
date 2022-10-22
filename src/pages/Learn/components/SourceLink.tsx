import styled from 'styled-components';

interface SourceLinkProps {
  link: string;
  title: string;
}

const Link = styled.a`
  padding: 0 0.2rem;

  background: white;
  color: #5397f5;
  text-decoration: underline;

  :hover {
    background-color: #5397f5;
    color: white;
    text-decoration: none;
  }
`;

export function SourceLink({ link, title }: SourceLinkProps) {
  return <Link href={link}># {title}</Link>;
}
