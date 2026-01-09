import React from "react";
import CaseDetails from "./components/CaseDetails";
import ResponsibilityTimeline from "./components/ResponsibilityTimeline";
import OutcomeExplainer from "./components/OutcomeExplainer";
import "./App.css";

/**
 * TRACE Platform - Main Application
 *
 * Demonstrates accountability enforcement at the case level:
 * 1. Case Detail View - Shows exact case timeline and SLA adherence
 * 2. Responsibility Timeline - Breaks down who owns which days of delay
 * 3. Outcome Explainer - Provides audit-ready explanation of failure
 *
 * Core Philosophy:
 * - Accountability > dashboards
 * - Explanation > prediction
 * - Governance > automation
 */

function App() {
  const CASE_ID = "FDX-2025-087432";

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>TRACE Platform</h1>
          <p>Transparent Recovery Accountability & Case Engine</p>
        </div>
        <div className="header-subtitle">
          Enterprise Governance for Overdue Account Recovery
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Section 1: Case Details with Ledger */}
          <section className="section">
            <CaseDetails caseId={CASE_ID} />
          </section>

          {/* Section 2: Responsibility Timeline */}
          <section className="section">
            <ResponsibilityTimeline caseId={CASE_ID} />
          </section>

          {/* Section 3: Outcome Explainer */}
          <section className="section">
            <OutcomeExplainer caseId={CASE_ID} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          TRACE Prototype | Hackathon Demo | Rule-based accountability
          framework
        </p>
      </footer>
    </div>
  );
}

export default App;
