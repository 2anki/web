import { useEffect, useState } from 'react';
import { TemplateProject } from '../../pages/TemplatesPage/types/AnkiNoteType';

async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(path, init);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function useUserTemplates(): TemplateProject[] {
  const [templates, setTemplates] = useState<TemplateProject[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [defaults, userData] = await Promise.all([
        fetchJson<Partial<TemplateProject>[]>('/api/templates/defaults'),
        fetchJson<{ templates: TemplateProject[]; hiddenIds: string[] }>(
          '/api/templates/user',
          { credentials: 'include' }
        ),
      ]);

      const hidden = new Set(userData?.hiddenIds ?? []);
      const defaultList = (defaults ?? [])
        .filter((t): t is TemplateProject => !!t?.id)
        .filter((t) => !hidden.has(t.id));
      const userList = userData?.templates ?? [];

      const seen = new Set<string>();
      const merged: TemplateProject[] = [];
      for (const item of [...defaultList, ...userList]) {
        if (!item?.id || seen.has(item.id)) continue;
        seen.add(item.id);
        merged.push(item);
      }

      if (!cancelled) setTemplates(merged);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return templates;
}
