# 🚀 Deployment Configuration - AI Expense Tracker

## ✅ DEPLOYED URLS

### Backend (Render)
**URL:** https://expenseai-dck9.onrender.com
**API Endpoint:** https://expenseai-dck9.onrender.com/api

### Frontend (Render)
**URL:** https://expenseai-frontend-y2ju.onrender.com

---

## Backend Configuration ✅

### Environment Variables on Render:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `GROQ_API_KEY` - Groq API key for AI features
- `PORT` - Auto-set by Render

### CORS Configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://expenseai-dck9.onrender.com',
    'https://expenseai-frontend-y2ju.onrender.com'
  ],
  credentials: true
}));
```

---

## Frontend Configuration ✅

### Build Settings:
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

### Environment Variable:
```
VITE_API_URL=https://expenseai-dck9.onrender.com/api
```

---

## 🎉 Your App is LIVE!

### Access Your App:
🌐 **Frontend:** https://expenseai-frontend-y2ju.onrender.com
🔌 **Backend API:** https://expenseai-dck9.onrender.com/api

---

## Testing Checklist

Visit your frontend URL and test:

- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays properly
- [ ] Add expense functionality
- [ ] AI suggestions work
- [ ] Budget settings can be updated
- [ ] Expenses list displays
- [ ] Admin dashboard (if admin user)
- [ ] Mobile responsiveness
- [ ] All navigation links work

---

## API Endpoints

Base URL: `https://expenseai-dck9.onrender.com/api`

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User
- `GET /user/profile` - Get user profile
- `PUT /user/budget` - Update budget settings

### Expenses
- `GET /expense` - Get all expenses
- `POST /expense` - Add new expense
- `PUT /expense/:id` - Update expense
- `DELETE /expense/:id` - Delete expense

### AI
- `POST /ai/analyze` - Get AI expense analysis

### Admin
- `GET /admin/users` - Get all users (admin only)
- `GET /admin/stats` - Get system stats (admin only)

---

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:** Check that CORS is updated (already done ✅)

### Issue: API calls return 401
**Solution:** Check JWT token in localStorage

### Issue: AI suggestions not working
**Solution:** Verify GROQ_API_KEY is set in backend environment variables

### Issue: Render services sleeping
**Note:** Free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Performance Notes

⚠️ **Render Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for one service 24/7)

💡 **Tip:** For production use, consider upgrading to paid tier for:
- No sleeping
- Faster performance
- More resources

---

## Next Steps

1. ✅ Test all features on live site
2. ✅ Share the URL with users
3. ✅ Monitor backend logs on Render dashboard
4. ✅ Set up custom domain (optional)
5. ✅ Enable HTTPS (already enabled by Render)

---

## 🎊 Congratulations!

Your AI Expense Tracker is now live and accessible to anyone! 🚀

**Share your app:** https://expenseai-frontend-y2ju.onrender.com
