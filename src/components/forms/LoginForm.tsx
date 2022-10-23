import styled from 'styled-components';
import { SyntheticEvent, useState } from 'react';

import { useCookies } from 'react-cookie';
import BetaMessage from '../BetaMessage';
import Backend from '../../lib/backend';
import { ErrorHandlerType, ErrorType } from '../errors/helpers/types';
import { getErrorMessage } from '../errors/helpers/getErrorMessage';

const FormContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

interface LoginFormProps {
  onForgotPassword: () => void;
  onError: ErrorHandlerType;
}

function LoginForm({ onForgotPassword, onError }: LoginFormProps) {
  const [, setCookie] = useCookies(['token']);
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = () =>
    email.length > 0 &&
    email.length < 256 &&
    password.length > 7 &&
    password.length < 256;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const backend = new Backend();
      const res = await backend.login(email, password);
      if (res.status === 200) {
        const { token } = await res.json();
        setCookie('token', token);
        window.location.href = '/search';
      }
      setLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error as ErrorType);
      if (errorMessage.includes('not verified')) {
        window.location.href = '/verify';
      } else {
        onError(error as ErrorType);
      }
      setLoading(false);
    }
  };
  return (
    <FormContainer>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <BetaMessage />
              <h1 className="title is-1">Login</h1>
              <form onSubmit={handleSubmit}>
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

                <div
                  tabIndex={-9}
                  role="button"
                  className="field"
                  onClick={() => onForgotPassword()}
                  onKeyDown={(event) => {
                    if (event.key === 'F9') {
                      onForgotPassword();
                    }
                  }}
                >
                  <a rel="noreferrer" href="#forgot">
                    I forgot my password
                  </a>
                </div>

                <div className="field">
                  <div className="control">
                    <button
                      type="submit"
                      className="button is-link is-medium is-pulled-right"
                      disabled={!isValid() || loading}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </FormContainer>
  );
}

export default LoginForm;
