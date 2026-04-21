import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, DollarSign, FileText, Tag, Calendar, Brain, 
  CheckCircle, XCircle, Sparkles, AlertCircle, Loader
} from 'lucide-react';
import api from '../utils/api';

export default function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    purpose: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other'
  ];

  const getAISuggestion = async () => {
    if (!formData.title || !formData.amount || !formData.category || !formData.purpose) {
      setError('Please fill all fields before getting AI suggestion');
      return;
    }

    setAiLoading(true);
    setError('');

    try {
      const response = await api.post('/ai/suggest', {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        purpose: formData.purpose,
      });
      setAiSuggestion(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI suggestion');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/expense/add', {
        ...formData,
        amount: parseFloat(formData.amount),
        type: aiSuggestion?.suggested_type || 'productive',
        ai_decision: aiSuggestion?.decision || null,
        ai_reason: aiSuggestion?.reason || null,
      });
      navigate('/expenses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Add New Expense</h1>
          <p className="text-sm md:text-base text-gray-400 mb-5 md:mb-8">Get AI-powered recommendations before you spend</p>

          {error && (
            <div className="bg-unproductive-500/10 border border-unproductive-500/30 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-unproductive-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-unproductive-400 font-medium">Error</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {/* Form */}
            <div className="glass-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Expense Details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field pl-11"
                      placeholder="e.g., New Headphones"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-field pl-11"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field pl-11"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Purpose
                  </label>
                  <textarea
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Why do you need this?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getAISuggestion}
                  disabled={aiLoading}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  {aiLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Getting AI Suggestion...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Get AI Suggestion</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Adding Expense...' : 'Add Expense'}
                </button>
              </form>
            </div>

            {/* AI Suggestion */}
            <div>
              <div className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">AI Recommendation</h2>
                    <p className="text-sm text-gray-400">Smart spending insights powered by AI</p>
                  </div>
                </div>

                {!aiSuggestion && !aiLoading && (
                  <div className="text-center py-12">
                    <div className="relative">
                      <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-brand-500/20 rounded-full blur-xl"></div>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4 font-medium">Ready to analyze your expense</p>
                    <div className="text-sm text-gray-500 space-y-2 max-w-xs mx-auto">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-productive-500 rounded-full"></div>
                        <p>AI will automatically categorize your expense</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                        <p>Check if it fits your budget</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <p>Provide smart recommendations</p>
                      </div>
                    </div>
                  </div>
                )}

                {aiLoading && (
                  <div className="text-center py-12">
                    <div className="relative">
                      <Loader className="w-16 h-16 text-brand-500 mx-auto mb-4 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-brand-500/30 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-gray-400 font-medium mb-2">Analyzing your expense...</p>
                    <p className="text-sm text-gray-500">AI is evaluating budget impact and categorization</p>
                  </div>
                )}

                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    {/* AI Categorization Badge */}
                    <div className={`p-4 rounded-xl border-2 ${
                      aiSuggestion.suggested_type === 'productive'
                        ? 'bg-productive-500/10 border-productive-500/30'
                        : aiSuggestion.suggested_type === 'unproductive'
                        ? 'bg-unproductive-500/10 border-unproductive-500/30'
                        : 'bg-savings-500/10 border-savings-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-400 mb-1 font-medium">AI Categorized as</div>
                          <div className="text-xl font-bold capitalize flex items-center space-x-2">
                            <span>{aiSuggestion.suggested_type}</span>
                            {aiSuggestion.suggested_type === 'productive' && <span className="text-sm">✓</span>}
                            {aiSuggestion.suggested_type === 'unproductive' && <span className="text-sm">⚠</span>}
                            {aiSuggestion.suggested_type === 'savings' && <span className="text-sm">💰</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {aiSuggestion.suggested_type === 'productive' && 'Essential & Growth-oriented'}
                            {aiSuggestion.suggested_type === 'unproductive' && 'Discretionary & Entertainment'}
                            {aiSuggestion.suggested_type === 'savings' && 'Investment & Future Goals'}
                          </div>
                        </div>
                        <Tag className={`w-10 h-10 ${
                          aiSuggestion.suggested_type === 'productive'
                            ? 'text-productive-500'
                            : aiSuggestion.suggested_type === 'unproductive'
                            ? 'text-unproductive-500'
                            : 'text-savings-500'
                        }`} />
                      </div>
                    </div>

                    {/* AI Decision Card */}
                    <div className={`p-6 rounded-xl border-2 ${
                      aiSuggestion.decision === 'YES'
                        ? 'bg-productive-500/10 border-productive-500/30'
                        : 'bg-unproductive-500/10 border-unproductive-500/30'
                    }`}>
                      <div className="flex items-start space-x-3 mb-4">
                        {aiSuggestion.decision === 'YES' ? (
                          <div className="flex-shrink-0">
                            <CheckCircle className="w-8 h-8 text-productive-500" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0">
                            <XCircle className="w-8 h-8 text-unproductive-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-lg font-bold mb-1">
                            {aiSuggestion.decision === 'YES' ? 'Recommended ✓' : 'Not Recommended ✗'}
                          </div>
                          <div className="text-xs text-gray-400 font-medium">AI Decision</div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">Analysis</div>
                        <p className="text-gray-300 leading-relaxed">{aiSuggestion.reason}</p>
                      </div>
                      
                      {aiSuggestion.suggestion && (
                        <div className="bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-lg p-4 border border-brand-500/20">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-brand-400 mb-1 font-semibold uppercase tracking-wide">AI Suggestion</div>
                              <p className="text-sm text-gray-300 leading-relaxed">{aiSuggestion.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Budget Impact Card */}
                    {aiSuggestion.budget_status && (
                      <div className="glass p-5 rounded-xl border border-white/10">
                        <div className="flex items-center space-x-2 mb-4">
                          <DollarSign className="w-5 h-5 text-brand-400" />
                          <h3 className="font-bold text-white">Budget Impact</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-gray-400 font-medium">Current Spending</span>
                            <span className="text-white font-bold">₹{aiSuggestion.budget_status.current_spending?.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-gray-400 font-medium">Budget Limit</span>
                            <span className="text-white font-bold">₹{aiSuggestion.budget_status.budget_limit?.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-gray-400 font-medium">After This Expense</span>
                            <span className={`font-bold text-lg ${
                              aiSuggestion.budget_status.after_expense > aiSuggestion.budget_status.budget_limit
                                ? 'text-unproductive-500'
                                : 'text-productive-500'
                            }`}>
                              ₹{aiSuggestion.budget_status.after_expense?.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-lg border border-brand-500/20">
                            <span className="text-sm text-gray-300 font-medium">Budget Usage</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    parseFloat(aiSuggestion.budget_status.percentage_used) > 100
                                      ? 'bg-unproductive-500'
                                      : parseFloat(aiSuggestion.budget_status.percentage_used) > 80
                                      ? 'bg-yellow-500'
                                      : 'bg-productive-500'
                                  }`}
                                  style={{ width: `${Math.min(parseFloat(aiSuggestion.budget_status.percentage_used), 100)}%` }}
                                ></div>
                              </div>
                              <span className={`font-bold ${
                                parseFloat(aiSuggestion.budget_status.percentage_used) > 100
                                  ? 'text-unproductive-500'
                                  : parseFloat(aiSuggestion.budget_status.percentage_used) > 80
                                  ? 'text-yellow-500'
                                  : 'text-productive-500'
                              }`}>
                                {aiSuggestion.budget_status.percentage_used}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
