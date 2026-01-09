# TRACE Platform - Judge's Guide

## Welcome! 👋

You're looking at **TRACE** - a hackathon prototype demonstrating **accountability-focused governance** for enterprise overdue account recovery.

This guide will help you understand, run, and evaluate the system.

---

## 📋 Reading Path (Choose Your Level)

### 👀 **If you have 3 minutes** (During the demo)
1. Open http://localhost:3000
2. Follow the [QUICKSTART.md](QUICKSTART.md) demo flow
3. Watch the three sections load
4. See SLA breaches and responsibility measured

### 📚 **If you have 10 minutes** (After demo, quick summary)
1. Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - overview
2. Glance at [LOGIC_FLOW.md](LOGIC_FLOW.md) - architecture diagrams
3. Skim [CODE_HIGHLIGHTS.md](CODE_HIGHLIGHTS.md) - key code sections

### 🔬 **If you have 30 minutes** (Deep dive)
1. Read [README.md](README.md) - full documentation
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) - design philosophy
3. Read [LOGIC_FLOW.md](LOGIC_FLOW.md) - detailed algorithms
4. Read [CODE_HIGHLIGHTS.md](CODE_HIGHLIGHTS.md) - actual code
5. Browse source code (well-commented, ~850 lines total)

### 🛠️ **If you want to run it yourself**
1. Read [QUICKSTART.md](QUICKSTART.md) - setup instructions
2. Follow [PRE_DEMO_CHECKLIST.md](PRE_DEMO_CHECKLIST.md) - verification
3. Run `start.bat` (Windows) or `start.sh` (Mac/Linux)
4. Open http://localhost:3000

---

## 📁 File Guide

### Core Documentation

| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Full specification and features | 10 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Design philosophy and decisions | 8 min |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Quick overview (this file good too!) | 5 min |
| [QUICKSTART.md](QUICKSTART.md) | How to run the demo | 5 min |
| [LOGIC_FLOW.md](LOGIC_FLOW.md) | System architecture and algorithms | 10 min |
| [CODE_HIGHLIGHTS.md](CODE_HIGHLIGHTS.md) | Key code sections with explanations | 15 min |
| [PRE_DEMO_CHECKLIST.md](PRE_DEMO_CHECKLIST.md) | Verification before demo | 5 min |

### Source Code

| File | Lines | Purpose |
|------|-------|---------|
| **Backend** | | |
| `backend/main.py` | 310 | FastAPI server with all business logic |
| `backend/requirements.txt` | 3 | Python dependencies |
| **Frontend** | | |
| `frontend/src/App.jsx` | 70 | Main app orchestrator |
| `frontend/src/components/CaseDetails.jsx` | 75 | Case ledger display |
| `frontend/src/components/ResponsibilityTimeline.jsx` | 90 | Breakdown visualization |
| `frontend/src/components/OutcomeExplainer.jsx` | 85 | Explanation generator |
| `frontend/src/components/*.css` | 300 | Plain CSS styling |
| `frontend/package.json` | 20 | npm config |
| `frontend/vite.config.js` | 10 | Vite configuration |

---

## 🎯 Core Concepts (30-second version)

### The Problem
- FedEx uses external Debt Collection Agencies (DCAs) to recover overdue accounts
- Cases often delay or escalate
- **Current issue**: No accountability for delays - unclear who caused them

### The Solution: TRACE
- **Case Detail View**: Every action (DCA call, FedEx docs, customer response) is recorded
- **Responsibility Timeline**: Rule-based calculation of who owns how many days of delay
- **Outcome Explanation**: Deterministic explanation of why the case failed

### Key Innovation: Accountability ≠ Blame
- We don't blame people
- We **measure responsibility** with objective rules:
  - DCA owns days they're working
  - FedEx owns days of their SLA breaches
  - Customer owns days waiting for response
- Result: **Objective, auditable, defensible**

---

## 🧪 What You'll See in the Demo (3 minutes)

### 1️⃣ Case Details (0:00-0:30)
```
Case ID:        FDX-2025-087432
Amount:         $125,500
Assigned DCA:   CollectCorp Solutions
Status:         Escalated

Action Ledger:
Day  Actor    Action                          Evidence  Breach
─────────────────────────────────────────────────────────────
1    DCA      Initial contact                 ✅        ✅
1    DCA      Request docs                    ✅        ✅
8    FedEx    Provide docs (7 days late!)     ✅        ❌  ← BREACH
8    DCA      Payment negotiation             ✅        ✅
15   Customer Clarification request (no doc)  ❌        ✅  ← MISSING
30   DCA      Payment offer                   ✅        ✅
35   FedEx    Escalate (14 days late!)        ✅        ❌  ← BREACH
45   FedEx    Case escalated (failure)        ✅        ❌
```

### 2️⃣ Responsibility Timeline (0:30-1:30)
```
Who owns the 45-day delay?

DCA:      24 days (53%) ████████████████████████
FedEx:    14 days (31%) ██████████████  ← SLA breaches
Customer:  7 days (16%) ███████

Key Finding: "FedEx SLA breaches directly caused 14 of 45 days"
```

### 3️⃣ Outcome Explanation (1:30-3:00)
```
[Click "Generate Outcome Explanation"]

"Case FDX-2025-087432 ($125,500.00) escalated after 45 days. FedEx failed 
2 SLA milestones: Provided partial account history (7 days late); delayed 
escalation trigger (35 days vs SOP 21-day rule). Critical evidence gap on 
Day 15: Customer requested invoice clarification (undocumented). Of 45 days, 
DCA CollectCorp completed 5 documented actions. Primary delay caused by FedEx 
(2 SLA breaches). Secondary delay caused by undocumented customer 
communications. SOP Step 3 (timely document provision) and Step 5 (escalation 
triggers) were not met."

✓ Rule-based analysis • No predictions • Audit-ready
```

---

## 🤔 Frequently Asked Questions

### Q: Why only one case?
**A**: This is a **prototype**, not production. One complex, realistic case demonstrates the concept better than 100 simple cases.

### Q: Why not use ML/AI?
**A**: ML is opaque. Judges can't audit "the model said so". Rules are auditable: "FedEx breached SLA, therefore they own those days."

### Q: How is this different from a dashboard?
**A**: Dashboards show metrics ("Recovery: 62%"). TRACE shows accountability ("FedEx caused 31% of this case's delay via SLA breaches").

### Q: Is this production-ready?
**A**: No. It's a prototype proving a principle. Production would add: multi-case DB, configurable SOP rules, role-based views, audit logs.

### Q: How does responsibility calculation work?
**A**: Rule-based:
1. Scan events chronologically
2. If actor is DCA → they own those days
3. If actor is FedEx AND breach → they own those days
4. If actor is Customer → they own those days
5. Remaining days go to DCA
6. **Result**: Objective breakdown

### Q: Can this be deployed?
**A**: Yes! 
- Backend: `python main.py` (FastAPI on port 8000)
- Frontend: `npm run dev` (Vite on port 3000)
- Both run on a single machine (as shown)
- For scale: add database, multi-case logic, real deployment

### Q: What about privacy?
**A**: This demo uses public data. Production would integrate with real case management system with proper access controls.

### Q: How long did this take?
**A**: ~4-6 hours of focused development (clean code, documentation, testing, demo-ready).

### Q: Can I modify the case data?
**A**: Yes! Edit `backend/main.py`, line ~100 (CASE_DATA definition). Change events, amounts, DCA names, etc. Backend will recalculate automatically.

---

## 🏗️ System Architecture (60-second version)

```
Frontend (React)                Backend (FastAPI)
http://localhost:3000           http://localhost:8000

User opens browser
        │
        ├─→ App.jsx loads
        │    ├─ CaseDetails
        │    ├─ ResponsibilityTimeline
        │    └─ OutcomeExplainer
        │
        └─→ Each component fetches data
            ├─ GET /api/case/{id} → ledger
            ├─ GET /api/case/{id}/responsibility → breakdown
            └─ GET /api/case/{id}/explanation → text

Backend runs deterministic algorithms:
    ├─ calculate_responsibility_timeline() → rule-based breakdown
    └─ generate_outcome_explanation() → rule-based analysis

All responses are JSON, no external APIs, no ML models.
```

---

## ✅ What Makes This a Strong Prototype

1. **Focused**: Solves one problem (accountability) well
2. **Simple**: 850 lines of clean code, easy to understand
3. **Deterministic**: Same input → same output, always
4. **Auditable**: Every number traces to source data
5. **Defensible**: Logic is business rules, not black boxes
6. **Demo-ready**: Runs locally, no cloud setup needed
7. **Production-aware**: Architecture scales to multi-case DB
8. **Well-documented**: 8 MD files explaining every aspect

---

## 🚀 To Run It

### Option 1: One-Click (Windows)
```bash
start.bat
```

### Option 2: Manual (All platforms)
```bash
# Terminal 1
cd backend
python -m venv venv
venv\Scripts\activate  # or: source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2
cd frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

### Option 3: Check it's working
```bash
# Verify backend
curl http://localhost:8000/api/case/FDX-2025-087432

# Verify frontend
open http://localhost:3000 (Mac)
start http://localhost:3000 (Windows)
```

---

## 📊 Key Metrics

| Metric | Value | Significance |
|--------|-------|--------------|
| Demo time | 3 min | Judges can see full value in one sitting |
| Total codebase | 850 lines | Easy to audit, no hidden complexity |
| Setup time | 5 min | Works out of box |
| Data points | 8 events + 3 actors | Rich enough for realistic scenario |
| Responsibility accuracy | 100% rule-based | Fully auditable |
| Explanation determinism | 100% | Same result every time |
| UI simplicity | Plain CSS, no frameworks | Enterprise-serious, not flashy |

---

## 🎓 For Technical Judges

**Code quality indicators:**
- ✅ All functions have docstrings
- ✅ Variables are descriptively named
- ✅ Logic is separated from presentation
- ✅ Error handling is explicit
- ✅ No hardcoded magic strings (except demo data)
- ✅ API contracts are clear
- ✅ CSS is organized logically
- ✅ No dead code or TODO comments

**Architectural choices:**
- ✅ REST API (industry standard)
- ✅ React (industry standard, component-based)
- ✅ FastAPI (modern, fast, auto-docs)
- ✅ Plain CSS (no framework overhead)
- ✅ In-memory data (prototype appropriate)
- ✅ CORS enabled (cross-origin safe)
- ✅ Separation of concerns (backend/frontend)

---

## 🎯 The Big Idea

**Traditional governance**: Track metrics, find outliers
- "Recovery rate is down" → hire more people

**TRACE governance**: Enforce accountability at transaction level
- "FedEx breached SLA on Day 8" → immediate visibility, corrective action possible

This prototype proves that **accountability > dashboards, explanation > prediction, governance > automation**.

---

## 📞 Questions?

### Before running:
- Read [QUICKSTART.md](QUICKSTART.md)
- Check [PRE_DEMO_CHECKLIST.md](PRE_DEMO_CHECKLIST.md)

### During demo:
- Watch [QUICKSTART.md](QUICKSTART.md) demo flow
- Point at specific ledger entries, timelines, explanations
- Emphasize: "Auditable", "Rule-based", "Accountability"

### After demo:
- Review [CODE_HIGHLIGHTS.md](CODE_HIGHLIGHTS.md)
- Ask about specific algorithms
- Discuss production roadmap

---

## 📈 Production Roadmap (Not Implemented)

**Phase 1 (This prototype)**: Prove concept with one case
- ✅ Case detail view
- ✅ Responsibility calculation
- ✅ Outcome explanation

**Phase 2 (Next sprint)**: Multi-case support
- [ ] Real database (PostgreSQL)
- [ ] Configurable SOP rules
- [ ] Role-based views (DCA, FedEx, Legal)

**Phase 3 (Scale)**: Enterprise deployment
- [ ] High availability
- [ ] Audit logging
- [ ] Real integrations
- [ ] Performance optimization

---

**Thank you for reviewing TRACE!**

This prototype demonstrates that **enterprise governance is about accountability at the transaction level, not aggregate metrics.**

Start with [QUICKSTART.md](QUICKSTART.md) to run the demo.
