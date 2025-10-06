"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (val) => {
    const root = document.documentElement;
    if (val === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", val);
    }
  };

  const nextMode = () => (theme === "dark" ? "light" : "dark");

  const onToggle = () => {
    const next = nextMode();
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  if (!mounted) return null;

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={label}
      aria-live="polite"
      title={label}
      type="button"
    >
      <div className="icon-wrapper">
        {/* Sun Icon - visible in dark mode */}
        <svg
          className={`icon sun ${!isDark ? 'visible' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        {/* Moon Icon - visible in light mode */}
        <svg
          className={`icon moon ${isDark ? 'visible' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      <span className="label">
        {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
      </span>

      <style jsx>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--panel);
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          border-color: var(--brand);
          background: var(--panel-2);
          transform: translateY(-1px);
        }

        .theme-toggle:active {
          transform: translateY(0);
        }

        .theme-toggle:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
        }

        .icon-wrapper {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon {
          position: absolute;
          width: 20px;
          height: 20px;
          color: var(--text);
          opacity: 0;
          transform: scale(0.5) rotate(-90deg);
          transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .icon.visible {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .sun {
          color: var(--warn, #f59e0b);
        }

        .moon {
          color: var(--brand, #6ea8fe);
        }

        .label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--muted);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .theme-toggle {
            padding: 8px;
            gap: 0;
          }
          .label {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
