"use client";
import { useState } from "react";

export default function SearchBar({ value, onChange, onAsk, onClear, onCopy, disabled }) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onAsk();
      }
    }
  };

  return (
    <div className="search-container">
      <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
        <textarea
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask about company policies... (e.g., How many sick leaves do I get?)"
          aria-label="Ask a policy question"
          rows={2}
          disabled={disabled}
        />
        
        <div className="input-actions">
          {value.trim() && !disabled && (
            <button
              className="action-btn secondary"
              onClick={onClear}
              aria-label="Clear input"
              title="Clear"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          
          <button
            className="action-btn primary"
            onClick={onAsk}
            disabled={disabled || !value.trim()}
            aria-label={disabled ? "Sending..." : "Send message"}
            title={disabled ? "Sending..." : "Send (Enter)"}
            type="button"
          >
            {disabled ? (
              <svg className="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="bottom-actions">
        <button
          className="utility-btn"
          onClick={onCopy}
          disabled={!value.trim()}
          title="Copy question"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy</span>
        </button>

        <span className="hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line
        </span>
      </div>

      <style jsx>{`
        .search-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-wrapper {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: var(--panel-2);
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 8px 8px 8px 16px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-wrapper.focused {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--brand) 15%, transparent);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-size: 1rem;
          line-height: 1.5;
          resize: none;
          font-family: inherit;
          padding: 6px 0;
          max-height: 120px;
          overflow-y: auto;
          min-height: 24px;
        }

        .search-input::placeholder {
          color: var(--muted);
        }

        .search-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-actions {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 8px;
          min-width: 36px;
          min-height: 36px;
        }

        .action-btn svg {
          width: 20px;
          height: 20px;
        }

        .action-btn.primary {
          background: var(--brand);
          color: white;
        }

        .action-btn.primary:hover:not(:disabled) {
          background: color-mix(in oklab, var(--brand) 85%, black);
          transform: scale(1.05);
        }

        .action-btn.primary:active:not(:disabled) {
          transform: scale(0.95);
        }

        .action-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.secondary {
          background: transparent;
          color: var(--muted);
        }

        .action-btn.secondary:hover {
          background: color-mix(in oklab, var(--text) 8%, transparent);
          color: var(--text);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bottom-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding: 0 8px;
          gap: 12px;
        }

        .utility-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .utility-btn svg {
          width: 16px;
          height: 16px;
          color: var(--muted);
        }

        .utility-btn:hover:not(:disabled) {
          background: var(--panel-2);
          border-color: var(--brand);
        }

        .utility-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .hint {
          font-size: 0.8rem;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        kbd {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--text);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-wrapper {
            padding: 6px 6px 6px 12px;
            border-radius: 14px;
          }

          .search-input {
            font-size: 0.95rem;
            padding: 4px 0;
          }

          .action-btn {
            min-width: 32px;
            min-height: 32px;
            padding: 6px;
          }

          .action-btn svg {
            width: 18px;
            height: 18px;
          }

          .bottom-actions {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 8px;
          }

          .hint {
            font-size: 0.75rem;
            width: 100%;
          }

          .utility-btn {
            padding: 5px 10px;
            font-size: 0.8rem;
          }

          .utility-btn svg {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          .search-input::placeholder {
            font-size: 0.9rem;
          }

          .hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
