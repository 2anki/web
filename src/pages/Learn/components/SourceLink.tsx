import styled from 'styled-components';

interface SourceLinkProps {
  link: string;
  title: string;
}

const Link = styled.a`
  background-color: #5397f5;
`;

const List = styled.ul`
  li {
    list-style: none;
    color: white;
  }
`;

export function SourceLink({ link, title }: SourceLinkProps) {
  return (
    <List>
      <li>
        <Link href={link}>#Title: {title}</Link>
      </li>
    </List>
  );
}
