import React, { ChangeEvent } from 'react';
import { useMutation } from 'react-query';

import { postLinkEmail } from '../../lib/backend/postLinkEmail';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';

interface LinkEmailProps {
  setErrorMessage: ErrorHandlerType;
  linked_email?: string;
}

export function LinkEmail({ setErrorMessage, linked_email }: Readonly<LinkEmailProps>) {

  console.log('xxx', linked_email);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (email: string) => postLinkEmail(email)
  });
  const [email, setEmail] = React.useState<string>(linked_email ?? '');

  if (isError) {
    setErrorMessage(error);
  }

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onLink = () => {
    mutate(email);
  };

  return <>
    <h4 className="title is-4">Link email</h4>
    <div className={`control ${isLoading ? 'is-loading' : ''}`}>
      <input
        value={email}
        onChange={onChangeEmail} id="email" className="input" type="email" />
    </div>
    <p className="py-4">
      <button type="button" className="button is-medium is-link" onClick={() => onLink()}>Link</button>
    </p>
  </>;
}
