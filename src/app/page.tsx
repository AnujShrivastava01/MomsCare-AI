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

const Icons = {
  Brain: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3-4-3-4.5c0-.3.2-.5.5-.5a1 1 0 0 1 1 1v2h2l1-1h3v-3h-1l-1 1h-2V7a3 3 0 0 0-6 0v1H8a3 3 0 0 0-6 0v1h2l1 1h3v3h1l1-1h2v-2a1 1 0 0 1 1-1c.3 0 .5.2.5.5 0 .5-1 2.9-3 4.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
    </svg>
  ),
  Alert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
  )
};

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
      setError("Analysis engine encountered an error. Please try again.");
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
    <div className="app-shell">
      <nav className="top-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "var(--primary)", color: "white", padding: "8px", borderRadius: "10px" }}>
            <Icons.Brain />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "Outfit" }}>NurtureFlow <span style={{ color: "var(--primary)" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: "20px", fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>
          <span>Dashboard</span>
          <span>History</span>
          <span>Settings</span>
        </div>
      </nav>

      <main className="container">
        <section className="hero-section">
          <h1>Smart Support Triage</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
            Automated intelligence for mother & baby e-commerce support. Analyze intent, detect urgency, and generate natural replies instantly.
          </p>
        </section>

        <div className="card">
          <div className="card-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem" }}>Customer Communication</h2>
              <span className="badge" style={{ background: "#F1F5F9", color: "#64748B" }}>New Analysis</span>
            </div>
            
            <div className="input-group">
              <textarea
                placeholder="Paste the customer email content here to begin triage..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="btn-row">
              <button 
                className="btn btn-primary" 
                onClick={analyzeEmail}
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <span className="pulse">Processing Triage...</span>
                ) : (
                  <><Icons.Brain /> Analyze with NurtureFlow</>
                )}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={clearAll}
                disabled={loading}
              >
                Clear
              </button>
            </div>

            {error && (
              <p style={{ color: "var(--error)", marginTop: "1rem", textAlign: "center", fontWeight: "600", fontSize: "0.9rem" }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {result && (
          <div className="result-container" style={{ animation: "fadeIn 0.5s ease-out" }}>
            <aside>
              <div className={`stat-card urgency-${result.urgency}`}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Urgency Level</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "capitalize" }}>{result.urgency}</span>
                  <span className={`badge badge-${result.urgency === 'high' ? 'error' : result.urgency === 'medium' ? 'warning' : 'success'}`}>
                    {result.urgency} Priority
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Detected Intent</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, textTransform: "capitalize", color: "var(--primary)", marginTop: "4px" }}>
                  {result.intent.replace("_", " ")}
                </div>
              </div>

              <div className="stat-card">
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Confidence Score</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "4px" }}>
                  {(result.confidence * 100).toFixed(0)}%
                </div>
              </div>

              {result.escalate && (
                <div className="stat-card" style={{ background: "#FEF2F2", borderLeftColor: "var(--error)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--error)", fontWeight: 700 }}>
                    <Icons.Alert /> Critical Attention
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#991B1B", marginTop: "4px" }}>This ticket requires immediate manager oversight.</p>
                </div>
              )}
            </aside>

            <div className="card">
              <div className="card-content">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
                  <Icons.Sparkles />
                  <h3 style={{ fontSize: "1.25rem" }}>AI Generation Result</h3>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Analysis Reasoning</span>
                  <p style={{ marginTop: "8px", color: "var(--text-main)", fontStyle: "italic", lineHeight: 1.6 }}>
                    &quot;{result.reasoning}&quot;
                  </p>
                </div>

                <div className="reply-container">
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Suggested Response (English)</span>
                  <div className="reply-text" style={{ marginTop: "8px" }}>
                    {result.suggested_reply.english}
                  </div>

                  <div className="arabic-reply">
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>الرد المقترح (العربية)</span>
                    <div className="reply-text">
                      {result.suggested_reply.arabic}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "10px" }}>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: "0.85rem" }}>Copy Reply</button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: "0.85rem" }}>Send to Customer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: "auto", padding: "2rem", textAlign: "center", borderTop: "1px solid #E2E8F0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        &copy; {new Date().getFullYear()} NurtureFlow AI &bull; Intelligent Triage Engine v1.2
      </footer>
    </div>
  );
}
