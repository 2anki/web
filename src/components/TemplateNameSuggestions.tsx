import { NoteBaseType } from '../pages/TemplatesPage/types/NoteBaseType';
import { TemplateProject } from '../pages/TemplatesPage/types/AnkiNoteType';
import styles from './TemplateNameSuggestions.module.css';

interface Props {
  templates: TemplateProject[];
  kind: 'basic' | 'cloze' | 'input';
  onPick: (name: string) => void;
}

const MATCHES: Record<Props['kind'], NoteBaseType[]> = {
  basic: [
    NoteBaseType.Basic,
    NoteBaseType.BasicReversed,
    NoteBaseType.BasicOptionalReversed,
  ],
  cloze: [NoteBaseType.Cloze],
  input: [NoteBaseType.BasicTypeAnswer],
};

export function TemplateNameSuggestions({ templates, kind, onPick }: Readonly<Props>) {
  const kinds = MATCHES[kind];
  const matching = templates.filter((t) => kinds.includes(t.baseType));
  if (matching.length === 0) return null;

  return (
    <div className={styles.row}>
      <span className={styles.label}>Your templates:</span>
      {matching.map((template) => (
        <button
          key={template.id}
          type="button"
          className={styles.chip}
          title={`Use "${template.name}"`}
          onClick={() => onPick(template.name)}
        >
          {template.name}
        </button>
      ))}
    </div>
  );
}
