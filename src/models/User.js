import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },     // no unique index per your request
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['DOCTOR', 'STAFF', 'PATIENT'], required: true },
    name: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
