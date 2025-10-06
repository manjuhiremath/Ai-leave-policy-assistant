export default function AnswerCard({ resp }) {
  // Function to parse and format text with basic markdown
  const formatText = (text) => {
    if (!text) return null;

    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);

    return paragraphs.map((paragraph, pIndex) => {
      // Check if this is a policy reference section
      const isPolicyRef = paragraph.includes('**Policy Reference:**');
      
      // Split by single newlines within paragraph
      const lines = paragraph.split('\n');

      if (isPolicyRef) {
        return (
          <div key={pIndex} className="policy-reference">
            {lines.map((line, lIndex) => {
              // Parse bold text
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <div key={lIndex} className="ref-line">
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
              );
            })}
          </div>
        );
      }

      // Regular paragraph - parse bold text
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIndex} className="answer-text">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <article className="answer-card" aria-live="polite">
      <header className="answer-header">
        <h3 className="answer-title"> Answer</h3>
        <span className={`confidence ${resp?.confidence || 'n/a'}`}>
          {resp?.confidence ? resp.confidence.toUpperCase() : 'N/A'}
        </span>
      </header>

      <div className="answer-content">
        {formatText(resp?.answer)}
      </div>

      {resp?.disclaimer && (
        <p className="disclaimer">
          {resp.disclaimer}
        </p>
      )}

      <style jsx>{`
        .answer-card {
          background: var(--panel-2);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .answer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }

        .answer-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.2px;
          color: var(--text);
        }

        .confidence {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 5px 10px;
          border-radius: 12px;
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

        .answer-content {
          line-height: 1.7;
        }

        .answer-text {
          margin: 0 0 12px 0;
          font-size: 1rem;
          color: var(--text);
          line-height: 1.75;
        }

        .answer-text:last-child {
          margin-bottom: 0;
        }

        .answer-text strong {
          font-weight: 600;
          color: var(--text);
        }

        .policy-reference {
          margin: 16px 0;
          padding: 12px 14px;
          background: color-mix(in oklab, var(--brand) 6%, transparent);
          border: 1px solid color-mix(in oklab, var(--brand) 20%, transparent);
          border-left: 4px solid var(--brand);
          border-radius: 8px;
        }

        .ref-line {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text);
          margin: 4px 0;
        }

        .ref-line:first-child {
          margin-top: 0;
        }

        .ref-line strong {
          font-weight: 600;
          color: var(--brand);
        }

        .disclaimer {
          margin: 12px 0 0;
          font-size: 0.88rem;
          color: var(--muted);
          background: var(--panel);
          border: 1px solid var(--border);
          border-left: 3px solid var(--warn);
          padding: 10px 12px;
          border-radius: 8px;
          line-height: 1.5;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .disclaimer-icon {
          flex-shrink: 0;
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .answer-card {
            padding: 14px;
          }
          
          .answer-header {
            margin-bottom: 10px;
            padding-bottom: 8px;
          }
          
          .answer-title {
            font-size: 1rem;
          }
          
          .answer-text {
            font-size: 0.95rem;
            line-height: 1.65;
          }
          
          .policy-reference {
            padding: 10px 12px;
            margin: 12px 0;
          }
          
          .ref-line {
            font-size: 0.88rem;
          }
          
          .disclaimer {
            font-size: 0.85rem;
            padding: 8px 10px;
          }
        }
      `}</style>
    </article>
  );
}
