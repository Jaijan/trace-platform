# TRACE Platform - Pre-Demo Checklist

## ✅ Installation Verification

- [ ] **Python 3.8+** installed
  ```bash
  python --version
  ```

- [ ] **Node.js 16+** installed
  ```bash
  node --version
  npm --version
  ```

## ✅ Backend Setup

- [ ] Backend folder has `main.py` and `requirements.txt`
  ```bash
  cd backend && ls
  ```

- [ ] Virtual environment created
  ```bash
  python -m venv venv
  venv\Scripts\activate  # Windows
  # OR
  source venv/bin/activate  # Mac/Linux
  ```

- [ ] Dependencies installed
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Backend server starts without errors
  ```bash
  python main.py
  # Should show: "Uvicorn running on http://0.0.0.0:8000"
  ```

- [ ] Health check works
  ```bash
  curl http://localhost:8000/api/health
  # Should return: {"status":"ok"}
  ```

## ✅ Frontend Setup

- [ ] Frontend folder has `package.json` and `src/` directory
  ```bash
  cd frontend && ls
  ```

- [ ] Dependencies installed
  ```bash
  npm install
  # Should take 1-2 minutes, completes without errors
  ```

- [ ] Frontend server starts
  ```bash
  npm run dev
  # Should show: "Local: http://localhost:3000"
  ```

- [ ] Browser loads without errors
  - Open http://localhost:3000
  - Should see TRACE Platform header
  - No red error boxes
  - No console errors (F12 > Console tab)

## ✅ Data Verification

- [ ] Case Details loads
  - Case ID shows: `FDX-2025-087432`
  - Amount shows: `$125,500.00`
  - DCA shows: `CollectCorp Solutions`
  - Status shows: `Escalated`
  - Ledger table has 8 rows

- [ ] Ledger table shows all events
  - Row 1: Day 1, DCA, "Initial debtor contact"
  - Row 2: Day 1, DCA, "Requested account documentation"
  - Row 3: Day 8, FedEx, "Provided partial account history", breach ❌
  - Row 4: Day 8, DCA, "Initiated payment plan"
  - Row 5: Day 15, Customer, "Requested invoice clarification", evidence ❌
  - Row 6: Day 30, DCA, "Follow-up payment plan offer"
  - Row 7: Day 35, FedEx, "Escalation request", breach ❌
  - Row 8: Day 45, FedEx, "Case escalated", breach ❌

- [ ] Responsibility Timeline shows
  - Card 1: "DCA (CollectCorp)" = `24 days` (53.3%)
  - Card 2: "FedEx" = `14 days` (31.1%)
  - Card 3: "Customer" = `7 days` (15.6%)
  - Stacked bar chart reflects proportions
  - Insight box mentions FedEx breaches

- [ ] Outcome Explainer works
  - Click "Generate Outcome Explanation"
  - Text appears (no errors)
  - Paragraph mentions: FedEx, SLA breaches, 45 days, SOP steps
  - Footer shows: "✓ Rule-based analysis • No predictions • Audit-ready"

## ✅ API Verification

Test each endpoint from backend (while both servers running):

- [ ] GET `/api/case/FDX-2025-087432`
  ```bash
  curl http://localhost:8000/api/case/FDX-2025-087432
  # Returns: case object + ledger array (8 events)
  ```

- [ ] GET `/api/case/FDX-2025-087432/responsibility`
  ```bash
  curl http://localhost:8000/api/case/FDX-2025-087432/responsibility
  # Returns: totalDays: 45, breakdown: {DCA: 24, FedEx: 14, Customer: 7}
  ```

- [ ] GET `/api/case/FDX-2025-087432/explanation`
  ```bash
  curl http://localhost:8000/api/case/FDX-2025-087432/explanation
  # Returns: explanation text + generated_at timestamp
  ```

- [ ] Invalid case returns error
  ```bash
  curl http://localhost:8000/api/case/INVALID
  # Returns: {"error": "Case not found"} with 404 status
  ```

## ✅ Demo Walkthrough

### Setup (5 min before demo)
- [ ] Both servers running in separate terminals
- [ ] Backend terminal shows "Uvicorn running on http://0.0.0.0:8000"
- [ ] Frontend terminal shows "Local: http://localhost:3000"
- [ ] Browser tab open to http://localhost:3000
- [ ] Minimize unnecessary windows
- [ ] Mute notifications

### Demo Timing (180 seconds)
- [ ] 0:00-0:30 → Show Case Details
  - Click case details section
  - Scroll to ledger table
  - Point out breaches (❌ in breach column)
  - Point out missing evidence (❌ in evidence column)

- [ ] 0:30-1:30 → Show Responsibility Timeline
  - Scroll down to timeline section
  - Point to 3 breakdown cards
  - Read percentages: FedEx = 31%, DCA = 53%, Customer = 16%
  - Point to stacked bar chart
  - Read insight: "FedEx SLA breaches directly caused..."

- [ ] 1:30-3:00 → Show Outcome Explanation
  - Scroll to explainer section
  - Click "Generate Outcome Explanation" button
  - Wait for text to appear (< 1 second)
  - Read generated explanation aloud
  - Point to footer: "Rule-based, no predictions, audit-ready"
  - Emphasize: "Everything in this explanation comes from the ledger above"

### Key Points During Demo
- [ ] Emphasize: "Every action has an actor (DCA, FedEx, Customer)"
- [ ] Emphasize: "Evidence is documented (✅) or missing (❌)"
- [ ] Emphasize: "SLA breaches are clear and measurable"
- [ ] Emphasize: "FedEx owns 31% of the delay, not subjectively but objectively"
- [ ] Emphasize: "The explanation is rule-based, not ML, so it's auditable"

## ✅ Backup Plan

If something breaks during demo:

- [ ] Have IMPLEMENTATION_SUMMARY.md open as backup
  - Shows all screenshots and expected behavior
  
- [ ] Have ARCHITECTURE.md ready to explain design
  - If technical questions arise
  
- [ ] Have QUICKSTART.md ready for judges to run locally
  - "It's running on my machine, you can run it yourself"

- [ ] Terminal history available to show:
  ```bash
  history | grep -E "(npm|python|curl)"
  # Shows exactly what was run to get here
  ```

## ✅ Post-Demo

- [ ] Take screenshot of all three views
  - Case Details (full page)
  - Responsibility Timeline (full page)
  - Outcome Explanation (with generated text)

- [ ] Save browser console output (F12 > Console)
  - Verify no errors

- [ ] Save terminal outputs
  - Backend startup logs
  - Frontend startup logs

- [ ] Test in incognito mode (clear cache)
  - Open http://localhost:3000 in incognito
  - Verify everything still works

---

## 🚨 If Tests Fail

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
cd backend
rm -rf venv
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# Try again
python main.py
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### CORS errors
```bash
# Make sure backend is running
# Verify: curl http://localhost:8000/api/health returns {"status":"ok"}

# If still failing:
# 1. Kill frontend server (Ctrl+C)
# 2. Kill backend server (Ctrl+C)
# 3. Close all terminals
# 4. Start fresh with start.bat (Windows) or start.sh (Mac/Linux)
```

### Data not loading
```bash
# Check backend API manually
curl http://localhost:8000/api/case/FDX-2025-087432

# If returns error, check main.py:
# - Look for syntax errors
# - Verify case ID matches exactly: FDX-2025-087432
# - Restart backend server
```

---

**You're ready to demo when:**
1. ✅ Both servers running
2. ✅ Browser loads http://localhost:3000 without errors
3. ✅ All three sections visible and populated with data
4. ✅ Outcome explainer generates text in < 1 second
5. ✅ Console tab (F12) shows no red errors

**Demo starts when you're confident all checkboxes are checked.**
