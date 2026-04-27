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
  Heart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Alert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Baby: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3" /><path d="M12 2v2" /><path d="M12 8a2 2 0 0 1 2 2" />
    </svg>
  ),
  Magic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21 19 7" /><path d="M15 3h4v4" /><path d="M15 7 21 1" /><path d="m3 11 4-4" /><path d="m13 21 4-4" />
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
      setError("MomsCare engine encountered an error. Please try again.");
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
          <div style={{ background: "var(--primary)", color: "white", padding: "10px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.Baby />
          </div>
          <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "Outfit", color: "var(--text-main)" }}>MomsCare <span style={{ color: "var(--primary)" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: "25px", fontSize: "0.95rem", fontWeight: 600, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--primary)" }}>Triage</span>
          <span>Insights</span>
          <span>Settings</span>
        </div>
      </nav>

      <main className="container">
        <section className="hero-section">
          <h1>Customer Care <span style={{ color: "var(--secondary)" }}>Simplified</span></h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.25rem", maxWidth: "650px", margin: "0 auto", fontWeight: 500 }}>
            Advanced AI triage for mothers & baby products support. Provide empathetic, accurate responses in seconds.
          </p>
        </section>

        <div className="card">
          <div className="card-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "10px" }}>
                <Icons.Heart /> Analyze New Email
              </h2>
              <span className="badge" style={{ background: "rgba(255, 133, 162, 0.1)", color: "var(--primary)" }}>Active Session</span>
            </div>
            
            <textarea
              placeholder="Paste the customer email here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <div className="btn-row">
              <button 
                className="btn btn-primary" 
                onClick={analyzeEmail}
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <span className="pulse">MomsCare is Thinking...</span>
                ) : (
                  <><Icons.Magic /> Run Analysis</>
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
              <p style={{ color: "var(--error)", marginTop: "1.25rem", textAlign: "center", fontWeight: "700", fontSize: "0.95rem" }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {result && (
          <div className="result-container" style={{ animation: "fadeIn 0.6s ease-out" }}>
            <aside>
              <div className={`stat-card urgency-${result.urgency}`}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Urgency</span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                  <span style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "capitalize" }}>{result.urgency}</span>
                  <span className={`badge badge-${result.urgency === 'high' ? 'error' : result.urgency === 'medium' ? 'warning' : 'success'}`}>
                    {result.urgency} Priority
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Core Intent</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, textTransform: "capitalize", color: "var(--primary)", marginTop: "6px" }}>
                  {result.intent.replace("_", " ")}
                </div>
              </div>

              <div className="stat-card">
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Confidence</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "6px" }}>
                  {(result.confidence * 100).toFixed(0)}%
                </div>
              </div>

              {result.escalate && (
                <div className="stat-card" style={{ background: "#FFF5F5", borderLeftColor: "var(--error)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--error)", fontWeight: 800 }}>
                    <Icons.Alert /> Needs Escalation
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#C53030", marginTop: "6px", fontWeight: 500 }}>Critical ticket requires immediate attention.</p>
                </div>
              )}
            </aside>

            <div className="card">
              <div className="card-content">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.75rem" }}>
                  <Icons.Baby />
                  <h3 style={{ fontSize: "1.5rem" }}>Triage Insights</h3>
                </div>

                <div style={{ marginBottom: "2.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>AI Reasoning</span>
                  <p style={{ marginTop: "10px", color: "var(--text-main)", fontStyle: "italic", lineHeight: 1.7, fontSize: "1.1rem" }}>
                    &quot;{result.reasoning}&quot;
                  </p>
                </div>

                <div className="reply-container">
                  <div style={{ marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>English Suggestion</span>
                    <div className="reply-text" style={{ marginTop: "10px", fontWeight: 500 }}>
                      {result.suggested_reply.english}
                    </div>
                  </div>

                  <div className="arabic-reply">
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "10px" }}>الاقتراح باللغة العربية</span>
                    <div className="reply-text" style={{ fontWeight: 500 }}>
                      {result.suggested_reply.arabic}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }}>Copy To Clipboard</button>
                  <button className="btn btn-primary" style={{ flex: 1.5 }}>Send Response Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: "auto", padding: "2.5rem", textAlign: "center", borderTop: "1px solid rgba(255, 133, 162, 0.1)", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
        &copy; {new Date().getFullYear()} MomsCare AI &bull; Empathy-Driven Support Logic
      </footer>
    </div>
  );
}
