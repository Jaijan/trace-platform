# TRACE Platform - Complete Prototype

## 🎯 What You've Built

A **3-minute demo** of an accountability-focused governance platform for enterprise overdue account recovery. The prototype demonstrates how to enforce governance rules **at the case level** rather than aggregating metrics in dashboards.

---

## 📁 Complete File Structure

```
trace-prototype/
├── README.md                           ← Full documentation
├── ARCHITECTURE.md                     ← Design philosophy
├── QUICKSTART.md                       ← How to run
├── start.bat                           ← Windows startup (one-click)
├── start.sh                            ← macOS/Linux startup
│
├── backend/
│   ├── main.py                         ← FastAPI server (deterministic logic)
│   └── requirements.txt                ← Python dependencies
│
└── frontend/
    ├── package.json                    ← npm dependencies (React + Vite)
    ├── vite.config.js                  ← Vite config
    ├── index.html                      ← HTML entry point
    └── src/
        ├── main.jsx                    ← React entry
        ├── App.jsx                     ← Main orchestrator
        ├── App.css                     ← Global styles
        ├── index.css                   ← Base styles
        └── components/
            ├── CaseDetails.jsx         ← Case header + ledger
            ├── CaseDetails.css
            ├── ResponsibilityTimeline.jsx ← Breakdown visualization
            ├── ResponsibilityTimeline.css
            ├── OutcomeExplainer.jsx    ← Rule-based explanation
            └── OutcomeExplainer.css
```

---

## 🚀 To Run (Choose One)

### Windows (Easiest)
```bash
start.bat
```
Opens two command windows automatically. Both servers start in ~5 seconds.

### Manual (All Platforms)
```bash
# Terminal 1
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: this | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

---

## ⏱️ Demo Script (180 Seconds)

### 1. Case Details (30 sec)
- Show **Case ID**: FDX-2025-087432
- Show **Amount**: $125,500
- Point to Action Ledger:
  - **Day 8**: ❌ FedEx breach (7 days late, SLA=3 days)
  - **Day 15**: ❌ Missing evidence (customer communication)
  - **Day 35**: ❌ FedEx breach (delayed escalation)

*Talking point*: "Every action is recorded with who did it, when, if it's documented, and if it met SLA"

### 2. Responsibility Timeline (60 sec)
- Point to cards: DCA (24d), FedEx (14d), Customer (7d)
- Show stacked bar chart: FedEx owns **31%** of the 45-day delay
- Read insight box: "FedEx SLA breaches directly caused 14 of 45 days"

*Talking point*: "We don't blame people—we measure responsibility objectively with rules"

### 3. Outcome Explanation (60 sec)
- Click "Generate Outcome Explanation"
- Read generated text
- Point to footer: "✓ Rule-based analysis • No predictions • Audit-ready"

*Talking point*: "No black boxes, no ML confusion—just facts traceable to the ledger above"

---

## 🧠 Core Logic (Backend: `main.py`)

### Data Model
**ActionEvent**: Every action is a record
```python
ActionEvent(
    day=8,
    actor=Actor.FEDEX,          # Who: DCA, FedEx, or Customer
    action="Provided account docs",
    has_evidence=True,          # Documented?
    breach=True                 # SLA violation?
)
```

### Responsibility Calculation
**Deterministic rule-based logic** (not ML):
```python
def calculate_responsibility_timeline(case):
    # Scan all events
    # For each: Who acted? Did they breach SLA?
    # Assign days to that actor
    # Return: {"DCA": 24, "FedEx": 14, "Customer": 7}
```

**Key property**: Same input → same output, always. Fully auditable.

### Outcome Explanation
**Rule-based factual analysis**:
1. Count FedEx SLA breaches → primary cause
2. Find missing evidence → secondary cause
3. Reference SOP steps
4. Generate paragraph

**No ML, no randomness, 100% explainable.**

---

## 🎨 Frontend (React + Vite)

### 3 Components Only

1. **CaseDetails.jsx**
   - Case header (ID, amount, DCA, status)
   - Action ledger table (day, actor, action, evidence ✅/❌, breach ✅/❌)
   - Highlights SLA breaches with row background color

2. **ResponsibilityTimeline.jsx**
   - 3 breakdown cards (DCA, FedEx, Customer)
   - Stacked bar chart (visual proportion)
   - Insight box with key finding

3. **OutcomeExplainer.jsx**
   - "Generate Outcome Explanation" button
   - Displays generated text
   - Footer: "Rule-based, no predictions, audit-ready"

### Styling
- **Plain CSS**: No frameworks (Bootstrap, Tailwind, etc.)
- **Enterprise serious**: Dark header, clean tables, subtle colors
- **Minimal**: ~300 lines of CSS total
- **Accessible**: Semantic HTML, good contrast, readable fonts

---

## 📊 Realistic Data: Case FDX-2025-087432

### Timeline
```
Day 1:  DCA assigned, requests docs ✅
Day 1:  FedEx receives request
Day 8:  FedEx provides docs (7 days late) ❌ BREACH
Day 8:  DCA negotiates payment ✅
Day 15: Customer requests clarification (no evidence) ❌
Day 30: DCA sends payment offer ✅
Day 35: FedEx escalates (14 days late vs SOP 21-day rule) ❌ BREACH
Day 45: Case escalated—failure ✅
```

### Why This Works
- **Uneven gaps** (1→8→30→45): Realistic enterprise delays
- **Multiple breaches** (2 FedEx violations): Clear root cause
- **Missing evidence** (Day 15): Shows documentation importance
- **Clear failure** (escalation): Defines problem state

---

## 🔍 Key Design Principles

| Principle | Implementation |
|-----------|-----------------|
| Accountability > Dashboards | Case-level view, not metrics |
| Explanation > Prediction | Rule-based, no ML |
| Governance > Automation | SLA/SOP rules enforced, not monitored |
| Simple > Complex | 3 components, 1 case, ~500 lines of code |
| Audit-ready | Every conclusion traces to ledger |

---

## ✅ What This Demonstrates

**In 180 seconds, judges see:**

1. ✅ **Accountability is possible**: Exact case timeline with accountability trail
2. ✅ **Responsibility is measurable**: FedEx owns 14 of 45 days (deterministic, not blamed)
3. ✅ **Governance can be simple**: Rule-based logic beats complex dashboards
4. ✅ **Audits are easy**: No question about how conclusions were reached

---

## 🚫 Intentionally NOT Included

- ❌ Authentication (demo-ready)
- ❌ Role management (single view)
- ❌ Multiple cases (focus)
- ❌ Dashboards (case-level only)
- ❌ ML/predictions (rule-based only)
- ❌ Cloud/DevOps (single machine)
- ❌ Fancy UI (enterprise serious)
- ❌ Real integrations (hardcoded data)

This is **intentional**. Each omission keeps the prototype focused on proving the core concept: **accountability through deterministic governance rules**.

---

## 📈 Production Roadmap (Not Implemented)

After the hackathon, to scale to production:

1. **Database**: Store multiple cases
2. **SOP Configuration**: Judges can define rules
3. **Role-based access**: DCA, FedEx, FedEx Legal see different data
4. **Audit logging**: Every data access logged
5. **Escalation workflows**: Dispute handling
6. **Real integrations**: Connect to case management system
7. **Performance**: Optimize for 10K+ cases
8. **High availability**: Multi-region deployment

---

## 🎓 For Judges

**You can understand this in 3 minutes** because:

1. **One case**: No configuration or setup needed
2. **Three views**: Clear progression (facts → breakdown → explanation)
3. **Real data**: Realistic scenario with authentic SLA breaches
4. **No jargon**: Action ledger, responsibility, explanation
5. **Traceable**: Every number traces back to a ledger entry

**You can defend this in 5 minutes** because:

1. **Deterministic**: Same input → same output, always
2. **Auditable**: Every conclusion cites specific actions
3. **Simple**: 500 lines of logic, no black boxes
4. **Aligned to problem**: Solves accountability, not recovery volume

---

## 🔗 API Endpoints (Backend)

```
GET  /api/case/{id}                 → Case details + ledger
GET  /api/case/{id}/responsibility  → Breakdown (DCA/FedEx/Customer days)
GET  /api/case/{id}/explanation     → Generated outcome explanation
GET  /api/health                    → Health check
```

All responses are JSON. No authentication required (demo).

---

## 📝 Technical Stack

**Backend**:
- Python 3.8+
- FastAPI (lightweight, fast, auto-docs)
- In-memory data (no database)
- CORS enabled for frontend

**Frontend**:
- React 18
- Vite (fast, modern build tool)
- Plain CSS (no frameworks)
- Fetch API for backend calls

**Deployment**:
- Backend: `python main.py` (uses uvicorn)
- Frontend: `npm run dev` (Vite dev server)
- Both on localhost for demo

---

## 🎯 Bottom Line

**TRACE proves that enterprise governance is not about predicting failures or displaying dashboards. It's about enforcing accountability through simple, auditable, deterministic rules applied at the transaction level.**

This prototype demonstrates that principle in 180 seconds, with zero confusion about how conclusions were reached.

---

**Built for hackathon judges.** Demo-ready. Audit-ready. Explainable.
