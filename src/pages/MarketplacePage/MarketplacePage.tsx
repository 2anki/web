import { useEffect, useState } from 'react';

interface PublicTemplate {
  id: string;
  ownerName: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
}

function TemplateCard({ template }: Readonly<{ template: PublicTemplate }>) {
  const handleDownload = async () => {
    const response = await fetch('/api/templates/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteType: (template as any).noteType,
        previewData: (template as any).previewData,
      }),
    });

    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.apkg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-content">
        <p className="title is-5">{template.name}</p>
        {template.description && (
          <p className="subtitle is-6">{template.description}</p>
        )}
        {template.tags && template.tags.length > 0 && (
          <div className="tags">
            {template.tags.map((tag) => (
              <span key={tag} className="tag is-light">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="is-size-7 has-text-grey">By {template.ownerName}</p>
      </div>
      <div className="card-footer">
        <button
          className="card-footer-item button is-link is-light"
          onClick={handleDownload}
        >
          Download APKG
        </button>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates/public')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load templates');
        return r.json();
      })
      .then(setTemplates)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading templates…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-2">Template Marketplace</h1>
        <p className="subtitle mb-5">
          Community-shared Anki note type templates. Download any as a
          ready-to-import APKG.
        </p>

        {error && (
          <div className="notification is-danger is-light">{error}</div>
        )}

        {!error && templates.length === 0 && (
          <div className="notification is-info is-light">
            No templates have been shared yet. Be the first!
          </div>
        )}

        <div className="columns is-multiline">
          {templates.map((template) => (
            <div key={template.id} className="column is-4">
              <TemplateCard template={template} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
