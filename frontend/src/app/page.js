"use client";

import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import CitationsList from "../../components/CitationsList";
import EscalationCard from "../../components/EscalationCard";
import ThemeToggle from "../../components/ThemeToggle";
import Loader from "../../components/Loader";
import AnswerCard from "../../components/AnswerCard";

export default function Home() {
  const [q, setQ] = useState("");
  const [resp, setResp] = useState(null);
  const [loading, setLoading] = useState(false);

  const onAsk = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, filters: {}, top_k: 5 }),
      });
      if (!r.ok) throw new Error("Request failed");
      const data = await r.json();
      setResp(data);
    } catch {
      setResp({
        answer: "I don’t have that in policy. Please contact HR.",
        citations: [],
        policy_matches: [],
        confidence: "low",
        disclaimer: "",
        metadata: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onClear = () => { setQ(""); setResp(null); };
  const onCopy = async () => { if (resp?.answer) await navigator.clipboard.writeText(resp.answer); };

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">HR Policy Assistant</h1>
        <ThemeToggle />
      </header>

      <section className="card">
        <SearchBar
          value={q}
          onChange={setQ}
          onAsk={onAsk}
          onClear={onClear}
          onCopy={onCopy}
          disabled={loading}
        />
        {loading && (
          <div className="footer">
            <span className="spinner" /> <span>Fetching answer…</span>
          </div>
        )}
      </section>

      {resp && (
        <section style={{ marginTop: 12 }}>
          <div className="grid">
            <AnswerCard resp={resp} />
            <CitationsList citations={resp.citations || []} />
          </div>
          <EscalationCard />
        </section>
      )}
    </main>
  );
}
