import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { NoteBaseType } from '../../pages/TemplatesPage/types/NoteBaseType';
import { TemplateProject } from '../../pages/TemplatesPage/types/AnkiNoteType';
import styles from './CardStyleRow.module.css';

export const DEFAULT_STYLE_ID = 'specialstyle';

// Legacy built-in render styles bundled in the 2anki/templates repo.
// Kept in the dropdown for backwards compatibility with users who
// already rely on them.
export const BUILTIN_STYLES: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'specialstyle', label: 'Default' },
  { id: 'notionstyle', label: 'Only Notion' },
  { id: 'nostyle', label: 'Raw Note (no style)' },
  { id: 'abhiyan', label: 'Abhiyan Bhandari (Night Mode)' },
  { id: 'alex_deluxe', label: 'Alexander Deluxe (Blue)' },
];

const BUILTIN_IDS = new Set(BUILTIN_STYLES.map((s) => s.id));

export function isBuiltinStyleId(id: string): boolean {
  return BUILTIN_IDS.has(id);
}

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
    !isBuiltinStyleId(styleId) && !selected;

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    if (isBuiltinStyleId(nextId)) {
      onStyleChange(nextId, '');
      return;
    }
    const next = options.find((t) => t.id === nextId);
    onStyleChange(nextId, next?.name ?? '');
  };

  const effectiveStyleId = isMissing ? DEFAULT_STYLE_ID : styleId;
  const summaryLabel =
    selected?.name ??
    BUILTIN_STYLES.find((s) => s.id === effectiveStyleId)?.label ??
    'Default';

  return (
    <details className={styles.row}>
      <summary className={styles.summary}>
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
        <span className={styles.heading}>{KIND_LABEL[kind]}</span>
        <span className={styles.summaryValue} data-hj-suppress>
          {summaryLabel}
          {name ? ` · ${name}` : ''}
        </span>
      </summary>
      <div className={styles.body}>
        <label className={styles.control}>
          <span className={styles.fieldLabel}>Style</span>
          <select
            className={styles.select}
            value={effectiveStyleId}
            onChange={handleSelect}
          >
            <optgroup label="Built-in">
              {BUILTIN_STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </optgroup>
            {options.length > 0 && (
              <optgroup label="My card styles">
                {options.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
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
          <span className={styles.fieldLabel}>Name in Anki</span>
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

        {isMissing && (
          <p className={styles.warning} role="alert">
            ⚠ &quot;{styleId}&quot; no longer exists — using Default. Pick
            another above.
          </p>
        )}
        {duplicateName && (
          <p className={styles.warning} role="alert">
            ⚠ Each kind needs a unique name in Anki.
          </p>
        )}
      </div>
    </details>
  );
}
