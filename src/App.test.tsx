import { render, screen } from '@testing-library/react';
import { CookiesProvider } from 'react-cookie';
import App from './App';

test('renders 2anki.net title', () => {
  render(
    <CookiesProvider>
      <App />
    </CookiesProvider>
  );
  const linkElement = screen.getAllByText(/Anki flashcards/i)[0];
  expect(linkElement).toBeInTheDocument();
});
