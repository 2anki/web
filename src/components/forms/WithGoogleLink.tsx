import { getGoogleSignInUrl } from '../../lib/backend/getGoogleSignInUrl';

interface WithGoogleLinkProps {
  text: string;
}

export function WithGoogleLink({ text }: WithGoogleLinkProps) {
  return <a href={getGoogleSignInUrl()} className="button is-fullwidth">
  <span className="icon">
    <i className="fab fa-google" />
  </span>
    <span>{text}</span>
  </a>;
}
