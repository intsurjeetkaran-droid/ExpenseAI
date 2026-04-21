import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, DollarSign, TrendingUp, TrendingDown, 
  Save, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    income: 50000,
    productive_ratio: 60,
    unproductive_ratio: 20,
    savings_ratio: 20,
  });

  const steps = [
    { title: 'Account', icon: User },
    { title: 'Income', icon: DollarSign },
    { title: 'Budget', icon: Save },
  ];

  const totalRatio = formData.productive_ratio + formData.unproductive_ratio + formData.savings_ratio;

  const handleNext = () => {
    setError('');
    if (currentStep === 0) {
      if (!formData.name || formData.name.length < 2) {
        setError('Name must be at least 2 characters');
        return;
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.income || formData.income < 1000) {
        setError('Income must be at least ₹1,000');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

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

  const handleSubmit = async () => {
    if (totalRatio !== 100) {
      setError('Budget allocation must equal 100%');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="glass-card p-5 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl mb-3 md:mb-4">
              <User className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Create Account</h1>
            <p className="text-sm md:text-base text-gray-400">Complete your profile in 3 easy steps</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-unproductive-500/10 border border-unproductive-500/30 rounded-xl p-3 md:p-4 mb-5 md:mb-6 flex items-start space-x-3"
            >
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-unproductive-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-unproductive-400 font-medium">Error</p>
                <p className="text-xs md:text-sm text-gray-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Stepper */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-br from-brand-500 to-purple-600' 
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <step.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                  <span className={`text-xs md:text-sm mt-1 md:mt-2 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 md:mx-2 transition-all duration-300 ${
                    index < currentStep ? 'bg-brand-500' : 'bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[320px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Step 1: Account Info */}
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Account Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field pl-10 md:pl-11"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field pl-10 md:pl-11"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-field pl-10 md:pl-11"
                        placeholder="Create a secure password (min 6 chars)"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Income */}
              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Monthly Income</h2>
                    <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Set your monthly income to calculate budget limits</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Monthly Income (₹)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.income}
                        onChange={(e) => setFormData({ ...formData, income: parseInt(e.target.value) || 0 })}
                        className="input-field pl-11"
                        placeholder="Enter your monthly income"
                        min="1000"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div className="glass-card p-6 bg-gradient-to-br from-brand-500/20 to-purple-500/20 border-brand-500/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-productive-500" />
                      <span className="text-lg font-semibold">Income Preview</span>
                    </div>
                    <div className="text-4xl font-bold gradient-text mb-2">
                      ₹{formData.income?.toLocaleString() || '0'}
                    </div>
                    <p className="text-gray-400">
                      This will be used to calculate your spending limits and savings goals
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Budget Allocation */}
              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Budget Allocation</h2>
                    <p className="text-gray-400 mb-6">Customize how you want to split your income</p>
                  </div>

                  {/* Total Progress */}
                  <div className={`glass-card p-6 ${
                    totalRatio === 100 
                      ? 'bg-gradient-to-br from-productive-500/20 to-productive-600/10 border-productive-500/30' 
                      : 'bg-gradient-to-br from-unproductive-500/20 to-unproductive-600/10 border-unproductive-500/30'
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

                  {/* Productive Spending */}
                  <div className="glass-card p-6 card-productive">
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
                  <div className="glass-card p-6 card-unproductive">
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
                  <div className="glass-card p-6 card-savings">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4 mt-8">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="btn-secondary flex items-center space-x-2 flex-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>
            )}
            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || totalRatio !== 100}
                className="btn-primary flex items-center space-x-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Bottom Links */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
              >
                Login here →
              </Link>
            </p>
            <Link
              to="/"
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </motion.div>

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
