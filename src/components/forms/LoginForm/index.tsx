import BetaMessage from '../../BetaMessage';
import { ErrorHandlerType } from '../../errors/helpers/getErrorMessage';
import { isValidCredentials } from './helpers/isValidCredentials';
import { useHandleLoginSubmit } from './helpers/useHandleLoginSubmit';
import { SubmitButton } from './styled';
import { FormContainer } from '../styled';
import { getVisibleText } from '../../../lib/text/getVisibleText';
import { WithGoogleLink } from '../WithGoogleLink';

interface LoginFormProps {
  onError: ErrorHandlerType;
}

function LoginForm({ onError }: LoginFormProps) {
  const { email, password, loading, onSubmit, setEmail, setPassword } =
    useHandleLoginSubmit(onError);

  return (
    <FormContainer>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <BetaMessage />
              <h1 className="title is-1">Login</h1>
              <form onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="email" className="label">
                    Email
                    <input
                      name="email"
                      min="3"
                      max="255"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        localStorage.setItem('email', event.target.value);
                      }}
                      className="input"
                      type="email"
                      placeholder="Your e-mail"
                      required
                    />
                  </label>
                </div>
                <div className="field">
                  <label htmlFor="password" className="label">
                    Password
                    <div className="control">
                      <input
                        name="password"
                        min="8"
                        max="255"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="input"
                        type="password"
                        placeholder="Your password"
                      />
                    </div>
                  </label>
                </div>

                <div className="field">
                  <div className="control">
                    <SubmitButton
                      type="submit"
                      disabled={!isValidCredentials(email, password) || loading}
                    >
                      Login in
                    </SubmitButton>
                  </div>
                </div>
                <hr />
                <div className="control">
                  <WithGoogleLink text={getVisibleText('navigation.login.google')} />
                </div>
              </form>
              <p className="pt-4">
                {getVisibleText('navigation.register.question')}{' '}
                <a rel="noreferrer" href="/register">
                  Register!
                </a>
              </p>
              <p className="pt-2">
                <a rel="noreferrer" href="/forgot">
                  I forgot my password
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </FormContainer>
  );
}

export default LoginForm;
