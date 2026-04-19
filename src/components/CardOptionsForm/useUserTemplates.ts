import { useEffect, useState } from 'react';
import TemplateApiService from '../../pages/TemplatesPage/services/TemplateApiService';
import { TemplateProject } from '../../pages/TemplatesPage/types/AnkiNoteType';

export function useUserTemplates(): TemplateProject[] {
  const [templates, setTemplates] = useState<TemplateProject[]>([]);

  useEffect(() => {
    let cancelled = false;
    TemplateApiService.getInstance()
      .getUserTemplates()
      .then((list) => {
        if (!cancelled) setTemplates(list);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return templates;
}
