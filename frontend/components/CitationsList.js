import { useState, useMemo } from "react";

export default function CitationsList({ citations }) {
  const [open, setOpen] = useState({}); // {index: boolean}

  const toggle = (idx) => setOpen((p) => ({ ...p, [idx]: !p[idx] }));

  const items = useMemo(() => citations || [], [citations]);

  const formatDocName = (docId = "") =>
    docId
      .replace(/_/g, " ")
      .replace(/\.(txt|md|pdf)$/, "")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const cleanSnippet = (snippet = "") =>
    snippet
      .replace(/#\s*policies\/[^\n]+\n/, "")
      .replace(/[#*_]{2,}/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

  if (!items.length) {
    return (
      <div className="citations-container">
        <h3 className="citations-heading">📚 Policy References</h3>
        <div className="no-citations">
          <p>No specific references used in this response.</p>
        </div>

        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="citations-container">
      <h3 className="citations-heading">📚 Policy References</h3>

      <div className="citations-list">
        {items.map((c, i) => {
          const title = formatDocName(c.doc_id);
          const expanded = !!open[i];

          return (
            <div key={`${c.doc_id}-${i}`} className="citation-item">
              <button
                type="button"
                className="citation-toggle"
                onClick={() => toggle(i)}
                aria-expanded={expanded}
                aria-controls={`citation-panel-${i}`}
                title={expanded ? "Collapse" : "Expand"}
              >
                <span className="doc">
                  <span className="doc-icon" aria-hidden>📄</span>
                  <span className="doc-name">{title}</span>
                </span>
                <span className="chevron" aria-hidden>
                  {expanded ? "▾" : "▸"}
                </span>
              </button>

              <div
                id={`citation-panel-${i}`}
                className={`panel ${expanded ? "open" : ""}`}
                role="region"
                aria-label={`${title} details`}
              >
                <div className="citation-preview">{cleanSnippet(c.snippet || "")}</div>

                <div className="citation-meta">
                  <span className="page-info">
                    {c.page ? `Page ${c.page}` : "Relevant section"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
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
  gap: 0.5rem;
}

.citation-item {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.citation-toggle {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  background: transparent;
  color: var(--text);
  border: 0;
  padding: 0.75rem 0.85rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s, border-color 0.2s;
}

.citation-toggle:hover {
  background: color-mix(in oklab, var(--brand) 6%, var(--panel-2));
}

.citation-toggle:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
  border-radius: 8px;
}

.doc {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.doc-icon {
  font-size: 0.95rem;
  color: var(--brand);
}

.doc-name {
  font-size: 0.95rem;
  color: var(--text);
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.chevron {
  font-size: 0.95rem;
  color: var(--muted);
}

.panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 220ms ease, opacity 180ms ease;
  opacity: 0.0;
  border-top: 1px solid transparent;
}

.panel.open {
  max-height: 240px; /* enough for ~4 lines + meta */
  opacity: 1.0;
  border-top: 1px solid var(--border);
}

.citation-preview {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
  padding: 0.5rem 0.85rem 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.citation-meta {
  display: flex;
  justify-content: flex-end;
  padding: 0 0.85rem 0.7rem;
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
  .citations-container { padding: 0.75rem; }
  .citation-toggle { padding: 0.65rem 0.7rem; }
  .doc-name { font-size: 0.9rem; }
  .citation-preview { font-size: 0.85rem; -webkit-line-clamp: 3; }
  .page-info { font-size: 0.7rem; }
}
`;
