import { useClaudeProgress } from './hooks/useClaudeProgress';

interface Props {
  active: boolean;
}

export function ClaudeProgress({ active }: Readonly<Props>) {
  const { label, progress } = useClaudeProgress(active);

  if (!active) return null;

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ marginBottom: '0.5rem', color: '#7c3aed', fontWeight: 500 }}>
        ✨ {label}
      </p>
      <progress
        className="progress is-small"
        value={progress}
        max={100}
        style={{ accentColor: '#7c3aed' }}
      />
    </div>
  );
}
