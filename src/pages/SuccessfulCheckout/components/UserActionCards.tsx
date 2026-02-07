const loginLink = 'https://2anki.net/login';
const registerLink = 'https://2anki.net/register';

export const UserActionCards = () => {
  return (
    <div className="columns">
      <div className="column is-half">
        <h3 className="title is-3">Existing User</h3>
        <p>
          If you already have an account with us, simply log in using the email
          address associated with your payment.
        </p>
        <a href={loginLink} className="button is-primary">
          Login
        </a>
        <br />
        <a href={loginLink}>{loginLink}</a> (link for reference)
      </div>

      <div className="column is-half">
        <h3 className="title is-3">New User</h3>
        <p>
          Welcome aboard! To get started, create a new account using the same
          email address used for your payment.
        </p>
        <a href={registerLink} className="button is-info">
          Register
        </a>
        <br />
        <a href={registerLink}>{registerLink}</a> (link for reference)
      </div>
    </div>
  );
};
