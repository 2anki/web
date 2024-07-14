import { getGoogleSignInUrl } from '../../lib/backend/getGoogleSignInUrl';

interface WithGoogleLinkProps {
  text: string;
}

export function WithGoogleLink({ text }: WithGoogleLinkProps) {
  return <div>
    <div className="notification is-info is-small">
      <p>Google sign is currently disabled, please register or use forgotten password</p>
    </div>
    <a href={getGoogleSignInUrl()} className="button is-fullwidth">
  <span className="icon">
    <i className="fab fa-google" />
  </span>
      <span>{text}</span>
    </a>
  </div>;
}
