import { useEffect, useState } from 'react';

const CLAUDE_STAGES = [
  { label: 'Preparing document…', cumulative: 0 },
  { label: 'Sending to Claude AI…', cumulative: 800 },
  { label: 'Claude is generating flashcards…', cumulative: 2000 },
  { label: 'Building your Anki deck…', cumulative: 12000 },
  { label: 'Almost ready…', cumulative: 14500 },
];

export function useClaudeProgress(active: boolean) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!active) {
      setStage(0);
      return;
    }
    const timers = CLAUDE_STAGES.slice(1).map(({ cumulative }, i) =>
      setTimeout(() => setStage(i + 1), cumulative)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const label = CLAUDE_STAGES[Math.min(stage, CLAUDE_STAGES.length - 1)].label;
  const progress = Math.min(95, (stage / (CLAUDE_STAGES.length - 1)) * 95);

  return { stage, label, progress };
}
