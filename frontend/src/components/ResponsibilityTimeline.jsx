import React, { useState, useEffect } from "react";
import "./ResponsibilityTimeline.css";

/**
 * ResponsibilityTimeline Component
 *
 * Displays how total overdue time is split across:
 * - DCA (collection agency)
 * - FedEx (service provider)
 * - Customer (debtor)
 *
 * Uses rule-based logic to determine responsibility periods.
 */

function ResponsibilityTimeline({ caseId }) {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(
          `${apiBase}/api/case/${caseId}/responsibility`
        );
        if (!response.ok) throw new Error("Failed to fetch timeline");
        const data = await response.json();
        setTimeline(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [caseId]);

  if (loading)
    return <div className="responsibility-timeline loading">Loading...</div>;
  if (error)
    return <div className="responsibility-timeline error">Error: {error}</div>;
  if (!timeline)
    return <div className="responsibility-timeline error">No data</div>;

  const total = timeline.totalDays;
  const breakdown = timeline.breakdown;

  // Calculate percentages for visualization
  const dcaPercent = ((breakdown.DCA / total) * 100).toFixed(1);
  const fedexPercent = ((breakdown.FedEx / total) * 100).toFixed(1);
  const customerPercent = ((breakdown.Customer / total) * 100).toFixed(1);

  return (
    <div className="responsibility-timeline">
      <h2>Responsibility Timeline</h2>
      <p className="timeline-subtitle">
        How {total} days of delay are distributed across parties
      </p>

      {/* Breakdown Cards */}
      <div className="breakdown-cards">
        <div className="card card-dca">
          <div className="card-label">DCA (CollectCorp)</div>
          <div className="card-value">{breakdown.DCA} days</div>
          <div className="card-percent">{dcaPercent}% of total</div>
        </div>

        <div className="card card-fedex">
          <div className="card-label">FedEx</div>
          <div className="card-value">{breakdown.FedEx} days</div>
          <div className="card-percent">{fedexPercent}% of total</div>
        </div>

        <div className="card card-customer">
          <div className="card-label">Customer</div>
          <div className="card-value">{breakdown.Customer} days</div>
          <div className="card-percent">{customerPercent}% of total</div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="chart-section">
        <h3>Visual Distribution</h3>
        <div className="stacked-bar">
          <div
            className="bar-segment bar-dca"
            style={{ width: `${dcaPercent}%` }}
            title={`DCA: ${breakdown.DCA} days`}
          >
            {dcaPercent > 10 && <span className="bar-label">{breakdown.DCA}d</span>}
          </div>
          <div
            className="bar-segment bar-fedex"
            style={{ width: `${fedexPercent}%` }}
            title={`FedEx: ${breakdown.FedEx} days`}
          >
            {fedexPercent > 10 && <span className="bar-label">{breakdown.FedEx}d</span>}
          </div>
          <div
            className="bar-segment bar-customer"
            style={{ width: `${customerPercent}%` }}
            title={`Customer: ${breakdown.Customer} days`}
          >
            {customerPercent > 10 && <span className="bar-label">{breakdown.Customer}d</span>}
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="insight-box">
        <strong>Key Finding:</strong> FedEx SLA breaches (failing to provide
        documentation on time and delayed escalation) directly caused {breakdown.FedEx} of
        the {total} days of delay.
      </div>
    </div>
  );
}

export default ResponsibilityTimeline;
