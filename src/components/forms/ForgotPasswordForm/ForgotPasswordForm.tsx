import { SyntheticEvent, useState } from 'react';

import Backend from '../../../lib/backend';
import { ErrorHandlerType } from '../../errors/helpers/getErrorMessage';
import { ForgotPassword } from './ForgotPassword';
import { FormContainer } from './styled';

interface ForgotPasswordProps {
  setError: ErrorHandlerType;
}

function ForgotPasswordForm({ setError }: ForgotPasswordProps) {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [didReset, setDidReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setDidReset(false);

    try {
      const backend = new Backend();
      await backend.forgotPassword(email);
      setLoading(false);
      setDidReset(true);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  return (
    <FormContainer>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <h1 className="title is-4">Forgot your password?</h1>
              <p className="subtitle">Please enter your email below.</p>
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
                <ForgotPassword didReset={didReset} loading={loading} />
              </form>
            </div>
          </div>
        </div>
      </section>
    </FormContainer>
  );
}

export default ForgotPasswordForm;
