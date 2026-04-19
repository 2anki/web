import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { NoteBaseType } from '../../pages/TemplatesPage/types/NoteBaseType';
import { TemplateProject } from '../../pages/TemplatesPage/types/AnkiNoteType';
import styles from './CardStyleRow.module.css';

export const DEFAULT_STYLE_ID = 'default';

const KIND_LABEL: Record<Kind, string> = {
  basic: 'Basic card style',
  cloze: 'Cloze card style',
  input: 'Input card style',
};

const KIND_MATCHES: Record<Kind, NoteBaseType[]> = {
  basic: [
    NoteBaseType.Basic,
    NoteBaseType.BasicReversed,
    NoteBaseType.BasicOptionalReversed,
  ],
  cloze: [NoteBaseType.Cloze],
  input: [NoteBaseType.BasicTypeAnswer],
};

export type Kind = 'basic' | 'cloze' | 'input';

interface Props {
  kind: Kind;
  templates: TemplateProject[];
  styleId: string;
  name: string;
  onStyleChange: (styleId: string, autoFillName: string) => void;
  onNameChange: (name: string) => void;
  duplicateName?: boolean;
}

function matchingTemplates(
  kind: Kind,
  templates: TemplateProject[]
): TemplateProject[] {
  const kinds = KIND_MATCHES[kind];
  const seen = new Set<string>();
  return templates
    .filter((t) => kinds.includes(t.baseType))
    .filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function CardStyleRow({
  kind,
  templates,
  styleId,
  name,
  onStyleChange,
  onNameChange,
  duplicateName,
}: Readonly<Props>) {
  const options = matchingTemplates(kind, templates);
  const selected = options.find((t) => t.id === styleId);
  const isMissing =
    styleId !== DEFAULT_STYLE_ID && !selected;

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    if (nextId === DEFAULT_STYLE_ID) {
      onStyleChange(DEFAULT_STYLE_ID, '');
      return;
    }
    const next = options.find((t) => t.id === nextId);
    onStyleChange(nextId, next?.name ?? '');
  };

  return (
    <div className={styles.row}>
      <span className={styles.heading}>{KIND_LABEL[kind]}</span>
      <div className={styles.controls}>
        <label className={styles.control}>
          <span className={styles.srOnly}>{KIND_LABEL[kind]}</span>
          <select
            className={styles.select}
            value={isMissing ? DEFAULT_STYLE_ID : styleId}
            onChange={handleSelect}
          >
            <option value={DEFAULT_STYLE_ID}>Default</option>
            {options.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {options.length === 0 && (
            <span className={styles.hint}>
              No custom styles yet.{' '}
              <Link to="/templates" className={styles.hintLink}>
                Create one →
              </Link>
            </span>
          )}
        </label>

        <label className={styles.control}>
          <span className={styles.secondaryLabel}>Name in Anki</span>
          <input
            type="text"
            className={styles.input}
            value={name}
            placeholder="Uses built-in name"
            onChange={(event) => onNameChange(event.target.value)}
            aria-invalid={duplicateName || undefined}
          />
          <span className={styles.hint}>
            Rename if your Anki collection already has a note type with this
            name.
          </span>
        </label>
      </div>
      {isMissing && (
        <p className={styles.warning} role="alert">
          ⚠ &quot;{styleId}&quot; no longer exists — using Default. Pick another
          above.
        </p>
      )}
      {duplicateName && (
        <p className={styles.warning} role="alert">
          ⚠ Each kind needs a unique name in Anki.
        </p>
      )}
    </div>
  );
}
