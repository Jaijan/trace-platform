@echo off
echo ===================================================
echo TRACE Platform - Hackathon Prototype Startup
echo ===================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

echo [1/4] Starting backend server...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python main.py"

echo [2/3] Waiting for backend to start...
timeout /t 3 /nobreak

echo [3/4] Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
)

echo [4/4] Starting frontend development server...
start cmd /k "npm run dev"

echo.
echo ===================================================
echo TRACE Platform is starting:
echo   Backend: http://localhost:8000 (FastAPI)
echo   Frontend: http://localhost:3000 (React)
echo ===================================================
echo.
echo Press Ctrl+C in either window to stop
timeout /t 5
