import React, { useState, useEffect } from "react";
import "./CaseDetails.css";

/**
 * CaseDetails Component
 * 
 * Displays:
 * - Case header (ID, Amount, DCA, Status)
 * - Action Ledger table with:
 *   - Day
 *   - Actor (DCA / FedEx / Customer)
 *   - Action description
 *   - Evidence indicator (✅ / ❌)
 *   - SLA Breach indicator (✅ / ❌)
 */

function CaseDetails({ caseId }) {
  const [caseData, setCaseData] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(
          `${apiBase}/api/case/${caseId}`
        );
        if (!response.ok) throw new Error("Case not found");
        const data = await response.json();
        setCaseData(data.case);
        setLedger(data.ledger);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  if (loading) return <div className="case-details loading">Loading...</div>;
  if (error) return <div className="case-details error">Error: {error}</div>;
  if (!caseData) return <div className="case-details error">No case data</div>;

  return (
    <div className="case-details">
      {/* Case Header */}
      <div className="case-header">
        <div className="case-id">
          <strong>Case ID:</strong> {caseData.caseId}
        </div>
        <div className="case-amount">
          <strong>Amount:</strong> ${caseData.amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="case-dca">
          <strong>Assigned DCA:</strong> {caseData.assignedDCA}
        </div>
        <div className="case-status">
          <strong>Status:</strong>{" "}
          <span className="status-badge escalated">{caseData.status}</span>
        </div>
      </div>

      {/* Action Ledger */}
      <div className="ledger-section">
        <h3>Action Ledger</h3>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Actor</th>
              <th>Action Description</th>
              <th>Evidence</th>
              <th>SLA Breach</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((event, idx) => (
              <tr key={idx} className={event.breach ? "row-breach" : ""}>
                <td className="cell-day">{event.day}</td>
                <td className={`cell-actor actor-${event.actor.toLowerCase()}`}>
                  {event.actor}
                </td>
                <td className="cell-action">{event.action}</td>
                <td className="cell-evidence">
                  {event.hasEvidence ? "✅" : "❌"}
                </td>
                <td className="cell-breach">
                  {event.breach ? "❌" : "✅"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CaseDetails;
