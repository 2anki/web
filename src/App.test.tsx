import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders 2anki.net title', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Anki flashcards/i)[0];
  expect(linkElement).toBeInTheDocument();
});
