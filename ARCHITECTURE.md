# TRACE Platform - Architecture & Design Decisions

## Problem Statement

FedEx manages overdue accounts through external Debt Collection Agencies (DCAs). The real problem is **not recovery volume but lack of accountability, auditability, and clear responsibility for delays**.

Current state:
- Dashboards show aggregate metrics (recovery rate, volume)
- No clear accountability for specific delays
- Difficult to audit why cases escalated
- Unclear who (DCA, FedEx, or Customer) caused the delay

## Solution: Accountability-First Governance

TRACE enforces accountability **at the case level** through:

### 1. Action Ledger
Every action (DCA contact, FedEx document delivery, customer communication) is recorded with:
- **Actor**: Who performed the action (DCA, FedEx, Customer)
- **Evidence**: Is the action documented? (✅ / ❌)
- **SLA Status**: Did this action meet the SLA? (✅ / ❌)

**Impact**: Judges can see exactly what happened, when, by whom, and if it was compliant.

### 2. Responsibility Timeline
Rather than blame, we **measure responsibility** with deterministic rules:

```
DCA Days: Period when DCA was actively collecting
FedEx Days: Period when FedEx caused delay (SLA breach)
Customer Days: Period when waiting for customer
```

**Why this matters**: 
- If FedEx breached SLA on Day 8 (missing docs), they own those days
- If Customer didn't respond, they own those days
- DCA gets credit for days they worked
- Clear, auditable, defensible

### 3. Outcome Explanation
When a judge asks "Why did this escalate?", we provide a **rule-based, factual paragraph**:

```
Case FDX-2025-087432 ($125,500) escalated after 45 days. FedEx failed 
2 SLA milestones: Provided partial account history (7 days late) and 
delayed escalation trigger (Day 35 vs SOP Day 21). Critical evidence 
gap on Day 15: Customer requested invoice clarification (undocumented). 
Of 45 days, DCA CollectCorp completed 5 documented actions. Primary 
delay caused by FedEx (2 SLA breaches). SOP Step 3 (timely document 
provision) and Step 5 (escalation triggers) were not met.
```

No predictions, no ML, fully auditable.

## Technical Design

### Backend: Deterministic Rules Engine
```python
def calculate_responsibility_timeline(case):
    """
    Rules:
    1. Scan all events chronologically
    2. For each event, check: Who acted? Did they breach SLA?
    3. Assign days to actor based on their accountability
    4. Result: Breakdown of who owns how many days
    """
```

**Key property**: Same input → same output, always. No randomness.

### Frontend: Three-View Accountability
1. **Case Details**: The facts (what happened)
2. **Responsibility Timeline**: The breakdown (who owns what)
3. **Outcome Explainer**: The judgment (why it failed)

Each view is **read-only** (no data entry). Judges see facts, not speculation.

## Data Model: One Complex Case

We model a realistic failure scenario:

```
Day 1:  DCA assigned, initial contact ✅
Day 1:  DCA requests docs from FedEx ✅
Day 8:  FedEx provides docs (7 days late) ❌ SLA BREACH
Day 8:  DCA negotiates payment plan ✅
Day 15: Customer requests clarification (no docs) ❌ MISSING EVIDENCE
Day 30: DCA sends payment offer ✅
Day 35: FedEx escalates (late) ❌ SLA BREACH
Day 45: Case escalated - failure ✅
```

**Total delay**: 45 days
- FedEx caused 14 days (SLA breaches on Day 8 and Day 35)
- Customer caused 7 days (no response after Day 15)
- DCA responsible for remaining (actively working)

**Explainable result**: "FedEx's 2 SLA breaches caused the primary delay"

## Why Not ML?

ML models are opaque:
- "Why did you predict escalation?" → "The model said so"
- Hard to defend in audit or court
- Black box for judges to understand

**Rule-based is better for governance**:
- "Why did FedEx own those days?" → "They breached SLA on Day 8"
- Fully auditable, defensible
- Judges understand the logic

## Design Constraints Met

| Constraint | How Met |
|-----------|---------|
| No authentication | Single case view, no login |
| No role management | All judges see same data |
| No real integrations | Hardcoded case data |
| No ML predictions | Rule-based logic only |
| No fancy UI | Plain CSS, enterprise style |
| No dashboards | Case-level view only |
| Demoable in 3 min | Linear flow: Details → Timeline → Explanation |

## What This Proves

In a 3-minute demo, judges see:

1. **Accountability is possible**: Case FDX-2025-087432 shows exactly who did what
2. **Responsibility is measurable**: FedEx owns 14 of 45 days (deterministic)
3. **Governance can be simple**: Rule-based logic beats complex dashboards
4. **Audits are easy**: No question about how the conclusion was reached

## Future Enhancements (Not in MVP)

- Multiple cases (database backend)
- Role-based views (FedEx, DCA, FedEx internal)
- Real SOP definitions (configurable rules)
- Case search and filtering
- Historical accountability trends
- Dispute workflows
- Integration with case management system

---

**Core insight**: Enterprise governance is about **accountability at the transaction level**, not aggregate metrics. This prototype proves that principle.
