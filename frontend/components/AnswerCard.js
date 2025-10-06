export default function AnswerCard({ resp }) {
  return (
    <article className="answer-card" aria-live="polite">
      <header className="answer-header">
        <h3 className="answer-title">🧠 Answer</h3>
        <span className={`confidence ${resp?.confidence || 'n/a'}`}>
          {resp?.confidence ? resp.confidence.toUpperCase() : 'N/A'}
        </span>
      </header>

      <p className="answer-text">{resp?.answer}</p>

      {resp?.disclaimer ? (
        <p className="disclaimer">{resp.disclaimer}</p>
      ) : null}

      <style jsx>{`
        .answer-card {
          background: var(--panel-2);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }

        .answer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 8px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }

        .answer-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .confidence {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: color-mix(in oklab, var(--text) 6%, transparent);
          white-space: nowrap;
        }
        .confidence.high {
          color: var(--ok);
          border-color: color-mix(in oklab, var(--ok) 30%, transparent);
          background: color-mix(in oklab, var(--ok) 12%, transparent);
        }
        .confidence.medium {
          color: var(--warn);
          border-color: color-mix(in oklab, var(--warn) 30%, transparent);
          background: color-mix(in oklab, var(--warn) 12%, transparent);
        }
        .confidence.low {
          color: var(--muted);
          border-color: var(--border);
          background: color-mix(in oklab, var(--muted) 12%, transparent);
        }

        .answer-text {
          margin: 8px 0 6px;
          line-height: 1.7;
          font-size: 0.98rem;
          color: var(--text);
        }

        .disclaimer {
          margin: 4px 0 0;
          font-size: 0.85rem;
          color: var(--muted);
          background: var(--panel);
          border: 1px solid var(--border);
          border-left: 3px solid var(--brand);
          padding: 8px 10px;
          border-radius: 8px;
        }

        @media (max-width: 640px) {
          .answer-card {
            padding: 12px;
          }
          .answer-text {
            font-size: 0.95rem;
            line-height: 1.6;
          }
        }
      `}</style>
    </article>
  );
}
