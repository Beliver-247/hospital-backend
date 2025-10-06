import mongoose from 'mongoose';
import env from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  const dbName = 'hospital-db'; // <- your required database name
  await mongoose.connect(env.atlasUri, { dbName });
  console.log(`[db] Connected to MongoDB Atlas -> ${dbName}`);
}
