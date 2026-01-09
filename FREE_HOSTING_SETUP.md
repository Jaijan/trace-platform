# TRACE Platform - Free Hosting Setup

All three parts are ready. Here's exactly what to do:

## ✅ What I've Already Done

1. ✅ Created `.gitignore` to exclude unnecessary files
2. ✅ Created `backend/Dockerfile` for container deployment
3. ✅ Updated frontend components to use `VITE_API_URL` environment variable
4. ✅ Committed everything to local git
5. ✅ Created `.env.example` for configuration reference

## 🚀 Your Next Steps

### STEP 1: Create GitHub Account (if needed)
- Go to https://github.com/join
- Create account and verify email

### STEP 2: Create GitHub Repository
```
1. Go to https://github.com/new
2. Repository name: trace-platform
3. Description: Transparent Recovery Accountability & Case Engine
4. Public (so Render/Vercel can access it)
5. DO NOT check "Initialize this repository with..."
6. Click "Create repository"
```

### STEP 3: Push Code to GitHub
```powershell
cd "c:\Users\jai07\OneDrive\Desktop\trace-prototype\trace-prototype"
git remote add origin https://github.com/YOUR_USERNAME/trace-platform.git
git branch -M main
git push -u origin main
```
⚠️ Replace `YOUR_USERNAME` with your GitHub username

### STEP 4: Deploy Backend to Render.com (FREE!)

1. **Sign Up**
   - Go to https://render.com
   - Click "Sign up" → Choose "GitHub"
   - Authorize Render to access your GitHub

2. **Create New Web Service**
   - Dashboard → "New +" → "Web Service"
   - Select `trace-platform` repository
   - Click "Connect"

3. **Configure Backend**
   - **Name:** `trace-platform-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Root Directory:** `backend`
   - **Plan:** Free (scroll down)

4. **Add Environment Variables** (click "Advanced")
   - **Key:** `PYTHONUNBUFFERED`
   - **Value:** `true`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Look for green "Live" status
   - Copy your URL like: `https://trace-platform-backend.onrender.com`

⏰ **Free tier note:** Render spins down after 15 mins of inactivity, so first request takes ~30 seconds.

### STEP 5: Deploy Frontend to Vercel (FREE!)

1. **Sign Up**
   - Go to https://vercel.com
   - Click "Sign up" → Choose "GitHub"
   - Authorize Vercel

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your `trace-platform` repository
   - Click "Import"

3. **Configure Frontend**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (keep default)
   - **Output Directory:** `dist` (keep default)

4. **Add Environment Variable** (click "Environment Variables")
   - **Key:** `VITE_API_URL`
   - **Value:** `https://trace-platform-backend.onrender.com` (your Render URL from Step 4)
   - **Environments:** Select "Production"
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - You'll get a URL like: `https://trace-platform-abc123.vercel.app`

### STEP 6: Test It Works

```
Frontend: https://trace-platform-abc123.vercel.app
Backend:  https://trace-platform-backend.onrender.com/api/health
```

Open the frontend URL in your browser. It should load and communicate with the backend! 🎉

## 💰 Cost

- **Vercel Frontend:** Free (unlimited deployments)
- **Render Backend:** Free with limitations
  - $7/month to keep it always running
  - Free tier: sleeps after 15 mins of inactivity

## 🐛 Troubleshooting

**Backend returns 404?**
- Check your `VITE_API_URL` environment variable in Vercel is correct
- Verify Render backend is deployed (check https://dashboard.render.com)

**Frontend won't load?**
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors (F12)

**Changes not updating?**
- Push to GitHub: `git push origin main`
- Both services auto-redeploy on GitHub push
- Wait 2-5 minutes for Vercel, 5-10 for Render

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more details.
