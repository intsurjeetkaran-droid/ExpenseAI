# 🚀 Deployment Configuration - AI Expense Tracker

## Backend (Render) ✅ DEPLOYED
**URL:** https://expenseai-dck9.onrender.com

### Environment Variables Set on Render:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `GROQ_API_KEY` - Groq API key for AI features
- `PORT` - Auto-set by Render

---

## Frontend Deployment Options

### Option 1: Netlify (Recommended) 🌟

#### Configuration:
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

#### Environment Variable:
```
VITE_API_URL=https://expenseai-dck9.onrender.com/api
```

#### Steps:
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `ExpenseAI` repository
4. Configure build settings (as above)
5. Add environment variable
6. Click "Deploy site"

---

### Option 2: Render Static Site

#### Configuration:
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

#### Environment Variable:
```
VITE_API_URL=https://expenseai-dck9.onrender.com/api
```

---

## Post-Deployment Steps

### 1. Update Backend CORS
After getting your frontend URL, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://expenseai-dck9.onrender.com',
    'https://your-frontend-url.netlify.app'  // Add your actual frontend URL
  ],
  credentials: true
}));
```

Then push to GitHub to trigger Render redeploy:
```bash
git add backend/server.js
git commit -m "Update CORS with frontend URL"
git push origin main
```

### 2. Test Your Deployment
- ✅ Visit frontend URL
- ✅ Test user registration
- ✅ Test login
- ✅ Test adding expenses
- ✅ Test AI suggestions
- ✅ Test budget settings
- ✅ Test admin dashboard

---

## Current Status

✅ **Backend:** Deployed on Render  
⏳ **Frontend:** Ready to deploy  
✅ **GitHub:** Code pushed  
✅ **Configuration:** Updated with backend URL

---

## Quick Deploy Commands

### Push Updated Config to GitHub:
```bash
git add .
git commit -m "Update backend URL for production"
git push origin main
```

### Test Backend API:
```bash
curl https://expenseai-dck9.onrender.com/
```

Expected response:
```json
{"message":"🚀 AI Expense Tracker API Running"}
```

---

## 🎉 You're Almost Done!

Just deploy the frontend and your app will be live! 🚀
