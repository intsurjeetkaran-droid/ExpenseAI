const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // These fields are only for regular users, not admin
  income: {
    type: Number,
    default: 0,
    required: function() { return this.role === 'user'; }
  },
  productive_ratio: {
    type: Number,
    default: 60,
    required: function() { return this.role === 'user'; }
  },
  unproductive_ratio: {
    type: Number,
    default: 20,
    required: function() { return this.role === 'user'; }
  },
  savings_ratio: {
    type: Number,
    default: 20,
    required: function() { return this.role === 'user'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
