import React, {
  FormEventHandler,
  SetStateAction,
  SyntheticEvent,
  useState
} from 'react';
import { useCookies } from 'react-cookie';
import {
  ErrorHandlerType,
  getErrorMessage
} from '../../../errors/helpers/getErrorMessage';
import { get2ankiApi } from '../../../../lib/backend/get2ankiApi';

interface LoginState {
  email: string;
  password: string;
  loading: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  setEmail: React.Dispatch<SetStateAction<string>>;
  setPassword: React.Dispatch<SetStateAction<string>>;
}

export const useHandleLoginSubmit = (onError: ErrorHandlerType): LoginState => {
  const [loading, setLoading] = useState(false);
  const [, setCookie] = useCookies(['token']);
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await get2ankiApi().login(email, password);
      if (res.status === 200) {
        const { token, redirect } = await res.json();
        setCookie('token', token);
        window.location.href = redirect ?? '/search';
      } else {
        onError(
          new Error(
            'Invalid username or password. Please try again or click forgot password.'
          )
        );
      }
      setLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      onError(errorMessage);
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    onSubmit,
    setEmail,
    setPassword
  };
};
