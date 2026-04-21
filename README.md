# AI Expense Tracker 🚀

A full-stack expense management platform powered by Groq AI. Users track spending, set budgets, and get real-time AI recommendations. Admins monitor the platform through a separate analytics dashboard.

## 🌐 Live Demo

- **Web App:** https://expenseai-frontend-y2ju.onrender.com
- **Backend API:** https://expenseai-dck9.onrender.com/api

## 📱 Download Android App

**Latest Release:** [v1.0.0](https://github.com/intsurjeetkaran-droid/ExpenseAI/releases/latest)

Download the APK and install on your Android device (Android 5.1+)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS v3, Framer Motion, React Router DOM v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day expiry), bcryptjs |
| AI | Groq API — LLaMA 3.3 70B Versatile |
| Mobile | Capacitor 6 (Android) |

---

## Features

### 🔐 Authentication
- User registration with 3-step onboarding
- Secure login with JWT tokens
- Role-based access (User/Admin)

### 💰 Expense Management
- Add expenses with AI analysis
- View expense history
- Edit and delete expenses
- Category-based organization

### 🤖 AI-Powered Insights
- Automatic expense categorization (Productive/Unproductive/Savings)
- Smart budget recommendations
- Real-time spending analysis
- Personalized financial advice

### 📊 Budget Management
- Set monthly income
- Configure budget allocation with sliders
- Visual budget tracking
- Real-time spending limits

### 📈 Dashboard
- Budget overview cards
- Spending progress bars
- Quick action buttons
- Responsive design

### 👨‍💼 Admin Panel
- System-wide statistics
- User management
- Risk user monitoring
- Platform analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS v3, Framer Motion, React Router DOM v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day expiry), bcryptjs |
| AI | Groq API — LLaMA 3.3 70B Versatile |

---

## Project Structure

```
expenseAI/
├── backend/
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── expense.js
│   │   ├── ai.js
│   │   └── admin.js
│   ├── services/groq.js
│   ├── seed.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── AddExpense.jsx
│       │   ├── Expenses.jsx
│       │   ├── BudgetSettings.jsx
│       │   └── AdminDashboard.jsx
│       └── utils/api.js
├── CREDENTIALS.txt
└── details.txt
```

---

## Roles

### User
Regular platform users who manage their own finances.

- Register at `/register` (3-step onboarding)
- Set monthly income and budget ratios (productive / unproductive / savings)
- Add expenses and get AI recommendations before spending
- View expense history with AI decisions
- Update budget settings anytime
- Redirected to `/dashboard` on login

**DB fields**: `name`, `email`, `password`, `role`, `income`, `productive_ratio`, `unproductive_ratio`, `savings_ratio`

### Admin
Monitor-only role. Cannot add expenses or set budgets.

- Created via `POST /api/auth/create-admin` or `node seed.js`
- Views system-wide stats, all users, spending distribution, risk users
- Redirected to `/admin` on login

**DB fields**: `name`, `email`, `password`, `role` only

---

## AI Integration

The AI automatically handles expense categorization — users never need to decide if something is productive or unproductive.

### Flow

1. User fills in: title, amount, category, purpose
2. Clicks **Get AI Suggestion**
3. AI (LLaMA 3.3 70B via Groq) analyzes the expense against the user's budget
4. Returns:
   - **Type**: `productive` / `unproductive` / `savings`
   - **Decision**: `YES` or `NO`
   - **Reason**: 2–3 sentence explanation
   - **Suggestion**: Alternative advice if NO
   - **Budget Impact**: current spending, limit, after-expense amount, % used
5. User reviews and decides whether to save the expense

### Categorization Logic

| Expense Type | Examples |
|---|---|
| Productive | Education, healthcare, bills, groceries, work tools |
| Unproductive | Entertainment, dining out, luxury shopping, gaming |
| Savings | Investments, emergency fund, fixed deposits |

### AI Model Config

```javascript
model: 'llama-3.3-70b-versatile'
temperature: 0.3
max_tokens: 500
top_p: 0.9
```

---

## Setup

### 🌐 Use Live Version (Recommended)

**Web App:** https://expenseai-frontend-y2ju.onrender.com  
**Android App:** [Download APK](https://github.com/intsurjeetkaran-droid/ExpenseAI/releases/latest)

No setup required! Just visit the web app or install the Android APK.

### 🛠️ Local Development

#### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- Groq API key — [console.groq.com/keys](https://console.groq.com/keys)

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_secret_here
GROQ_API_KEY=gsk_...
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Seed Database

```bash
cd backend
node seed.js
```

Creates 1 admin + 5 users with sample expenses. All passwords: `password123`

### Run

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

| URL | Description |
|---|---|
| http://localhost:5173 | Frontend |
| http://localhost:5173/admin | Admin dashboard |
| http://localhost:5173/dashboard | User dashboard |
| http://localhost:5000 | Backend API |

---

## 📱 Mobile App (Android)

### Download
Get the latest APK from [Releases](https://github.com/intsurjeetkaran-droid/ExpenseAI/releases/latest)

### Build from Source
```bash
cd frontend
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK location: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## API Reference

### Auth

```
POST /api/auth/register       — Create user account
POST /api/auth/login          — Login (user or admin)
POST /api/auth/create-admin   — Create admin account
```

### User

```
GET  /api/user/profile        — Get profile + budget
PUT  /api/user/budget         — Update income and ratios
```

### Expenses

```
POST /api/expense/add         — Add expense
GET  /api/expense/list        — Get user's expenses
GET  /api/expense/summary     — Budget summary
PUT  /api/expense/:id         — Update expense
DELETE /api/expense/:id       — Delete expense
```

### AI

```
POST /api/ai/suggest          — Analyze expense, return type + decision
```

Request body:
```json
{
  "title": "Online Course",
  "amount": 5000,
  "category": "Education",
  "purpose": "Learn web development for career growth"
}
```

Response:
```json
{
  "suggested_type": "productive",
  "decision": "YES",
  "reason": "This is a productive expense...",
  "suggestion": "Great choice! Investing in education...",
  "budget_status": {
    "current_spending": 5000,
    "budget_limit": 30000,
    "after_expense": 10000,
    "remaining": 25000,
    "percentage_used": "33.3"
  }
}
```

### Admin

```
GET /api/admin/stats          — System-wide stats
GET /api/admin/users          — All users
GET /api/admin/risk-users     — Users exceeding budget
```

---

## Database Schema

### User

```js
{
  name: String,               // required
  email: String,              // required, unique
  password: String,           // hashed
  role: 'user' | 'admin',
  income: Number,             // users only
  productive_ratio: Number,   // users only, default 60
  unproductive_ratio: Number, // users only, default 20
  savings_ratio: Number,      // users only, default 20
  createdAt: Date
}
```

### Expense

```js
{
  user_id: ObjectId,
  title: String,
  amount: Number,
  category: String,
  type: 'productive' | 'unproductive' | 'savings',
  purpose: String,
  date: Date,
  ai_decision: 'YES' | 'NO',
  ai_reason: String,
  createdAt: Date
}
```

---

## Environment Variables

### `backend/.env`

| Key | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `GROQ_API_KEY` | Groq API key |

### `frontend/.env`

| Key | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Credentials

See `CREDENTIALS.txt` for all login details.

**Admin**: `admin@example.com` / `password123`  
**Users**: `john@example.com`, `jane@example.com`, `mike@example.com`, `sarah@example.com`, `david@example.com` — all use `password123`

---

## UI

- Dark glassmorphism design
- Fully responsive — mobile, tablet, desktop
- No horizontal scroll (overflow-x hidden at root)
- Framer Motion animations
- Color system: Indigo (primary), Green (productive), Red (unproductive), Blue (savings)

---

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Role-based route protection on all endpoints
- Registration endpoint forces `role: 'user'` — admin creation is separate
- HTTPS enabled in production
- CORS configured for security

---

## 🚀 Deployment

### Production URLs
- **Frontend:** https://expenseai-frontend-y2ju.onrender.com
- **Backend:** https://expenseai-dck9.onrender.com
- **Platform:** Render (Free Tier)

### Note
Free tier services may sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

## 👨‍💻 Developer

**Surjeet Karan**  
GitHub: [@intsurjeetkaran-droid](https://github.com/intsurjeetkaran-droid)

---

## 🐛 Issues & Feedback

Found a bug or have a suggestion? [Open an issue](https://github.com/intsurjeetkaran-droid/ExpenseAI/issues)

---

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!
