// scripts/seedUser.js
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';

async function run() {
  await connectDB();

  const email = process.argv[2] || 'doctor@example.com';
  const password = process.argv[3] || 'password123';
  const role = process.argv[4] || 'DOCTOR';
  const fullName = process.argv[5] || 'Dr. John Doe';

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] User exists: ${email}`);
    await mongoose.connection.close();
    process.exit(0);
  }

  await User.create({ email, passwordHash, role, fullName });
  console.log(`[seed] Created user ${email} / role=${role}`);
  await mongoose.connection.close();
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});
