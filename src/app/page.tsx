"use client";

import { useState } from "react";

interface TriageResult {
  intent: string;
  urgency: "low" | "medium" | "high";
  reasoning: string;
  suggested_reply: {
    english: string;
    arabic: string;
  };
  confidence: number;
  escalate: boolean;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState("");

  const analyzeEmail = async () => {
    if (!email.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to analyze email");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setEmail("");
    setResult(null);
    setError("");
  };

  return (
    <main className="container">
      <header style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "2.5rem" }}>🍼</span>
          <h1 style={{ fontSize: "2.5rem", color: "var(--primary)" }}>MomsCare <span style={{ color: "var(--text-main)" }}>AI</span></h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Premium Customer Support Triage Assistant</p>
      </header>

      <div className="glass-card">
        <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Analyze Customer Email</h2>
        <textarea
          placeholder="Paste the customer email here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <button 
            className="premium-btn" 
            onClick={analyzeEmail}
            disabled={loading || !email.trim()}
            style={{ flex: 2 }}
          >
            {loading ? (
              <>Processing<span className="loading-dots"></span></>
            ) : (
              <>Analyze Email 🚀</>
            )}
          </button>
          <button 
            className="premium-btn" 
            onClick={clearAll}
            disabled={loading}
            style={{ flex: 1, background: "rgba(0,0,0,0.05)", color: "var(--text-main)" }}
          >
            Clear
          </button>
        </div>

        {error && (
          <p style={{ color: "var(--error)", marginTop: "1rem", textAlign: "center", fontWeight: "600" }}>{error}</p>
        )}
      </div>

      {result && (
        <div className="glass-card result-card" style={{ marginTop: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem" }}>Analysis Results</h2>
            {result.escalate && (
              <span className="badge badge-high" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>⚠️ Escalation Required</span>
            )}
          </div>

          <div className="grid">
            <div>
              <span className="field-label">Intent</span>
              <div className="field-value" style={{ textTransform: "capitalize", color: "var(--primary)" }}>
                {result.intent.replace("_", " ")}
              </div>

              <span className="field-label">Urgency</span>
              <div className="field-value">
                <span className={`badge badge-${result.urgency}`}>{result.urgency}</span>
              </div>

              <span className="field-label">Confidence Score</span>
              <div className="field-value">{(result.confidence * 100).toFixed(0)}%</div>
            </div>

            <div>
              <span className="field-label">AI Reasoning</span>
              <div className="field-value" style={{ fontSize: "1rem", fontStyle: "italic" }}>
                &quot;{result.reasoning}&quot;
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Suggested Replies</h3>
            
            <div className="grid">
              <div>
                <span className="field-label">English (Professional)</span>
                <div className="reply-box">{result.suggested_reply.english}</div>
              </div>
              <div>
                <span className="field-label">Arabic (Natural Tone)</span>
                <div className="reply-box arabic-text">{result.suggested_reply.arabic}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: "4rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        &copy; {new Date().getFullYear()} MomsCare AI. Powered by Next.js & Advanced Triage Logic.
      </footer>
    </main>
  );
}
