import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, Plus, List, Settings, DollarSign, TrendingUp, 
  TrendingDown, Save, Sparkles, AlertCircle
} from 'lucide-react';
import api from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [profileRes, summaryRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/expense/summary')
      ]);
      setUser(profileRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-2xl font-bold gradient-text">AI Expense Tracker</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-unproductive-500/10 hover:bg-unproductive-500/20 border border-unproductive-500/30 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-unproductive-400" />
              <span className="text-sm md:text-base text-unproductive-400 hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 md:p-8 mb-4 md:mb-8 bg-gradient-to-br from-brand-500/20 to-purple-500/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
              <div className="flex items-center space-x-2 text-gray-400 text-sm md:text-base">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
                <span>Monthly Income: <span className="text-white font-semibold">₹{user?.income?.toLocaleString()}</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-8">
          <Link to="/add-expense" className="btn-primary flex items-center justify-center space-x-2 py-4 md:py-6">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-lg">Add Expense</span>
          </Link>
          <Link to="/expenses" className="btn-secondary flex items-center justify-center space-x-2 py-4 md:py-6">
            <List className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-lg">View Expenses</span>
          </Link>
          <Link to="/budget-settings" className="btn-secondary flex items-center justify-center space-x-2 py-4 md:py-6">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-base md:text-lg">Budget Settings</span>
          </Link>
        </div>

        {/* Budget Overview */}
        {summary && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Budget Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Productive Spending */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-4 md:p-6 card-productive"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-productive-500/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-productive-500" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-productive-400">Productive</h3>
                      <p className="text-xs md:text-sm text-gray-400">Essential expenses</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span className="text-gray-400">Spent</span>
                    <span className="text-white font-semibold">
                      {Math.min(summary.productive.percentage, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                    <div 
                      className="h-full bg-productive-500 transition-all duration-500"
                      style={{ width: `${Math.min(summary.productive.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spent:</span>
                    <span className="text-productive-400 font-semibold">₹{summary.productive.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Limit:</span>
                    <span className="text-white font-semibold">₹{summary.productive.limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-white font-semibold">₹{summary.productive.remaining.toLocaleString()}</span>
                  </div>
                </div>

                {summary.productive.percentage > 90 && (
                  <div className="mt-4 bg-unproductive-500/10 border border-unproductive-500/30 rounded-lg p-2 md:p-3 flex items-start space-x-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-unproductive-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-unproductive-400">You're approaching your productive spending limit!</p>
                  </div>
                )}
              </motion.div>

              {/* Unproductive Spending */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 md:p-6 card-unproductive"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-unproductive-500/20 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-unproductive-500" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-unproductive-400">Unproductive</h3>
                      <p className="text-xs md:text-sm text-gray-400">Discretionary</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span className="text-gray-400">Spent</span>
                    <span className="text-white font-semibold">
                      {Math.min(summary.unproductive.percentage, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                    <div 
                      className="h-full bg-unproductive-500 transition-all duration-500"
                      style={{ width: `${Math.min(summary.unproductive.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Spent:</span>
                    <span className="text-unproductive-400 font-semibold">₹{summary.unproductive.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Limit:</span>
                    <span className="text-white font-semibold">₹{summary.unproductive.limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Remaining:</span>
                    <span className="text-white font-semibold">₹{summary.unproductive.remaining.toLocaleString()}</span>
                  </div>
                </div>

                {summary.unproductive.percentage > 90 && (
                  <div className="mt-4 bg-unproductive-500/10 border border-unproductive-500/30 rounded-lg p-2 md:p-3 flex items-start space-x-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-unproductive-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-unproductive-400">You're approaching your unproductive spending limit!</p>
                  </div>
                )}
              </motion.div>

              {/* Savings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-4 md:p-6 card-savings"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-savings-500/20 rounded-xl flex items-center justify-center">
                      <Save className="w-5 h-5 md:w-6 md:h-6 text-savings-500" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-savings-400">Savings</h3>
                      <p className="text-xs md:text-sm text-gray-400">Your future</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs md:text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-semibold">
                      {Math.min(summary.savings.percentage, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                    <div 
                      className="h-full bg-savings-500 transition-all duration-500"
                      style={{ width: `${Math.min(summary.savings.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Actual:</span>
                    <span className="text-savings-400 font-semibold">₹{summary.savings.actual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target:</span>
                    <span className="text-white font-semibold">₹{summary.savings.target.toLocaleString()}</span>
                  </div>
                </div>

                {summary.savings.percentage >= 100 && (
                  <div className="mt-4 bg-productive-500/10 border border-productive-500/30 rounded-lg p-2 md:p-3 flex items-start space-x-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-productive-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-productive-400">Great job! You've reached your savings goal! 🎉</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
