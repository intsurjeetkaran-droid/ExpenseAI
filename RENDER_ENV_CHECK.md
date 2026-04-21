# 🔧 Render Environment Variable Setup

## ✅ Issue Fixed

The API URL was hardcoded to `localhost`. Now it reads from environment variable.

---

## 🚨 IMPORTANT: Set Environment Variable on Render

### For Frontend Service on Render:

1. Go to your Render dashboard
2. Click on your **frontend service** (expenseai-frontend-y2ju)
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   ```
   Key: VITE_API_URL
   Value: https://expenseai-dck9.onrender.com/api
   ```
6. Click **"Save Changes"**
7. Render will **automatically redeploy** with the new variable

---

## 🔍 Verify Environment Variable

After the redeploy completes (2-3 minutes):

1. Visit: https://expenseai-frontend-y2ju.onrender.com
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Type: `import.meta.env.VITE_API_URL`
5. Should show: `https://expenseai-dck9.onrender.com/api`

---

## 🧪 Test API Connection

1. Visit: https://expenseai-frontend-y2ju.onrender.com
2. Try to register a new account
3. Check browser Network tab (F12 → Network)
4. Should see requests going to: `https://expenseai-dck9.onrender.com/api/auth/register`

---

## ⚠️ Common Issues

### Issue: Still getting 404
**Cause:** Environment variable not set on Render
**Solution:** Follow steps above to add `VITE_API_URL` in Render dashboard

### Issue: CORS error
**Cause:** Backend CORS not updated (already fixed ✅)
**Solution:** Already done - backend allows frontend URL

### Issue: Service sleeping
**Cause:** Render free tier sleeps after 15 minutes
**Solution:** Wait 30-60 seconds for service to wake up

---

## 📝 Current Configuration

### Backend
- **URL:** https://expenseai-dck9.onrender.com
- **API:** https://expenseai-dck9.onrender.com/api
- **Status:** ✅ Running

### Frontend
- **URL:** https://expenseai-frontend-y2ju.onrender.com
- **Environment Variable Needed:** `VITE_API_URL=https://expenseai-dck9.onrender.com/api`
- **Status:** ⏳ Waiting for environment variable

---

## 🎯 Next Steps

1. ✅ Code fix pushed to GitHub
2. ⏳ Add environment variable on Render (YOU NEED TO DO THIS)
3. ⏳ Wait for automatic redeploy
4. ✅ Test the app

---

## 🚀 After Setting Environment Variable

Your app will work correctly and all API calls will go to:
`https://expenseai-dck9.onrender.com/api`

Instead of:
`http://localhost:5000/api` ❌
