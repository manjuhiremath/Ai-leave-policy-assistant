"use client";
export default function SearchBar({ value, onChange, onAsk, onClear, onCopy, disabled }) {
  return (
    <div className="searchRow">
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="How many casual leaves do I get per year?"
        aria-label="Ask a policy question"
      />
      <button className="btn primary" onClick={onAsk} disabled={disabled || !value.trim()}>
        {disabled ? "Asking..." : "Ask"}
      </button>
      <button className="btn" onClick={onClear}>
        Clear
      </button>
      <button className="btn ghost" onClick={onCopy} disabled={!value.trim()}>
        Copy
      </button>
    </div>
  );
}
