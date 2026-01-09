# Deployment Guide - TRACE Platform

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository called `trace-platform`
3. Do NOT initialize with README (we already have one)
4. Click "Create repository"

## Step 2: Push to GitHub

Copy these commands and run them:

```powershell
cd "c:\Users\jai07\OneDrive\Desktop\trace-prototype\trace-prototype"
git remote add origin https://github.com/YOUR_USERNAME/trace-platform.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy Backend to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your `trace-platform` repository
5. Fill in:
   - **Name:** trace-platform-backend
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Root Directory:** `backend`
   - **Environment:** Add `PYTHONUNBUFFERED=true`
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://trace-platform-backend.onrender.com`)

## Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your `trace-platform` repository
5. Fill in:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://trace-platform-backend.onrender.com`)
7. Click "Deploy"
8. Wait for deployment (2-5 minutes)
9. Your app will be at `https://your-project-name.vercel.app`

## Step 5: Test Production URLs

- Frontend: https://your-project-name.vercel.app
- Backend: https://trace-platform-backend.onrender.com/api/health

Done! Your TRACE Platform is now live.
