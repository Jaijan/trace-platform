#!/bin/bash

echo "==================================================="
echo "TRACE Platform - Hackathon Prototype Startup"
echo "==================================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Start backend
echo "[1/4] Starting backend server..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py &
BACKEND_PID=$!

echo "[2/3] Waiting for backend to start..."
sleep 3

# Start frontend
echo "[3/4] Installing frontend dependencies..."
cd ../frontend
if [ ! -d node_modules ]; then
    npm install
fi

echo "[4/4] Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================================="
echo "TRACE Platform is running:"
echo "  Backend:  http://localhost:8000 (FastAPI)"
echo "  Frontend: http://localhost:3000 (React)"
echo "==================================================="
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
