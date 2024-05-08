import React from 'react';
import { PageContainer } from '../../components/styled';
import { getVisibleText } from '../../lib/text/getVisibleText';

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="container content">
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
          <a className="link is-medium is-danger button" href="/delete-account">
            {getVisibleText('navigation.deleteAccount')}
          </a>
        </p>
      </div>
    </PageContainer>
  );
}
