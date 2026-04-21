import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Tag, FileText, CheckCircle, XCircle, 
  TrendingUp, TrendingDown, Sparkles, DollarSign
} from 'lucide-react';
import api from '../utils/api';

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expense/list');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const productiveCount = expenses.filter(e => e.type === 'productive').length;
  const unproductiveCount = expenses.filter(e => e.type === 'unproductive').length;

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
          <div className="flex items-center h-16 md:h-20">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Expense History</h1>
          <p className="text-sm md:text-base text-gray-400 mb-5 md:mb-8">Track all your expenses in one place</p>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-5 md:mb-8">
            <div className="glass-card p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 truncate">Total</p>
                  <p className="text-xl md:text-3xl font-bold">{expenses.length}</p>
                </div>
                <div className="w-9 h-9 md:w-12 md:h-12 flex-shrink-0 bg-brand-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 md:w-6 md:h-6 text-brand-500" />
                </div>
              </div>
            </div>
            <div className="glass-card p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 truncate">Amount</p>
                  <p className="text-sm md:text-3xl font-bold truncate">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="w-9 h-9 md:w-12 md:h-12 flex-shrink-0 bg-brand-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-brand-500" />
                </div>
              </div>
            </div>
            <div className="glass-card p-3 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs md:text-sm mb-1 truncate">P / U</p>
                  <p className="text-xl md:text-3xl font-bold">{productiveCount} / {unproductiveCount}</p>
                </div>
                <div className="w-9 h-9 md:w-12 md:h-12 flex-shrink-0 bg-brand-500/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-brand-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          {expenses.length === 0 ? (
            <div className="glass-card p-8 md:p-12 text-center">
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No expenses yet</h3>
              <p className="text-sm md:text-base text-gray-400 mb-6">Start tracking your spending by adding your first expense</p>
              <Link to="/add-expense" className="btn-primary inline-flex items-center space-x-2">
                <span>Add Expense</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 md:p-6 ${
                    expense.type === 'productive' ? 'card-productive' : expense.type === 'savings' ? 'card-savings' : 'card-unproductive'
                  }`}
                >
                  {/* Top row: title + amount */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base md:text-xl font-semibold">{expense.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          expense.type === 'productive'
                            ? 'bg-productive-500/20 text-productive-400 border border-productive-500/30'
                            : expense.type === 'savings'
                            ? 'bg-savings-500/20 text-savings-400 border border-savings-500/30'
                            : 'bg-unproductive-500/20 text-unproductive-400 border border-unproductive-500/30'
                        }`}>
                          {expense.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{expense.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-xl md:text-3xl font-bold ${
                        expense.type === 'productive' ? 'text-productive-500' : expense.type === 'savings' ? 'text-savings-500' : 'text-unproductive-500'
                      }`}>
                        ₹{expense.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        {expense.type === 'productive'
                          ? <TrendingUp className="w-3 h-3 text-productive-500" />
                          : <TrendingDown className="w-3 h-3 text-unproductive-500" />}
                        <span className="text-xs text-gray-400">
                          {expense.type === 'productive' ? 'Essential' : expense.type === 'savings' ? 'Savings' : 'Discretionary'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="flex items-start space-x-2 text-xs md:text-sm text-gray-400 mb-3">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{expense.purpose}</p>
                  </div>

                  {/* AI Decision */}
                  {expense.ai_decision && (
                    <div className={`p-3 md:p-4 rounded-xl ${
                      expense.ai_decision === 'YES'
                        ? 'bg-productive-500/10 border border-productive-500/30'
                        : 'bg-unproductive-500/10 border border-unproductive-500/30'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {expense.ai_decision === 'YES'
                          ? <CheckCircle className="w-4 h-4 text-productive-500 flex-shrink-0" />
                          : <XCircle className="w-4 h-4 text-unproductive-500 flex-shrink-0" />}
                        <span className={`text-xs md:text-sm font-semibold ${
                          expense.ai_decision === 'YES' ? 'text-productive-400' : 'text-unproductive-400'
                        }`}>
                          AI: {expense.ai_decision === 'YES' ? 'Recommended' : 'Not Recommended'}
                        </span>
                      </div>
                      {expense.ai_reason && (
                        <p className="text-xs md:text-sm text-gray-400 line-clamp-3">{expense.ai_reason}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
