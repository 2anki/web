const modules = import.meta.glob('./content/**/*.{md,mdx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface DocFrontmatter {
  title?: string;
  description?: string;
  template?: string;
}

export interface LoadedDoc {
  frontmatter: DocFrontmatter;
  body: string;
}

function unquote(value: string): string {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

function isKeyChar(code: number): boolean {
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    code === 95 ||
    code === 45
  );
}

function isKeyStart(code: number): boolean {
  return (
    (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95
  );
}

function parseFrontmatterLine(line: string): [string, string] | null {
  if (line.length === 0 || !isKeyStart(line.charCodeAt(0))) return null;
  let i = 1;
  while (i < line.length && isKeyChar(line.charCodeAt(i))) i++;
  const key = line.slice(0, i);
  while (i < line.length && line.charCodeAt(i) === 32) i++;
  if (i >= line.length || line.charCodeAt(i) !== 58) return null;
  i++;
  while (i < line.length && line.charCodeAt(i) === 32) i++;
  return [key, unquote(line.slice(i).trim())];
}

function splitLines(input: string): string[] {
  const lines: string[] = [];
  let start = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c === 10) {
      const end =
        i > start && input.charCodeAt(i - 1) === 13 ? i - 1 : i;
      lines.push(input.slice(start, end));
      start = i + 1;
    }
  }
  if (start < input.length) lines.push(input.slice(start));
  return lines;
}

function parseFrontmatter(raw: string): LoadedDoc {
  let offset: number;
  if (raw.startsWith('---\n')) offset = 4;
  else if (raw.startsWith('---\r\n')) offset = 5;
  else return { frontmatter: {}, body: raw };

  const closeIdx = raw.indexOf('\n---', offset);
  if (closeIdx === -1) return { frontmatter: {}, body: raw };

  const fmBlock = raw.slice(offset, closeIdx);
  let bodyStart = closeIdx + 4;
  if (raw.charCodeAt(bodyStart) === 13) bodyStart++;
  if (raw.charCodeAt(bodyStart) === 10) bodyStart++;
  const body = raw.slice(bodyStart);

  const frontmatter: DocFrontmatter = {};
  for (const line of splitLines(fmBlock)) {
    const kv = parseFrontmatterLine(line);
    if (kv) (frontmatter as Record<string, string>)[kv[0]] = kv[1];
  }

  return { frontmatter, body };
}

const ASSET_PATH = /\]\((?:\.\.\/){1,8}assets\/([^)\s]{1,256})\)/g;

function rewriteAssetPaths(body: string): string {
  return body.replace(ASSET_PATH, '](/docs-assets/$1)');
}

function slugFromPath(path: string): string {
  const prefix = './content/';
  const start = path.startsWith(prefix) ? prefix.length : 0;
  let end = path.length;
  if (path.endsWith('.mdx')) end -= 4;
  else if (path.endsWith('.md')) end -= 3;
  return path.slice(start, end);
}

const docs: Record<string, LoadedDoc> = {};
for (const [path, raw] of Object.entries(modules)) {
  const slug = slugFromPath(path);
  const parsed = parseFrontmatter(raw);
  docs[slug] = {
    frontmatter: parsed.frontmatter,
    body: rewriteAssetPaths(parsed.body),
  };
}

export function loadDoc(slug: string): LoadedDoc | null {
  return docs[slug] ?? null;
}

export function hasDoc(slug: string): boolean {
  return Object.hasOwn(docs, slug);
}
