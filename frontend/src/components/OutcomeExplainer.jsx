import React, { useState } from "react";
import "./OutcomeExplainer.css";

/**
 * OutcomeExplainer Component
 *
 * Generates audit-ready explanations for case outcomes.
 * Uses deterministic, rule-based logic (no ML).
 * Explains:
 * - Why the case failed or escalated
 * - Which SOP steps were missed
 * - Primary cause of delay
 */

function OutcomeExplainer({ caseId }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerateExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${apiBase}/api/case/${caseId}/explanation`
      );
      if (!response.ok) throw new Error("Failed to generate explanation");
      const data = await response.json();
      setExplanation(data.explanation);
      setGenerated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outcome-explainer">
      <h2>Outcome Explanation</h2>
      <p className="explainer-subtitle">
        Deterministic, audit-ready analysis of case failure
      </p>

      {!generated ? (
        <div className="pre-generation">
          <p>
            Click below to generate a rule-based explanation of why this case
            escalated, which SOP steps were missed, and who caused the primary
            delay.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleGenerateExplanation}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Outcome Explanation"}
          </button>
        </div>
      ) : (
        <div className="post-generation">
          {error && <div className="error-message">Error: {error}</div>}
          {explanation && (
            <div className="explanation-box">
              <p className="explanation-text">{explanation}</p>
              <div className="explanation-footer">
                <span className="explanation-note">
                  ✓ Rule-based analysis • No predictions • Audit-ready
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setGenerated(false);
                    setExplanation(null);
                  }}
                >
                  Generate Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OutcomeExplainer;
