"""
TRACE Backend - Transparent Recovery Accountability & Case Engine
Demonstrates accountability through clear case tracking and SLA enforcement.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List, Dict, Any
from enum import Enum
import json

app = FastAPI(title="TRACE Platform")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# DATA MODELS
# ============================================================================

class Actor(str, Enum):
    DCA = "DCA"
    FEDEX = "FedEx"
    CUSTOMER = "Customer"


class ActionEvent:
    """Represents a single action in the case timeline"""
    def __init__(self, day: int, actor: Actor, action: str, has_evidence: bool, breach: bool):
        self.day = day
        self.actor = actor
        self.action = action
        self.has_evidence = has_evidence
        self.breach = breach

    def to_dict(self):
        return {
            "day": self.day,
            "actor": self.actor.value,
            "action": self.action,
            "hasEvidence": self.has_evidence,
            "breach": self.breach
        }


class Case:
    """Represents an overdue account case"""
    def __init__(self, case_id: str, amount: float, dca: str, events: List[ActionEvent]):
        self.case_id = case_id
        self.amount = amount
        self.assigned_dca = dca
        self.events = sorted(events, key=lambda e: e.day)
        self.status = "Escalated"

    def to_dict(self):
        return {
            "caseId": self.case_id,
            "amount": self.amount,
            "assignedDCA": self.assigned_dca,
            "status": self.status
        }


# ============================================================================
# SIMULATED CASE DATA
# ============================================================================

# Example case: Day 0 to Day 45 with realistic delays and SLA breaches
CASE_DATA = Case(
    case_id="FDX-2025-087432",
    amount=125_500.00,
    dca="CollectCorp Solutions",
    events=[
        # Day 1: DCA assigned and initial contact attempt
        ActionEvent(
            day=1,
            actor=Actor.DCA,
            action="Initial debtor contact attempt",
            has_evidence=True,
            breach=False
        ),
        # Day 1: DCA gathers account details
        ActionEvent(
            day=1,
            actor=Actor.DCA,
            action="Requested account documentation from FedEx",
            has_evidence=True,
            breach=False
        ),
        # Day 8: Large gap - FedEx missed SLA to provide docs
        ActionEvent(
            day=8,
            actor=Actor.FEDEX,
            action="Provided partial account history (7 days late)",
            has_evidence=True,
            breach=True  # SLA was 3 days
        ),
        # Day 8: DCA proceeds with incomplete info
        ActionEvent(
            day=8,
            actor=Actor.DCA,
            action="Initiated payment plan negotiation with debtor",
            has_evidence=True,
            breach=False
        ),
        # Day 15: Customer communication gap
        ActionEvent(
            day=15,
            actor=Actor.CUSTOMER,
            action="Customer requested invoice clarification",
            has_evidence=False,  # Missing evidence - no documentation
            breach=False
        ),
        # Day 30: DCA waiting for customer response (normal gap)
        ActionEvent(
            day=30,
            actor=Actor.DCA,
            action="Follow-up payment plan offer sent",
            has_evidence=True,
            breach=False
        ),
        # Day 35: FedEx fails to escalate internally
        ActionEvent(
            day=35,
            actor=Actor.FEDEX,
            action="Escalation request submitted to legal team",
            has_evidence=True,
            breach=True  # Should have escalated at day 21
        ),
        # Day 45: Case marked as escalated (failure point)
        ActionEvent(
            day=45,
            actor=Actor.FEDEX,
            action="Case escalated - no resolution achieved",
            has_evidence=True,
            breach=True
        ),
    ]
)


# ============================================================================
# BUSINESS LOGIC: RESPONSIBILITY TIMELINE
# ============================================================================

def calculate_responsibility_timeline(case: Case) -> Dict[str, Any]:
    """
    Deterministic rule-based logic to calculate who owns how many days of the delay.
    
    Rules:
    - DCA owns: Days between assignment and when they complete all required actions
    - FedEx owns: Days FedEx failed to provide info on time or escalate on SLA
    - Customer owns: Days waiting for customer response after reasonable requests
    """
    
    dca_days = 0
    fedex_days = 0
    customer_days = 0
    
    events = case.events
    total_days = events[-1].day if events else 0
    
    # Scan for responsibility ownership periods
    for i, event in enumerate(events):
        current_day = event.day
        next_day = events[i + 1].day if i + 1 < len(events) else total_days
        days_in_period = next_day - current_day
        
        if event.actor == Actor.DCA:
            # DCA owns days while they're actively working
            dca_days += days_in_period
        elif event.actor == Actor.FEDEX:
            # FedEx owns days related to their delays (SLA breaches)
            if event.breach:
                fedex_days += days_in_period
            else:
                # If no breach, it's normal operational time (neutral)
                pass
        elif event.actor == Actor.CUSTOMER:
            # Customer owns days while we're waiting for their response
            if not event.has_evidence:
                customer_days += days_in_period
            else:
                customer_days += days_in_period
    
    # Normalize to avoid overlap - distribute unaccounted days proportionally
    accounted_days = dca_days + fedex_days + customer_days
    if accounted_days < total_days:
        remaining = total_days - accounted_days
        # Remaining days go to DCA (their operational responsibility)
        dca_days += remaining
    
    return {
        "totalDays": total_days,
        "breakdown": {
            "DCA": dca_days,
            "FedEx": fedex_days,
            "Customer": customer_days
        }
    }


# ============================================================================
# BUSINESS LOGIC: OUTCOME EXPLANATION (Rule-Based)
# ============================================================================

def generate_outcome_explanation(case: Case) -> str:
    """
    Generates a deterministic, audit-ready explanation of case failure.
    No ML - pure rule-based analysis of SLA breaches and missing evidence.
    """
    
    breaches = [e for e in case.events if e.breach]
    missing_evidence = [e for e in case.events if not e.has_evidence]
    dca_actions = [e for e in case.events if e.actor == Actor.DCA]
    fedex_breaches = [e for e in breaches if e.actor == Actor.FEDEX]
    
    # Start with objective facts
    explanation = f"Case {case.case_id} ($${case.amount:,.2f}) escalated after {case.events[-1].day} days. "
    
    # Root cause analysis (deterministic)
    if len(fedex_breaches) > 0:
        explanation += f"FedEx failed {len(fedex_breaches)} SLA milestones: "
        breach_actions = [b.action for b in fedex_breaches]
        explanation += "; ".join(breach_actions[:2]) + ". "
    
    if len(missing_evidence) > 0:
        explanation += f"Critical evidence gap on Day {missing_evidence[0].day}: {missing_evidence[0].action}. "
    
    # Assessment
    explanation += f"Of {case.events[-1].day} days, DCA {case.assigned_dca} completed {len(dca_actions)} documented actions. "
    
    # Responsibility assignment
    if len(fedex_breaches) > 0:
        explanation += f"Primary delay caused by FedEx ({len(fedex_breaches)} SLA breaches). "
    if len(missing_evidence) > 0:
        explanation += f"Secondary delay caused by undocumented customer communications. "
    
    # SOP reference
    explanation += "SOP Step 3 (timely document provision) and Step 5 (escalation triggers) were not met."
    
    return explanation


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "TRACE Platform Backend", "status": "running"}


@app.get("/api/case/{case_id}")
def get_case(case_id: str):
    """
    Retrieve case details including action ledger.
    """
    # For this demo, we only have one case
    if case_id != CASE_DATA.case_id:
        return {"error": "Case not found"}, 404
    
    return {
        "case": CASE_DATA.to_dict(),
        "ledger": [event.to_dict() for event in CASE_DATA.events]
    }


@app.get("/api/case/{case_id}/responsibility")
def get_responsibility_timeline(case_id: str):
    """
    Calculate and return responsibility breakdown across parties.
    """
    if case_id != CASE_DATA.case_id:
        return {"error": "Case not found"}, 404
    
    timeline = calculate_responsibility_timeline(CASE_DATA)
    return timeline


@app.get("/api/case/{case_id}/explanation")
def get_outcome_explanation(case_id: str):
    """
    Generate audit-ready explanation of case outcome.
    """
    if case_id != CASE_DATA.case_id:
        return {"error": "Case not found"}, 404
    
    explanation = generate_outcome_explanation(CASE_DATA)
    return {
        "explanation": explanation,
        "generated_at": datetime.now().isoformat()
    }


@app.get("/api/health")
def health_check():
    """Simple health check for deployment verification"""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
