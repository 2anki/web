import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AnthropicConsentModal, {
  ANTHROPIC_ENABLED_KEY,
} from './AnthropicConsentModal';

describe('AnthropicConsentModal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the modal with Anthropic pre-selected', () => {
    render(<AnthropicConsentModal onClose={vi.fn()} />);
    const anthropicRadio = screen.getByRole('radio', { name: /use recommended ai \(anthropic\)/i });
    expect(anthropicRadio).toBeChecked();
  });

  test('renders the basic alternative option', () => {
    render(<AnthropicConsentModal onClose={vi.fn()} />);
    const basicRadio = screen.getByRole('radio', { name: /use basic alternative/i });
    expect(basicRadio).not.toBeChecked();
  });

  test('shows quality warning when basic alternative is selected', () => {
    render(<AnthropicConsentModal onClose={vi.fn()} />);
    const basicRadio = screen.getByRole('radio', { name: /use basic alternative/i });
    fireEvent.click(basicRadio);
    expect(screen.getByText(/disabling this may result in lower-quality output/i)).toBeInTheDocument();
  });

  test('does not show quality warning when Anthropic is selected', () => {
    render(<AnthropicConsentModal onClose={vi.fn()} />);
    expect(screen.queryByText(/disabling this may result in lower-quality output/i)).not.toBeInTheDocument();
  });

  test('saves claude-ai-flashcards as true when confirmed with recommended option', () => {
    const onClose = vi.fn();
    render(<AnthropicConsentModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(localStorage.getItem(ANTHROPIC_ENABLED_KEY)).toBe('true');
    expect(onClose).toHaveBeenCalled();
  });

  test('saves claude-ai-flashcards as false when confirmed with basic option', () => {
    const onClose = vi.fn();
    render(<AnthropicConsentModal onClose={onClose} />);
    fireEvent.click(screen.getByRole('radio', { name: /use basic alternative/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(localStorage.getItem(ANTHROPIC_ENABLED_KEY)).toBe('false');
    expect(onClose).toHaveBeenCalled();
  });
});
