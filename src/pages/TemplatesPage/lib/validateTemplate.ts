export interface TemplateError {
  message: string;
  severity: "error" | "warning";
  line: number;
  column: number;
  endColumn: number;
}

const SPECIAL_FIELDS = new Set([
  "Tags",
  "Type",
  "Deck",
  "Subdeck",
  "Card",
  "FrontSide",
  "CardFlag",
]);

const KNOWN_FILTERS = new Set([
  "text",
  "hint",
  "furigana",
  "kana",
  "kanji",
  "cloze",
  "type",
  "nc",
  "cloze-only",
]);

const TTS_PATTERN = /^tts\b/;
const CLOZE_CARD_PATTERN = /^c\d+$/;

function lineAndColumn(
  source: string,
  index: number
): { line: number; column: number } {
  const before = source.slice(0, index);
  const line = (before.match(/\n/g) ?? []).length + 1;
  const column = index - before.lastIndexOf("\n");
  return { line, column };
}

export function validateTemplate(
  template: string,
  fieldNames: string[]
): TemplateError[] {
  const errors: TemplateError[] = [];
  const knownFields = new Set(fieldNames);

  const tagRegex = /\{\{([^}]*)(\}\})?/g;
  const openStack: Array<{ name: string; index: number }> = [];

  let match: RegExpExecArray | null;

  const raw = template;

  while ((match = tagRegex.exec(raw)) !== null) {
    const inner = match[1];
    const closingBraces = match[2];
    const startIndex = match.index;

    if (!closingBraces) {
      const pos = lineAndColumn(raw, startIndex);
      const tag = `{{${inner}`;
      errors.push({
        message: `Missing closing }} for "${tag}"`,
        severity: "error",
        line: pos.line,
        column: pos.column,
        endColumn: pos.column + tag.length,
      });
      continue;
    }

    if (inner.startsWith("#") || inner.startsWith("^")) {
      const fieldName = inner.slice(1).trim();
      if (!CLOZE_CARD_PATTERN.test(fieldName)) {
        openStack.push({ name: fieldName, index: startIndex });
      }
      continue;
    }

    if (inner.startsWith("/")) {
      const fieldName = inner.slice(1).trim();
      if (CLOZE_CARD_PATTERN.test(fieldName)) {
        continue;
      }
      const pos = lineAndColumn(raw, startIndex);
      if (openStack.length === 0) {
        errors.push({
          message: `Found {{/${fieldName}}}, but no matching {{#${fieldName}}} or {{^${fieldName}}}`,
          severity: "error",
          line: pos.line,
          column: pos.column,
          endColumn: pos.column + match[0].length,
        });
        continue;
      }
      const last = openStack[openStack.length - 1];
      if (last.name !== fieldName) {
        errors.push({
          message: `Found {{/${fieldName}}}, but expected {{/${last.name}}}`,
          severity: "error",
          line: pos.line,
          column: pos.column,
          endColumn: pos.column + match[0].length,
        });
      }
      openStack.pop();
      continue;
    }

    const colonIndex = inner.indexOf(":");
    if (colonIndex !== -1) {
      const filterPart = inner.slice(0, colonIndex).trim();
      const fieldPart = inner.slice(colonIndex + 1).trim();

      if (TTS_PATTERN.test(filterPart)) {
        continue;
      }

      const baseFilter = filterPart.split(" ")[0];
      if (KNOWN_FILTERS.has(baseFilter)) {
        if (!SPECIAL_FIELDS.has(fieldPart) && !knownFields.has(fieldPart)) {
          const pos = lineAndColumn(raw, startIndex);
          errors.push({
            message: `Found '{{${inner}}}', but there is no field called '${fieldPart}'`,
            severity: "error",
            line: pos.line,
            column: pos.column,
            endColumn: pos.column + match[0].length,
          });
        }
        continue;
      }
      continue;
    }

    const fieldName = inner.trim();

    if (SPECIAL_FIELDS.has(fieldName)) {
      continue;
    }

    if (!knownFields.has(fieldName)) {
      const pos = lineAndColumn(raw, startIndex);
      errors.push({
        message: `Found '{{${fieldName}}}', but there is no field called '${fieldName}'`,
        severity: "error",
        line: pos.line,
        column: pos.column,
        endColumn: pos.column + match[0].length,
      });
    }
  }

  for (const open of openStack) {
    const pos = lineAndColumn(raw, open.index);
    errors.push({
      message: `Missing closing {{/${open.name}}} for {{#${open.name}}} or {{^${open.name}}}`,
      severity: "error",
      line: pos.line,
      column: pos.column,
      endColumn: pos.column + open.name.length + 4,
    });
  }

  return errors;
}

export function validateCss(css: string): TemplateError[] {
  const errors: TemplateError[] = [];
  const lines = css.split("\n");

  let openBraces = 0;
  let openBraceLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    for (const ch of line) {
      if (ch === "{") {
        openBraces++;
        openBraceLine = lineNumber;
      } else if (ch === "}") {
        openBraces--;
        if (openBraces < 0) {
          errors.push({
            message: "Unexpected } — no matching opening {",
            severity: "error",
            line: lineNumber,
            column: 1,
            endColumn: line.length + 1,
          });
          openBraces = 0;
        }
      }
    }

    if (/:\s*;/.test(line) || /:\s*}/.test(line)) {
      errors.push({
        message: "Empty CSS property value",
        severity: "error",
        line: lineNumber,
        column: 1,
        endColumn: line.length + 1,
      });
    }
  }

  if (openBraces > 0) {
    errors.push({
      message: `Missing closing } — ${openBraces} unclosed block(s)`,
      severity: "error",
      line: openBraceLine,
      column: 1,
      endColumn: 1,
    });
  }

  return errors;
}
