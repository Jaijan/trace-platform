# TRACE - Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation & Running

### Option 1: Windows Batch Script (Easiest)
```bash
start.bat
```
This will open two command windows - one for backend, one for frontend.

### Option 2: Manual Startup (Windows)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### Option 3: Manual Startup (macOS/Linux)

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Demo Flow (Under 3 Minutes)

### Setup
- Open http://localhost:3000 in browser
- Ensure backend is running (no errors in Terminal 1)

### Demo Steps

**1. Show Case Details (30 seconds)**
- Point to Case ID: `FDX-2025-087432`
- Show Amount: `$125,500`
- Scroll down to Action Ledger table
- Point out:
  - Day 8: ❌ SLA Breach (FedEx late with documents)
  - Day 15: ❌ Missing Evidence (customer communication)
  - Day 35: ❌ SLA Breach (FedEx late with escalation)

**2. Show Responsibility Timeline (60 seconds)**
- Scroll to Responsibility Timeline section
- Show breakdown cards:
  - "FedEx: 14 days" 
  - "DCA: 24 days"
  - "Customer: 7 days"
- Point to stacked bar chart showing 14/45 (31%) is FedEx's responsibility
- Read insight: "FedEx SLA breaches directly caused 14 of 45 days of delay"

**3. Show Outcome Explanation (60 seconds)**
- Scroll to Outcome Explainer
- Click "Generate Outcome Explanation"
- Read generated text:
  ```
  Case FDX-2025-087432 ($125,500) escalated after 45 days. FedEx failed 
  2 SLA milestones: Provided partial account history (7 days late) and 
  delayed escalation trigger (Day 35 vs SOP Day 21). Critical evidence 
  gap on Day 15...
  ```
- Point out: "Rule-based analysis • No predictions • Audit-ready"
- Emphasize: "This explanation is 100% traceable to the action ledger above"

### Key Points to Emphasize

1. **Accountability**: Every action is recorded with actor, evidence status, and SLA compliance
2. **Responsibility**: Measured objectively, not blamed subjectively
3. **Governance**: Rules (SLA, SOP) are enforced, not just monitored
4. **Explainability**: Every conclusion traces back to specific actions

## Testing the Data

### Verify Realistic Scenario
- Case: 45-day escalation (realistic enterprise timeline)
- Amount: $125,500 (realistic overdue balance)
- DCA: CollectCorp Solutions (realistic agency name)
- Status: Escalated (realistic failure outcome)

### Verify SLA Breaches
- Day 8: Document delivery SLA = 3 days, actual = 7 days → **4-day breach**
- Day 35: Escalation SOP = 21 days, actual = 35 days → **14-day delay**
- Total: 2 SLA/SOP violations driving failure

### Verify Responsibility Logic
- FedEx breaches = 14 days (the two SLA violations)
- Customer gap = 7 days (Day 15 with no evidence)
- DCA work = 24 days (actively collecting)
- Total = 45 days ✓

## Troubleshooting

### Backend Won't Start
```
Error: ModuleNotFoundError: No module named 'fastapi'
```
Solution:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or: source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
python main.py
```

### Frontend Won't Start
```
Error: npm: command not found
```
Solution: Install Node.js from https://nodejs.org/

### CORS Error in Browser Console
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution: Ensure backend is running on port 8000

### Port Already in Use
```
Address already in use
```
Solutions:
- Backend (port 8000): `netstat -ano | findstr :8000` (Windows) or `lsof -i :8000` (Mac/Linux)
- Frontend (port 3000): `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)

## Project Structure

```
trace-prototype/
├── backend/
│   ├── main.py                    # FastAPI server
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CaseDetails.jsx    # Case header + ledger
│   │   │   ├── ResponsibilityTimeline.jsx
│   │   │   └── OutcomeExplainer.jsx
│   │   ├── App.jsx                # Main app
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md                      # Full documentation
├── ARCHITECTURE.md                # Design decisions
└── QUICKSTART.md                  # This file
```

## What Each File Does

### Backend
- **main.py**: 
  - `ActionEvent` class: Records action with actor, evidence, SLA status
  - `Case` class: Container for case metadata and events
  - `calculate_responsibility_timeline()`: Rule-based breakdown
  - `generate_outcome_explanation()`: Factual analysis
  - API endpoints: `/api/case/{id}`, `/api/case/{id}/responsibility`, `/api/case/{id}/explanation`

### Frontend
- **CaseDetails.jsx**: Displays case header and action ledger table
- **ResponsibilityTimeline.jsx**: Shows breakdown cards and stacked bar chart
- **OutcomeExplainer.jsx**: Button-driven explanation generator
- **App.jsx**: Orchestrates all components

## Performance Notes

- Backend: ~50ms response time per API call
- Frontend: Instant render (all data fits in memory)
- Total load time: < 1 second
- No database, no network latency beyond localhost

## Next Steps After Demo

1. Share video recording for judges
2. Provide access to GitHub repo
3. Discuss production roadmap:
   - Multi-case support
   - Real SOP/SLA configuration
   - Role-based access control
   - Audit logging
   - Integration with case management system

---

**Remember**: This is a **prototype**, not production. It proves the concept that **accountability can be enforced through deterministic, auditable governance rules at the case level**.
