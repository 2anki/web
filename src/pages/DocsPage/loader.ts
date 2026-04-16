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

function parseFrontmatter(raw: string): LoadedDoc {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { frontmatter: {}, body: raw };

  const [, fmBlock, body] = match;
  const frontmatter: DocFrontmatter = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    (frontmatter as Record<string, string>)[key] = value;
  }
  return { frontmatter, body };
}

function rewriteAssetPaths(body: string): string {
  return body.replace(
    /(!\[[^\]]*\]\()((?:\.\.\/)+)assets\/+([^)\s]+)(\))/g,
    (_m, open, _dots, name, close) => `${open}/docs-assets/${name}${close}`,
  );
}

const docs: Record<string, LoadedDoc> = {};
for (const [path, raw] of Object.entries(modules)) {
  const slug = path
    .replace(/^\.\/content\//, '')
    .replace(/\.(md|mdx)$/, '');
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
