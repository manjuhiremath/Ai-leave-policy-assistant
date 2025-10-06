export default function CitationsList({ citations }) {
  const formatDocName = (docId) => {
    return docId
      .replace(/_/g, ' ')
      .replace(/\.(txt|md|pdf)$/, '')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const cleanSnippet = (snippet = '') => {
    return snippet
      .replace(/#\s*policies\/[^\n]+\n/, '')
      .replace(/[#*_]{2,}/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();
  };

  return (
    <div className="citations-container">
      <h3 className="citations-heading">📚 Policy References</h3>
      
      {citations?.length ? (
        <div className="citations-list">
          {citations.map((citation, index) => (
            <div key={index} className="citation-item">
              <div className="citation-source">
                <span className="doc-icon">📄</span>
                <span className="doc-name">{formatDocName(citation.doc_id)}</span>
              </div>
              
              <div className="citation-preview">
                {cleanSnippet(citation.snippet)}
              </div>
              
              <div className="citation-meta">
                <span className="page-info">
                  {citation.page ? `Page ${citation.page}` : 'Relevant section'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-citations">
          <p>No specific references used in this response.</p>
        </div>
      )}

      <style jsx>{`
        .citations-container {
          padding: 1rem;
          background: var(--panel);
          border-radius: 8px;
          border: 1px solid var(--border);
          border-left: 4px solid var(--brand);
        }

        .citations-heading {
          margin: 0 0 1rem 0;
          color: var(--brand);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .citations-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .citation-item {
          padding: 0.75rem;
          background: var(--panel-2);
          border: 1px solid var(--border);
          border-radius: 6px;
          transition: background-color 0.2s, border-color 0.2s, transform 0.15s;
        }

        .citation-item:hover {
          background: color-mix(in oklab, var(--brand) 6%, var(--panel-2));
          border-color: color-mix(in oklab, var(--brand) 25%, var(--border));
          transform: translateX(2px);
        }

        .citation-source {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text);
        }

        .doc-icon {
          font-size: 0.9rem;
          color: var(--brand);
        }

        .doc-name {
          font-size: 0.9rem;
          color: var(--text);
        }

        .citation-preview {
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .citation-meta {
          display: flex;
          justify-content: flex-end;
        }

        .page-info {
          font-size: 0.75rem;
          color: var(--muted);
          background: color-mix(in oklab, var(--text) 6%, transparent);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--border);
        }

        .no-citations {
          text-align: center;
          color: var(--muted);
          font-style: italic;
          padding: 1rem;
          background: var(--panel-2);
          border-radius: 6px;
          border: 1px dashed var(--border);
        }

        @media (max-width: 768px) {
          .citations-container {
            padding: 0.75rem;
          }
          .citation-item {
            padding: 0.65rem;
          }
          .doc-name,
          .citation-source {
            font-size: 0.88rem;
          }
          .citation-preview {
            font-size: 0.82rem;
            -webkit-line-clamp: 2;
          }
          .page-info {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
