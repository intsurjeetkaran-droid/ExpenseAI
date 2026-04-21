const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update budget settings
router.put('/budget', auth, async (req, res) => {
  try {
    const { income, productive_ratio, unproductive_ratio, savings_ratio } = req.body;

    // Validate ratios sum to 100
    if (productive_ratio + unproductive_ratio + savings_ratio !== 100) {
      return res.status(400).json({ message: 'Ratios must sum to 100%' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { income, productive_ratio, unproductive_ratio, savings_ratio },
      { new: true }
    ).select('-password');

    res.json({ message: 'Budget updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
