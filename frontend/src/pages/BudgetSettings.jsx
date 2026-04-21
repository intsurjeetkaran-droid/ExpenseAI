import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, DollarSign, TrendingUp, TrendingDown, Save, 
  CheckCircle, AlertCircle, Info
} from 'lucide-react';
import api from '../utils/api';

export default function BudgetSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    income: 0,
    productive_ratio: 60,
    unproductive_ratio: 20,
    savings_ratio: 20,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user/profile');
      setFormData({
        income: response.data.income,
        productive_ratio: response.data.productive_ratio,
        unproductive_ratio: response.data.unproductive_ratio,
        savings_ratio: response.data.savings_ratio,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const totalRatio = formData.productive_ratio + formData.unproductive_ratio + formData.savings_ratio;

  const handleRatioChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    if (field === 'productive_ratio') {
      const remaining = 100 - value;
      newData.unproductive_ratio = Math.round(remaining * 0.5);
      newData.savings_ratio = remaining - newData.unproductive_ratio;
    } else if (field === 'unproductive_ratio') {
      const remaining = 100 - value;
      newData.productive_ratio = Math.round(remaining * 0.75);
      newData.savings_ratio = remaining - newData.productive_ratio;
    } else if (field === 'savings_ratio') {
      const remaining = 100 - value;
      newData.productive_ratio = Math.round(remaining * 0.75);
      newData.unproductive_ratio = remaining - newData.productive_ratio;
    }
    
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (totalRatio !== 100) {
      setError('Budget allocation must equal 100%');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/user/budget', formData);
      setSuccess('Budget settings updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update budget settings');
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Budget Settings</h1>
          <p className="text-sm md:text-base text-gray-400 mb-5 md:mb-8">Customize your income and budget allocation</p>

          {error && (
            <div className="bg-unproductive-500/10 border border-unproductive-500/30 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-unproductive-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-unproductive-400 font-medium">Error</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-productive-500/10 border border-productive-500/30 rounded-xl p-4 mb-6 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-productive-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-productive-400 font-medium">Success</p>
                <p className="text-sm text-gray-400">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Income */}
            <div className="glass-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Monthly Income</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Income (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || 0 })}
                    className="input-field pl-11"
                    placeholder="Enter your monthly income"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Your monthly income is used to calculate budget limits
                </p>
              </div>
            </div>

            {/* Budget Allocation */}
            <div className="glass-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Budget Allocation</h2>

              {/* Total Progress */}
              <div className={`p-6 rounded-xl mb-6 ${
                totalRatio === 100 
                  ? 'bg-productive-500/10 border-2 border-productive-500/30' 
                  : 'bg-unproductive-500/10 border-2 border-unproductive-500/30'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {totalRatio === 100 ? (
                      <CheckCircle className="w-5 h-5 text-productive-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-unproductive-500" />
                    )}
                    <span className="font-semibold">Total Allocation</span>
                  </div>
                  <span className={`text-2xl font-bold ${
                    totalRatio === 100 ? 'text-productive-500' : 'text-unproductive-500'
                  }`}>
                    {totalRatio}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      totalRatio === 100 ? 'bg-productive-500' : 'bg-unproductive-500'
                    }`}
                    style={{ width: `${Math.min(totalRatio, 100)}%` }}
                  ></div>
                </div>
                {totalRatio === 100 && (
                  <p className="text-sm text-productive-400 mt-2">✓ Perfect! Your budget is balanced</p>
                )}
                {totalRatio !== 100 && (
                  <p className="text-sm text-unproductive-400 mt-2">⚠ Total must equal 100%</p>
                )}
              </div>

              <div className="space-y-6">
                {/* Productive Spending */}
                <div className="p-6 rounded-xl bg-productive-500/5 border border-productive-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-productive-500" />
                      <span className="font-semibold">Productive Spending</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Rent, groceries, education, health
                        </div>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-productive-500">{formData.productive_ratio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.productive_ratio}
                    onChange={(e) => handleRatioChange('productive_ratio', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-productive"
                  />
                  <div className="mt-3 bg-productive-500/10 border border-productive-500/20 rounded-lg p-3">
                    <span className="text-lg font-bold text-productive-400">
                      ₹{((formData.income * formData.productive_ratio) / 100).toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">per month</span>
                  </div>
                </div>

                {/* Unproductive Spending */}
                <div className="p-6 rounded-xl bg-unproductive-500/5 border border-unproductive-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-unproductive-500" />
                      <span className="font-semibold">Unproductive Spending</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Entertainment, dining, shopping
                        </div>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-unproductive-500">{formData.unproductive_ratio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.unproductive_ratio}
                    onChange={(e) => handleRatioChange('unproductive_ratio', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-unproductive"
                  />
                  <div className="mt-3 bg-unproductive-500/10 border border-unproductive-500/20 rounded-lg p-3">
                    <span className="text-lg font-bold text-unproductive-400">
                      ₹{((formData.income * formData.unproductive_ratio) / 100).toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">per month</span>
                  </div>
                </div>

                {/* Savings */}
                <div className="p-6 rounded-xl bg-savings-500/5 border border-savings-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Save className="w-5 h-5 text-savings-500" />
                      <span className="font-semibold">Savings</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Emergency fund, investments
                        </div>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-savings-500">{formData.savings_ratio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.savings_ratio}
                    onChange={(e) => handleRatioChange('savings_ratio', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-savings"
                  />
                  <div className="mt-3 bg-savings-500/10 border border-savings-500/20 rounded-lg p-3">
                    <span className="text-lg font-bold text-savings-400">
                      ₹{((formData.income * formData.savings_ratio) / 100).toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">per month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || totalRatio !== 100}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving Changes...' : 'Save Budget Settings'}
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-productive::-webkit-slider-thumb {
          background: #10b981;
        }
        .slider-unproductive::-webkit-slider-thumb {
          background: #ef4444;
        }
        .slider-savings::-webkit-slider-thumb {
          background: #3b82f6;
        }
      `}</style>
    </div>
  );
}
