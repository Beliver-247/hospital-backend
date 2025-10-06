import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import env from '../config/env.js';

export async function login(email, password) {
  const user = await User.findOne({ email }).lean();
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: '12h' }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName
    }
  };
}
