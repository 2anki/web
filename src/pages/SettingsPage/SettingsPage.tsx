import React from 'react';
import { useQuery } from 'react-query';
import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';
import { FIFTEEN_MINUTES } from '../../components/modals/SettingsModal/constants';
import { getUserLocals } from '../../lib/backend/getUserLocals';
import LoadingIndicator from '../../components/Loading';
import { ErrorHandlerType } from '../../components/errors/helpers/getErrorMessage';
import { getPatreonLink } from './getPatreonLink';

const portalLinks = {
  production: 'https://billing.stripe.com/p/login/aEUaHp8ma4VPfPW9AA',
  development: 'https://billing.stripe.com/p/login/test_00g6pu0q60JYbMQ3cc'
};

interface SettingsPageProps {
  setErrorMessage: ErrorHandlerType;

}

export default function SettingsPage({ setErrorMessage }: SettingsPageProps) {
  const customerPortal =
    process.env.NODE_ENV === 'development' ?
      portalLinks.development : portalLinks.production;

  const { isLoading, isError, data, error } = useQuery(
    'userlocals',
    getUserLocals,
    {
      staleTime: FIFTEEN_MINUTES
    }
  );

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    setErrorMessage(error);
  }

  if (!data) {
    setErrorMessage('No data found');
  }

  const locals = data?.locals;

  return (
    <PageContainer>
      <div className="container content">
        <div className="box">
          <p>
            For more information on usage, see the{' '}
            <a
              className="link"
              href={getVisibleText('navigation.help.url')}
              target="_blank" rel="noreferrer"
            >
              {getVisibleText('navigation.help')}.
            </a>
          </p>

          <p className="control">
            {!locals?.patreon && <a className="button is-large is-link" href={customerPortal}>Manage subscription</a>}
            {locals?.patreon && <a className="button is-large is-link" href={getPatreonLink()}>Manage membership</a>}
          </p>

          <p className="control">
            <a className="link is-small is-danger button" href="/delete-account">
              {getVisibleText('navigation.deleteAccount')}
            </a>
          </p>

        </div>
      </div>
    </PageContainer>
  );
}
