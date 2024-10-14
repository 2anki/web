import Confetti from 'react-confetti';

import { Container } from '../../components/styled';

const loginLink = 'https://2anki.net/login';
const registerLink = 'https://2anki.net/register';
const settingsLink = 'https://2anki.net/settings';
const supportLink = 'mailto:support@2anki.net';

export default function SuccessfulCheckout() {
  return (
    <Container className="content">
      <h1 className="title">Your payment has been confirmed</h1>

      <p>
        Your payment has been successfully processed. To access
        your newly unlocked features and start using our service, you will need
        to either log in to your existing account or create a new one.
      </p>

      <div className="columns">
        <div className="column is-half">
          <h3 className="title is-3">Existing User</h3>
          <p>
            If you already have an account with us, simply log in using the
            email address associated with your payment.
          </p>
          <a href={loginLink} className="button is-primary">Login</a>
          <br />
          <a href={loginLink}>{loginLink}</a> (link for reference)
        </div>

        <div className="column is-half">
          <h3 className="title is-3">New User</h3>
          <p>
            Welcome aboard! To get started, create a new account using the
            same email address used for your payment.
          </p>
          <a href={registerLink} className="button is-info">Register</a>
          <br />
          <a href={registerLink}>{registerLink}</a> (link for reference)
        </div>
      </div>

      <p className="has-text-weight-bold">Important Note:</p>
      <p>
        To ensure a smooth experience, please ensure you log in or register
        using the <strong>same email address</strong> you used during your payment.
      </p>

      <p>
        In case you use different email addresses (e.g., Gmail for daily use
        and web.de for payments), you can still link them after logging in.
        Head over to your Settings page for more information:
        <a href={settingsLink}>{settingsLink}</a>
      </p>

      <p>
        <strong>Having trouble logging in with the email used for payment?</strong>
        {' Don\'t worry, we\'re here to help! Feel free to reach out to on eamil via this link:'}
        <a href={supportLink}>email link</a>.
      </p>

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.05} // Influences how quickly pieces fall
        recycle={false} // Set to false to avoid infinite recycling
      />
    </Container>
  );
}
