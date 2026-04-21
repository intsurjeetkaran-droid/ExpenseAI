import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Sparkles, TrendingUp, DollarSign, BarChart3, Shield, 
  Zap, Users, CheckCircle, ArrowRight, Brain, Target, Wallet, Menu, X
} from 'lucide-react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations before making purchases with advanced AI analysis.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Wallet,
      title: 'Smart Budget Management',
      description: 'Track productive and unproductive spending with customizable budget ratios.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Visualize spending patterns with detailed charts and real-time insights.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry-standard security.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '₹50Cr+', label: 'Money Saved' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'AI Support' }
  ];

  const benefits = [
    'Reduce overspending by 40%',
    'Achieve savings goals faster',
    'Real-time budget alerts',
    'Personalized AI recommendations',
    'Track all expenses in one place',
    'Export financial reports'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 glass border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 md:space-x-3"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-2xl font-bold gradient-text">AI Expense Tracker</span>
            </motion.div>

            {/* Desktop Navigation Links */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden lg:flex items-center space-x-8"
            >
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('cta')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Get Started
              </button>
            </motion.div>

            {/* Desktop Auth Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-3 md:space-x-4"
            >
              <Link to="/login" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm md:text-base px-4 md:px-6 py-2">
                Get Started
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => scrollToSection('cta')}
                  className="text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  Get Started
                </button>
                <div className="border-t border-white/10 pt-4 flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 md:pt-20 pb-16 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-6 md:mb-8">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-brand-400" />
                <span className="text-xs md:text-sm text-brand-300">AI-Powered Financial Assistant</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 px-4"
            >
              Smart Expense Management
              <br />
              <span className="gradient-text">Before You Spend</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto px-4"
            >
              Make informed financial decisions with AI-powered insights. Track expenses, 
              set budgets, and achieve your savings goals with intelligent recommendations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-12 md:mb-16 px-4"
            >
              <Link to="/register" className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                <span>Start Free Today</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <button className="w-full sm:w-auto btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto px-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold gradient-text mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-xs md:text-base text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Powerful Features for <span className="gradient-text">Smart Spending</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 px-4">Everything you need to take control of your finances</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-5 md:p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-base md:text-xl text-gray-400 px-4">Simple steps to better financial management</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { step: '01', title: 'Set Your Budget', description: 'Define your monthly income and allocate percentages for productive spending, unproductive spending, and savings.' },
              { step: '02', title: 'Plan Before Spending', description: 'Before making a purchase, add it to the app. Our AI analyzes your budget and provides instant recommendations.' },
              { step: '03', title: 'Make Informed Decisions', description: 'Review AI suggestions, check budget impact, and decide whether to proceed. Track all expenses and watch your savings grow.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-6 md:p-8">
                  <div className="text-4xl md:text-6xl font-bold text-brand-500/20 mb-3 md:mb-4">{item.step}</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-brand-500 to-transparent"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Why Choose <span className="gradient-text">AI Expense Tracker?</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Join thousands of users who have transformed their financial habits with our intelligent platform.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-productive-500 flex-shrink-0" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="glass-card p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-8 h-8 text-brand-400" />
                    <span className="text-xl font-semibold">AI Recommendation</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-gray-400 mb-2">Expense: New Headphones</div>
                      <div className="text-3xl font-bold">₹4,000</div>
                    </div>
                    <div className="bg-productive-500/20 border border-productive-500/30 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-productive-500" />
                        <span className="font-semibold text-productive-400">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        This purchase fits within your unproductive budget (65% remaining). 
                        Consider waiting for upcoming sale to save 20%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 bg-gradient-to-br from-brand-500/20 to-purple-500/20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8 px-4">
              Join thousands of users making smarter financial decisions every day
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <Link to="/register" className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <button className="w-full sm:w-auto btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-lg md:text-xl font-bold">AI Expense Tracker</span>
              </div>
              <p className="text-sm md:text-base text-gray-400">
                Smart expense management powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Product</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors">Benefits</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Company</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Support</h3>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 md:pt-8 text-center text-sm md:text-base text-gray-400">
            <p>© 2026 AI Expense Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
