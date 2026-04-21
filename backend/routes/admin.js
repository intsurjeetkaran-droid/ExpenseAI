const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const expenses = await Expense.find();

    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    const productiveExpenses = expenses.filter(e => e.type === 'productive');
    const unproductiveExpenses = expenses.filter(e => e.type === 'unproductive');

    const productiveAmount = productiveExpenses.reduce((sum, e) => sum + e.amount, 0);
    const unproductiveAmount = unproductiveExpenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalUsers,
      totalExpenses,
      totalAmount,
      productive: {
        count: productiveExpenses.length,
        amount: productiveAmount,
        percentage: (productiveAmount / totalAmount) * 100
      },
      unproductive: {
        count: unproductiveExpenses.length,
        amount: unproductiveAmount,
        percentage: (unproductiveAmount / totalAmount) * 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get risk users (overspending)
router.get('/risk-users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find();
    const riskUsers = [];

    for (const user of users) {
      const expenses = await Expense.find({ user_id: user._id });

      const productive_spent = expenses
        .filter(e => e.type === 'productive')
        .reduce((sum, e) => sum + e.amount, 0);

      const unproductive_spent = expenses
        .filter(e => e.type === 'unproductive')
        .reduce((sum, e) => sum + e.amount, 0);

      const productive_limit = user.income * (user.productive_ratio / 100);
      const unproductive_limit = user.income * (user.unproductive_ratio / 100);

      if (productive_spent > productive_limit || unproductive_spent > unproductive_limit) {
        riskUsers.push({
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          overspending: {
            productive: productive_spent > productive_limit,
            unproductive: unproductive_spent > unproductive_limit
          },
          amounts: {
            productive_spent,
            productive_limit,
            unproductive_spent,
            unproductive_limit
          }
        });
      }
    }

    res.json(riskUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
