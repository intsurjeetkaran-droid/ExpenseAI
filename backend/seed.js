const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Expense = require('./models/Expense');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin (only email, password, role)
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
      // No income or budget ratios for admin
    });
    console.log('👑 Admin created');

    // Create 5 Regular Users with full details
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        income: 50000,
        productive_ratio: 60,
        unproductive_ratio: 20,
        savings_ratio: 20
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        income: 45000,
        productive_ratio: 65,
        unproductive_ratio: 20,
        savings_ratio: 15
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        role: 'user',
        income: 60000,
        productive_ratio: 55,
        unproductive_ratio: 25,
        savings_ratio: 20
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'user',
        income: 55000,
        productive_ratio: 60,
        unproductive_ratio: 20,
        savings_ratio: 20
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        password: hashedPassword,
        role: 'user',
        income: 48000,
        productive_ratio: 58,
        unproductive_ratio: 22,
        savings_ratio: 20
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 5 regular users created');

    // Create sample expenses for each user
    const expenses = [];
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education'];
    
    for (const user of createdUsers) {
      // Create 3-5 random expenses per user
      const numExpenses = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < numExpenses; i++) {
        const type = Math.random() > 0.5 ? 'productive' : 'unproductive';
        const amount = Math.floor(Math.random() * 5000) + 500;
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        expenses.push({
          user_id: user._id,
          title: `${category} Expense`,
          amount: amount,
          category: category,
          type: type,
          purpose: `Sample ${type} expense for ${category.toLowerCase()}`,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          ai_decision: Math.random() > 0.3 ? 'YES' : 'NO',
          ai_reason: Math.random() > 0.3 
            ? 'This expense fits within your budget and is reasonable for your financial goals.'
            : 'This expense may exceed your budget limits. Consider postponing or finding alternatives.'
        });
      }
    }

    await Expense.insertMany(expenses);
    console.log(`💰 ${expenses.length} sample expenses created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN (Monitor Only):');
    console.log('   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('   Role: admin');
    console.log('   Access: /admin dashboard');
    console.log('\n👥 USERS (Platform Users):');
    createdUsers.forEach((user, index) => {
      console.log(`\n   User ${index + 1}: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: password123`);
      console.log(`   Income: ₹${user.income.toLocaleString()}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
