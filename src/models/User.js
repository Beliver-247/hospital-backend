import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['DOCTOR', 'STAFF', 'PATIENT'], required: true },
  fullName: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
