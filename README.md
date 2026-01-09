# TRACE Platform - Hackathon Prototype

**Transparent Recovery Accountability & Case Engine**

A demonstration of accountability-focused governance for overdue FedEx account recovery through external Debt Collection Agencies (DCAs).

## Core Philosophy

- **Accountability > Dashboards**: Focus on who did what and who caused delays
- **Explanation > Prediction**: Rule-based factual analysis, not ML speculation
- **Governance > Automation**: Clear governance rules enforced at case level
- **Simple > Complex**: Demo-ready, defensible, audit-ready

## Features

### 1. Case Detail View
- **Case Header**: ID, Amount, Assigned DCA, Status
- **Action Ledger Table**: 
  - Day of action
  - Actor (DCA, FedEx, Customer)
  - Action description
  - Evidence indicator (✅ / ❌)
  - SLA Breach indicator (✅ / ❌)

### 2. Responsibility Timeline
- **Visual breakdown** of how 45 days are distributed:
  - DCA accountability (days they actively collected)
  - FedEx accountability (days of SLA breaches)
  - Customer accountability (days waiting for response)
- **Rule-based logic**: No ML, deterministic responsibility assignment
- **Key insight**: Primary delay cause identified

### 3. Outcome Explainer
- **Generate button** triggers explanation generation
- **Audit-ready paragraph** explaining:
  - Why case failed/escalated
  - Which SOP steps were missed
  - Primary cause of delay (deterministic)
- **No predictions**, pure rule-based analysis

## Data Design

**Case**: FDX-2025-087432 ($125,500 recovery)
- **45-day escalation timeline** with realistic gaps
- **Multiple SLA breaches**: 
  - FedEx failed to provide documentation (7 days late, 3-day SLA)
  - FedEx delayed escalation (35 days vs 21-day SOP)
- **Missing evidence**: Customer communication on Day 15 undocumented
- **Realistic patterns**: Uneven time gaps (Day 1→8→30→45)

## Architecture

```
trace-prototype/
├── backend/
│   ├── main.py              # FastAPI server with case data & business logic
│   └── requirements.txt      # Dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CaseDetails.jsx          # Case header + ledger table
    │   │   ├── CaseDetails.css
    │   │   ├── ResponsibilityTimeline.jsx
    │   │   ├── ResponsibilityTimeline.css
    │   │   ├── OutcomeExplainer.jsx
    │   │   └── OutcomeExplainer.css
    │   ├── App.jsx            # Main app orchestration
    │   ├── App.css
    │   ├── main.jsx           # React entry point
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Demo Flow (3 minutes)

1. **Open frontend** (http://localhost:3000)
2. **Show Case Details** (30 seconds)
   - Point to $125,500 case
   - Highlight SLA breaches (❌ in breach column)
   - Point to missing evidence (Day 15)
3. **Show Responsibility Timeline** (60 seconds)
   - Emphasize: "FedEx caused 14 of 45 days"
   - Show breakdown cards and stacked bar
   - Read insight: "FedEx SLA breaches caused..."
4. **Show Outcome Explainer** (60 seconds)
   - Click "Generate Outcome Explanation"
   - Read generated text (deterministic, factual)
   - Highlight: "Rule-based, no predictions, audit-ready"

## Business Logic Highlights

### Responsibility Timeline Calculation
```
DCA owns: Days while actively collecting
FedEx owns: Days of their SLA breaches
Customer owns: Days waiting for customer response
```

**Deterministic**: Same result every time, fully auditable.

### Outcome Explanation Generation
Rules applied in order:
1. Count FedEx SLA breaches → primary cause
2. Identify missing evidence → secondary cause
3. Reference SOP steps missed
4. Generate factual paragraph

No ML, no randomness, 100% explainable.

## Non-Functional Design Choices

- ✅ No authentication (demo-ready)
- ✅ No role management (single case view)
- ✅ No real integrations (in-memory data)
- ✅ No ML/predictions (rule-based)
- ✅ Minimal CSS (enterprise-serious, not flashy)
- ✅ 3 components only (focused scope)
- ✅ No cloud/DevOps (single machine deployment)

## Key Differentiators from Dashboard Tools

| Aspect | TRACE | Typical Dashboards |
|--------|-------|-------------------|
| Focus | Accountability | Metrics |
| Explanation | Rule-based, factual | Trend-based |
| Root cause | Governance logic | Aggregation |
| Audit trail | Case-level actions | Summary reports |
| Governance | Enforced at action | Post-hoc analysis |

## Files Explanation

### Backend: `main.py`
- **ActionEvent class**: Represents a single action with actor, description, evidence, and SLA flag
- **Case class**: Container for case metadata and event sequence
- **calculate_responsibility_timeline()**: Rule-based responsibility breakdown (deterministic)
- **generate_outcome_explanation()**: Factual analysis of why case failed (no ML)
- **API endpoints**: 
  - `GET /api/case/{id}` - Case details + ledger
  - `GET /api/case/{id}/responsibility` - Timeline breakdown
  - `GET /api/case/{id}/explanation` - Outcome explanation

### Frontend: Components
- **CaseDetails**: Renders header info and action ledger table
- **ResponsibilityTimeline**: Shows breakdown cards and stacked bar chart
- **OutcomeExplainer**: Button-driven explanation generator
- **App.jsx**: Orchestrates all three components with case ID

## Testing the Logic

### Verify SLA Breach Detection
- Day 8: FedEx provided docs 7 days late (SLA = 3 days) → ❌ Breach
- Day 35: FedEx escalated late (SOP = 21 days) → ❌ Breach

### Verify Responsibility Calculation
- FedEx breaches = 2 events = multiple days
- In timeline, FedEx should own 14 of 45 days (31%)

### Verify Explanation Generation
- Click "Generate Outcome Explanation"
- Should mention: FedEx SLA breaches, missing evidence, SOP steps

## Deployment Notes

This is a **single-machine prototype**:
- Backend and frontend run on localhost
- In-memory data (hardcoded case)
- No database, no persistence
- CORS enabled for cross-origin requests

For production:
- Add authentication
- Connect to real case database
- Implement role-based views
- Add audit logging
- Scale backend for multiple cases
- Deploy frontend to CDN

---

**Built for hackathon judges**: Lean, focused, demo-ready, fully explainable.
