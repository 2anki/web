import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import UploadForm from './UploadForm';

describe('UploadForm', () => {
  test('download button is light by default', () => {
    const { container } = render(
      <BrowserRouter>
        <UploadForm setErrorMessage={(error) => fail(error)} isLoggedIn={false} />
      </BrowserRouter>
    );
    expect(container.querySelector('.button.cta.is-light')).toBeInTheDocument();
  });

  test('no null classes', () => {
    const { container } = render(
      <BrowserRouter>
        <UploadForm setErrorMessage={(error) => fail(error)} isLoggedIn={false} />
      </BrowserRouter>
    );
    expect(container.querySelector('.null')).toBeNull();
  });

  test('download button is disabled', () => {
    render(
      <BrowserRouter>
        <UploadForm setErrorMessage={(error) => fail(error)} isLoggedIn={false} />
      </BrowserRouter>
    );
    expect(document.querySelector('.button.cta')).toBeDisabled();
  });
});
