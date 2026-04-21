const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User');

// Add expense
router.post('/add', auth, async (req, res) => {
  try {
    const { title, amount, category, type, purpose } = req.body;

    const expense = new Expense({
      user_id: req.user.id,
      title,
      amount,
      category,
      type,
      purpose
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get expense list
router.get('/list', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user_id: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get budget summary
router.get('/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const expenses = await Expense.find({ user_id: req.user.id });

    const productive_spent = expenses
      .filter(e => e.type === 'productive')
      .reduce((sum, e) => sum + e.amount, 0);

    const unproductive_spent = expenses
      .filter(e => e.type === 'unproductive')
      .reduce((sum, e) => sum + e.amount, 0);

    const productive_limit = user.income * (user.productive_ratio / 100);
    const unproductive_limit = user.income * (user.unproductive_ratio / 100);
    const savings_target = user.income * (user.savings_ratio / 100);

    const total_spent = productive_spent + unproductive_spent;
    const savings_actual = user.income - total_spent;

    res.json({
      income: user.income,
      productive: {
        limit: productive_limit,
        spent: productive_spent,
        remaining: productive_limit - productive_spent,
        percentage: (productive_spent / productive_limit) * 100
      },
      unproductive: {
        limit: unproductive_limit,
        spent: unproductive_spent,
        remaining: unproductive_limit - unproductive_spent,
        percentage: (unproductive_spent / unproductive_limit) * 100
      },
      savings: {
        target: savings_target,
        actual: savings_actual,
        percentage: (savings_actual / savings_target) * 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
