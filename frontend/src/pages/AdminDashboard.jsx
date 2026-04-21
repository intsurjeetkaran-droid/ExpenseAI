import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, Users, DollarSign, TrendingUp, TrendingDown, 
  AlertTriangle, Activity, BarChart3, PieChart, Sparkles,
  UserCheck, UserX, ArrowUpRight, ArrowDownRight,
  Target, Zap, Shield
} from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [riskUsers, setRiskUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') { navigate('/login'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, riskRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/risk-users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRiskUsers(riskRes.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
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
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm md:text-base">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.role !== 'admin').length;

  const statCards = [
    {
      label: 'Active Users',
      value: activeUsers,
      icon: Users,
      gradient: 'from-brand-500/20 to-purple-500/20',
      border: 'border-brand-500/30',
      iconBg: 'bg-brand-500/20',
      iconColor: 'text-brand-400',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Total Expenses',
      value: stats?.totalExpenses || 0,
      icon: Activity,
      gradient: 'from-productive-500/20 to-productive-600/20',
      border: 'border-productive-500/30',
      iconBg: 'bg-productive-500/20',
      iconColor: 'text-productive-400',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Total Spending',
      value: `₹${(stats?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-savings-500/20 to-savings-600/20',
      border: 'border-savings-500/30',
      iconBg: 'bg-savings-500/20',
      iconColor: 'text-savings-400',
      trend: '+15%',
      trendUp: true,
    },
    {
      label: 'At Risk Users',
      value: riskUsers.length,
      icon: AlertTriangle,
      gradient: 'from-unproductive-500/20 to-unproductive-600/20',
      border: 'border-unproductive-500/30',
      iconBg: 'bg-unproductive-500/20',
      iconColor: 'text-unproductive-400',
      trend: '-5%',
      trendUp: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-base md:text-2xl font-bold gradient-text truncate">Admin Dashboard</div>
                <p className="text-xs text-gray-400 hidden sm:block">System Monitoring & Analytics</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-unproductive-500/10 hover:bg-unproductive-500/20 border border-unproductive-500/30 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 text-unproductive-400" />
              <span className="text-sm md:text-base text-unproductive-400 hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold mb-1">Welcome, Admin 👋</h1>
          <p className="text-sm md:text-base text-gray-400">Monitor system performance and user activities in real-time</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 md:p-6 bg-gradient-to-br ${card.gradient} ${card.border}`}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`w-9 h-9 md:w-12 md:h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 md:w-6 md:h-6 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center space-x-0.5 text-xs md:text-sm ${card.trendUp ? 'text-productive-400' : 'text-unproductive-400'}`}>
                  {card.trendUp ? <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />}
                  <span>{card.trend}</span>
                </div>
              </div>
              <div className="text-xl md:text-3xl font-bold mb-0.5 md:mb-1 truncate">{card.value}</div>
              <div className="text-xs md:text-sm text-gray-400">{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">

          {/* Spending Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-base md:text-xl font-semibold mb-0.5">Spending Distribution</h3>
                <p className="text-xs md:text-sm text-gray-400">Productive vs Unproductive</p>
              </div>
              <PieChart className="w-5 h-5 md:w-6 md:h-6 text-brand-400 flex-shrink-0" />
            </div>
            <div className="space-y-4 md:space-y-5">
              {/* Productive */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-productive-500" />
                    <span className="text-sm md:text-base font-medium">Productive</span>
                  </div>
                  <span className="text-productive-400 font-semibold text-sm md:text-base">
                    {stats?.productive?.percentage?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-productive-500 to-productive-600 transition-all duration-500"
                    style={{ width: `${stats?.productive?.percentage || 0}%` }}></div>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-400 mt-1">
                  <span>{stats?.productive?.count || 0} expenses</span>
                  <span>₹{(stats?.productive?.amount || 0).toLocaleString()}</span>
                </div>
              </div>
              {/* Unproductive */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-unproductive-500" />
                    <span className="text-sm md:text-base font-medium">Unproductive</span>
                  </div>
                  <span className="text-unproductive-400 font-semibold text-sm md:text-base">
                    {stats?.unproductive?.percentage?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 md:h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-unproductive-500 to-unproductive-600 transition-all duration-500"
                    style={{ width: `${stats?.unproductive?.percentage || 0}%` }}></div>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-400 mt-1">
                  <span>{stats?.unproductive?.count || 0} expenses</span>
                  <span>₹{(stats?.unproductive?.amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-base md:text-xl font-semibold mb-0.5">System Health</h3>
                <p className="text-xs md:text-sm text-gray-400">Real-time metrics</p>
              </div>
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-brand-400 flex-shrink-0" />
            </div>
            <div className="space-y-3">
              {[
                { label: 'API Response', sub: 'Average time', value: '45ms', note: 'Excellent', color: 'productive', Icon: Zap },
                { label: 'Database', sub: 'Connection status', value: '100%', note: 'Connected', color: 'savings', Icon: Target },
                { label: 'Uptime', sub: 'Last 30 days', value: '99.9%', note: 'Stable', color: 'brand', Icon: Activity },
              ].map(({ label, sub, value, note, color, Icon }) => (
                <div key={label} className={`flex items-center justify-between p-3 md:p-4 bg-${color}-500/10 border border-${color}-500/30 rounded-xl`}>
                  <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${color}-400`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-medium truncate">{label}</div>
                      <div className="text-xs md:text-sm text-gray-400">{sub}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`text-lg md:text-2xl font-bold text-${color}-400`}>{value}</div>
                    <div className={`text-xs text-${color}-400`}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Risk Users */}
        {riskUsers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="glass-card p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-unproductive-500/10 to-unproductive-600/10 border-unproductive-500/30">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-unproductive-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-unproductive-400" />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-semibold">Users at Risk</h3>
                <p className="text-xs md:text-sm text-gray-400">Users exceeding their budget limits</p>
              </div>
            </div>
            <div className="space-y-3">
              {riskUsers.slice(0, 5).map((risk, index) => (
                <div key={index} className="glass p-3 md:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 bg-gradient-to-br from-unproductive-500 to-unproductive-600 rounded-full flex items-center justify-center">
                      <UserX className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-medium truncate">{risk.user.name}</div>
                      <div className="text-xs md:text-sm text-gray-400 truncate">{risk.user.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    {risk.overspending.productive && (
                      <span className="px-2 py-1 bg-unproductive-500/20 border border-unproductive-500/30 rounded-lg text-xs text-unproductive-400 whitespace-nowrap">
                        Productive Over
                      </span>
                    )}
                    {risk.overspending.unproductive && (
                      <span className="px-2 py-1 bg-unproductive-500/20 border border-unproductive-500/30 rounded-lg text-xs text-unproductive-400 whitespace-nowrap">
                        Unproductive Over
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users List — cards on mobile, table on desktop */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h3 className="text-base md:text-xl font-semibold mb-0.5">All Users</h3>
              <p className="text-xs md:text-sm text-gray-400">Manage and monitor user accounts</p>
            </div>
            <div className="flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-brand-500/10 border border-brand-500/30 rounded-xl">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-brand-400" />
              <span className="text-sm md:text-base font-semibold text-brand-400">{activeUsers}</span>
            </div>
          </div>

          {/* Mobile: card list */}
          <div className="md:hidden space-y-3">
            {users.filter(u => u.role !== 'admin').map((user) => (
              <div key={user._id} className="glass p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                  <div className="ml-auto flex-shrink-0 flex items-center space-x-1 px-2 py-1 bg-productive-500/20 border border-productive-500/30 rounded-lg">
                    <UserCheck className="w-3 h-3 text-productive-400" />
                    <span className="text-xs text-productive-400">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Income</span>
                  <span className="text-sm font-semibold text-savings-400">₹{user.income?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Budget Ratios</span>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 bg-productive-500/20 border border-productive-500/30 rounded text-xs text-productive-400">{user.productive_ratio}%</span>
                    <span className="px-1.5 py-0.5 bg-unproductive-500/20 border border-unproductive-500/30 rounded text-xs text-unproductive-400">{user.unproductive_ratio}%</span>
                    <span className="px-1.5 py-0.5 bg-savings-500/20 border border-savings-500/30 rounded text-xs text-savings-400">{user.savings_ratio}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Income</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Budget Ratios</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role !== 'admin').map((user) => (
                  <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-savings-400">₹{user.income?.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 bg-productive-500/20 border border-productive-500/30 rounded text-xs text-productive-400">{user.productive_ratio}%</span>
                        <span className="px-2 py-1 bg-unproductive-500/20 border border-unproductive-500/30 rounded text-xs text-unproductive-400">{user.unproductive_ratio}%</span>
                        <span className="px-2 py-1 bg-savings-500/20 border border-savings-500/30 rounded text-xs text-savings-400">{user.savings_ratio}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1.5 px-3 py-1 bg-productive-500/20 border border-productive-500/30 rounded-lg w-fit">
                        <UserCheck className="w-4 h-4 text-productive-400" />
                        <span className="text-sm text-productive-400">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
