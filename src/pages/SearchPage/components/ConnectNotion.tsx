import { ButtonWrapper } from './styled';

interface Props {
  ready: boolean;
  connectionLink: string;
}

export default function ConnectNotion({ ready, connectionLink }: Props) {
  if (!ready) return null;

  return (
    <ButtonWrapper className="buttons is-half is-centered is-align-items-center">
      <a
        className="button is-link has-text-weight-semibold"
        href={connectionLink}
      >
        Connect to Notion
      </a>

      <a className="button is-light" href="/upload">
        No, thanks
      </a>
    </ButtonWrapper>
  );
}
