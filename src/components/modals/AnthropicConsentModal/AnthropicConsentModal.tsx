import { useState } from 'react';

export const ANTHROPIC_ENABLED_KEY = 'claude-ai-flashcards';

interface Props {
  onClose: () => void;
}

function AnthropicConsentModal({ onClose }: Props) {
  const [useAnthropicChoice, setUseAnthropicChoice] = useState(true);

  const handleConfirm = () => {
    localStorage.setItem(ANTHROPIC_ENABLED_KEY, String(useAnthropicChoice));
    onClose();
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card">
        <div className="modal-card-head">
          <p className="modal-card-title">✨ Choose Your AI Engine</p>
        </div>
        <section className="modal-card-body">
          <p className="mb-4">
            <strong>Anthropic is our recommended AI engine</strong> — it produces
            the highest quality flashcards.
          </p>
          <ul className="mb-4" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
            <li>More accurate flashcards</li>
            <li>Better structure and formatting</li>
            <li>Handles complex or messy input better</li>
          </ul>

          <div className="field">
            <label className="radio" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="ai-choice"
                value="anthropic"
                checked={useAnthropicChoice}
                onChange={() => setUseAnthropicChoice(true)}
              />
              <span>
                <strong>✨ Use recommended AI (Anthropic)</strong> — best quality output
              </span>
            </label>
            <label className="radio" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="ai-choice"
                value="basic"
                checked={!useAnthropicChoice}
                onChange={() => setUseAnthropicChoice(false)}
              />
              <span>Use basic alternative</span>
            </label>
          </div>

          {!useAnthropicChoice && (
            <p className="has-text-warning-dark mt-3" style={{ fontSize: '0.875rem' }}>
              ⚠️ Disabling this may result in lower-quality output and more manual corrections.
            </p>
          )}
        </section>
        <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="button is-link"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
}

export default AnthropicConsentModal;
