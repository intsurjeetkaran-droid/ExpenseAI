import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';
import BudgetSettings from './pages/BudgetSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/budget-settings" element={<BudgetSettings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
