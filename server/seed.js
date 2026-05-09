require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Check if admin already exists
  const existing = await User.findOne({ email: 'admin@smartservice.io' });
  if (existing) {
    console.log('ℹ️  Admin user already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@smartservice.io',
    password: 'Admin@123456',
    role: 'admin',
  });

  console.log('👑 Admin created successfully!');
  console.log('   Email:', admin.email);
  console.log('   Password: Admin@123456');
  console.log('   ⚠️  Change this password after first login!\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
