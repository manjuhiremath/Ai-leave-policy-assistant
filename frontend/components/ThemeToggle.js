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

  const onToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  if (!mounted) return null;

  return (
    <button className="btn" onClick={onToggle} aria-label="Toggle theme">
      Theme: {theme === "system" ? "system" : theme}
    </button>
  );
}
