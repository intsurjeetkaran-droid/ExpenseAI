const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register USER ONLY (not admin)
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      income, 
      productive_ratio, 
      unproductive_ratio, 
      savings_ratio 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create USER only (role is always 'user')
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Force user role
      income: income || 0,
      productive_ratio: productive_ratio || 60,
      unproductive_ratio: unproductive_ratio || 20,
      savings_ratio: savings_ratio || 20
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        income: user.income
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create ADMIN (separate endpoint, can be protected)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create ADMIN only (no income or budget ratios)
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
      // No income or budget ratios for admin
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login (for both admin and user)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return different data based on role
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Add income and ratios only for regular users
    if (user.role === 'user') {
      userData.income = user.income;
      userData.productive_ratio = user.productive_ratio;
      userData.unproductive_ratio = user.unproductive_ratio;
      userData.savings_ratio = user.savings_ratio;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
